package com.billim.domain.user.application

import com.billim.domain.user.api.dto.NaverCallbackRequest
import com.billim.domain.user.api.dto.SocialLoginRequest
import com.billim.domain.user.api.dto.TokenResponse
import com.billim.domain.user.domain.AuthProvider
import com.billim.domain.user.domain.User
import com.billim.domain.user.infra.UserRepository
import com.billim.global.security.jwt.JwtTokenProvider
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth
import org.slf4j.LoggerFactory
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate

@Service
@Transactional(readOnly = true)
class AuthService(
    private val userRepository: UserRepository,
    private val jwtTokenProvider: JwtTokenProvider,
    private val restTemplate: RestTemplate
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    /**
     * 소셜 로그인 — 최초 로그인 시 자동 회원가입
     */
    @Transactional
    fun socialLogin(request: SocialLoginRequest): TokenResponse {
        val (email, name, providerId) = when (request.provider) {
            AuthProvider.GOOGLE -> verifyGoogleToken(request.idToken)
            AuthProvider.KAKAO  -> verifyKakaoToken(request.idToken)
            AuthProvider.NAVER  -> verifyNaverToken(request.idToken)
        }

        logger.info("Social login: provider={}, email={}", request.provider, email)

        val user = userRepository.findByEmail(email) ?: run {
            logger.info("신규 사용자 자동 가입: {}", email)
            userRepository.save(
                User(
                    email      = email,
                    name       = name,
                    provider   = request.provider,
                    providerId = providerId
                )
            )
        }

        val accessToken = jwtTokenProvider.createAccessToken(user.email, user.role)
        return TokenResponse(accessToken)
    }

    // ── Google (Firebase ID Token 검증) ──────────────────────────────────────

    private fun verifyGoogleToken(idToken: String): Triple<String, String, String> {
        check(FirebaseApp.getApps().isNotEmpty()) {
            "Firebase가 초기화되지 않았습니다. serviceAccountKey.json을 확인해주세요."
        }
        val decoded = FirebaseAuth.getInstance().verifyIdToken(idToken)
        val email = decoded.email
            ?: throw IllegalArgumentException("Google 계정에 이메일이 없습니다.")
        return Triple(email, decoded.name ?: "사용자", decoded.uid)
    }

    // ── Kakao (Access Token으로 사용자 정보 조회) ────────────────────────────

    @Suppress("UNCHECKED_CAST")
    private fun verifyKakaoToken(accessToken: String): Triple<String, String, String> {
        val headers = HttpHeaders().apply { set("Authorization", "Bearer $accessToken") }
        val response = restTemplate.exchange(
            "https://kapi.kakao.com/v2/user/me",
            HttpMethod.GET,
            HttpEntity<String>(headers),
            Map::class.java
        )
        val body = response.body
            ?: throw IllegalArgumentException("Kakao 사용자 정보를 가져올 수 없습니다.")
        val kakaoAccount = body["kakao_account"] as? Map<*, *>
            ?: throw IllegalArgumentException("Kakao 계정 정보가 없습니다.")
        val email = kakaoAccount["email"] as? String
            ?: throw IllegalArgumentException("Kakao 이메일 제공 동의가 필요합니다.")
        val profile = kakaoAccount["profile"] as? Map<*, *>
        val name = profile?.get("nickname") as? String ?: "카카오 사용자"
        return Triple(email, name, body["id"]?.toString() ?: "")
    }

    // ── Naver OAuth Callback (authorization code → access token → user info) ──

    @Transactional
    fun naverCallback(request: NaverCallbackRequest): TokenResponse {
        val accessToken = exchangeNaverCode(request.code, request.state)
        val (email, name, providerId) = verifyNaverToken(accessToken)

        logger.info("Naver login: email={}", email)

        val user = userRepository.findByEmail(email) ?: run {
            logger.info("신규 사용자 자동 가입 (Naver): {}", email)
            userRepository.save(
                User(email = email, name = name, provider = AuthProvider.NAVER, providerId = providerId)
            )
        }

        return TokenResponse(jwtTokenProvider.createAccessToken(user.email, user.role))
    }

    @Suppress("UNCHECKED_CAST")
    private fun exchangeNaverCode(code: String, state: String): String {
        val clientId = System.getenv("NAVER_CLIENT_ID")
            ?: throw IllegalStateException("NAVER_CLIENT_ID 환경변수가 설정되지 않았습니다.")
        val clientSecret = System.getenv("NAVER_CLIENT_SECRET")
            ?: throw IllegalStateException("NAVER_CLIENT_SECRET 환경변수가 설정되지 않았습니다.")
        val url = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code" +
                  "&client_id=$clientId&client_secret=$clientSecret&code=$code&state=$state"
        val response = restTemplate.getForObject(url, Map::class.java)
        return response?.get("access_token") as? String
            ?: throw IllegalArgumentException("Naver access token 발급에 실패했습니다.")
    }

    // ── Naver (Access Token으로 사용자 정보 조회) ────────────────────────────

    @Suppress("UNCHECKED_CAST")
    private fun verifyNaverToken(accessToken: String): Triple<String, String, String> {
        val headers = HttpHeaders().apply { set("Authorization", "Bearer $accessToken") }
        val response = restTemplate.exchange(
            "https://openapi.naver.com/v1/nid/me",
            HttpMethod.GET,
            HttpEntity<String>(headers),
            Map::class.java
        )
        val body = response.body
            ?: throw IllegalArgumentException("Naver 사용자 정보를 가져올 수 없습니다.")
        val responseData = body["response"] as? Map<*, *>
            ?: throw IllegalArgumentException("Naver 응답이 없습니다.")
        val email = responseData["email"] as? String
            ?: throw IllegalArgumentException("Naver 이메일 제공 동의가 필요합니다.")
        val name = responseData["name"] as? String ?: "네이버 사용자"
        return Triple(email, name, responseData["id"] as? String ?: "")
    }
}
