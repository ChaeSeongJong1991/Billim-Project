package com.billim.global.security.jwt

import com.billim.domain.user.domain.Role
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.env.Environment
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(
    @Value("\${jwt.secret}") private val secretKey: String,
    @Value("\${jwt.access-token-validity}") private val validityInMilliseconds: Long,
    private val environment: Environment
) {

    private val logger = LoggerFactory.getLogger(this::class.java)

    companion object {
        private const val DEFAULT_DEV_SECRET = "billim-local-dev-secret-key-must-be-at-least-32-chars-long"
    }

    init {
        if (secretKey.isBlank()) {
            throw IllegalStateException("JWT secret must not be blank. Set the JWT_SECRET environment variable.")
        }

        val activeProfiles = environment.activeProfiles.toSet()
        val isProduction = activeProfiles.contains("prod") || activeProfiles.contains("production")

        if (secretKey == DEFAULT_DEV_SECRET) {
            if (isProduction) {
                throw IllegalStateException(
                    "Default JWT secret must not be used in production. Set a unique JWT_SECRET environment variable."
                )
            } else {
                logger.warn("Using default JWT secret. This is acceptable for local development only. Set JWT_SECRET for other environments.")
            }
        }
    }

    private val key: SecretKey by lazy {
        Keys.hmacShaKeyFor(secretKey.toByteArray(Charsets.UTF_8))
    }

    // 소셜 로그인용: email + role로 직접 토큰 생성
    fun createAccessToken(email: String, role: Role): String {
        val authorities = "ROLE_$role"
        val now = Date()
        val validity = Date(now.time + validityInMilliseconds)

        return Jwts.builder()
            .subject(email)
            .claim("auth", authorities)
            .issuedAt(now)
            .expiration(validity)
            .signWith(key)
            .compact()
    }

    // 토큰에서 인증 정보 추출
    fun getAuthentication(token: String): Authentication {
        val claims = parseClaims(token)
        val authorities = claims["auth"]?.toString()?.split(",")
            ?.map { SimpleGrantedAuthority(it) }
            ?: emptyList()

        val principal = User(claims.subject, "", authorities)
        return UsernamePasswordAuthenticationToken(principal, token, authorities)
    }

    // 토큰 유효성 검증
    fun validateToken(token: String): Boolean {
        return try {
            parseClaims(token)
            true
        } catch (e: Exception) {
            logger.warn("Invalid JWT token: ${e.message}")
            false
        }
    }

    private fun parseClaims(token: String): Claims {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload
    }
}
