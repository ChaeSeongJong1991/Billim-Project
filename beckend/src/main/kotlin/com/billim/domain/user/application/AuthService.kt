package com.billim.domain.user.application

import com.billim.domain.user.api.dto.SignInRequest
import com.billim.domain.user.api.dto.SignUpRequest
import com.billim.domain.user.api.dto.TokenResponse
import com.billim.domain.user.domain.User
import com.billim.domain.user.infra.UserRepository
import com.billim.global.security.jwt.JwtTokenProvider
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true) // 기본적으로 읽기 전용 (성능 최적화)
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider,
    private val authenticationManagerBuilder: AuthenticationManagerBuilder
) {

    /**
     * 회원가입
     */
    @Transactional // 쓰기 작업이므로 readOnly = false
    fun signUp(request: SignUpRequest): Long {
        // 1. 이메일 중복 검사
        if (userRepository.existsByEmail(request.email)) {
            throw IllegalArgumentException("이미 가입된 이메일입니다.") // 추후 Custom Exception으로 교체 권장
        }

        // 2. 비밀번호 암호화 및 User 엔티티 생성
        val user = User(
            email = request.email,
            password = passwordEncoder.encode(request.password),
            name = request.name,
            provider = request.provider
        )

        // 3. 저장
        return userRepository.save(user).id!!
    }

    /**
     * 로그인
     */
    @Transactional // 로그인 실패 기록이나 LastLogin 업데이트 등을 위해 트랜잭션 필요 가능성 있음
    fun signIn(request: SignInRequest): TokenResponse {
        // 1. ID/PW를 기반으로 Authentication 객체 생성
        // 아직 인증되지 않은 토큰입니다.
        val authenticationToken = UsernamePasswordAuthenticationToken(request.email, request.password)

        // 2. 실제 검증 (여기서 loadUserByUsername 호출됨 -> 비밀번호 체크)
        // 실패 시 AuthenticationException 발생
        val authentication = authenticationManagerBuilder.`object`.authenticate(authenticationToken)

        // 3. 인증 정보로 JWT 토큰 생성
        val accessToken = jwtTokenProvider.createAccessToken(authentication)
        
        // Refresh Token 생성 로직 (현재는 Access와 동일하게 발급하거나 별도 로직 추가 가능)
        // MVP 단계에서는 일단 Access Token 발급에 집중하고, Refresh는 추후 Redis 연동 시 구현
        val refreshToken = "dummy-refresh-token" 

        return TokenResponse(accessToken, refreshToken)
    }
}
