package com.billim.global.security.jwt

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.JwtException
import org.springframework.beans.factory.annotation.Value
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
    @Value("\${jwt.access-token-validity}") private val validityInMilliseconds: Long
) {

    private val key: SecretKey by lazy {
        // HmacShaKeyFor는 최소 256비트(32바이트) 이상의 키를 요구합니다.
        // 일반 문자열을 그대로 쓰면 약할 수 있으므로 UTF-8 Bytes로 변환하여 사용합니다.
        Keys.hmacShaKeyFor(secretKey.toByteArray(Charsets.UTF_8))
    }

    // 1. 토큰 생성 (Access Token)
    fun createAccessToken(authentication: Authentication): String {
        val authorities = authentication.authorities.joinToString(",") { it.authority }
        val now = Date()
        val validity = Date(now.time + validityInMilliseconds)

        return Jwts.builder()
            .subject(authentication.name) // 주로 email
            .claim("auth", authorities)   // 권한 정보 (ROLE_USER 등)
            .issuedAt(now)
            .expiration(validity)
            .signWith(key) // 기본 알고리즘: HS256
            .compact()
    }

    // 2. 토큰에서 인증 정보 추출 (Authentication 객체 리턴)
    // DB를 거치지 않고 토큰에서 바로 권한을 가져와 성능을 최적화합니다.
    fun getAuthentication(token: String): Authentication {
        val claims = parseClaims(token)
        val authorities = claims["auth"]?.toString()?.split(",")
            ?.map { SimpleGrantedAuthority(it) } 
            ?: emptyList()

        // UserDetails 객체를 만들어서 Authentication에 담음 (비밀번호는 빈 문자열 처리)
        val principal = User(claims.subject, "", authorities)
        
        return UsernamePasswordAuthenticationToken(principal, token, authorities)
    }

    // 3. 토큰 유효성 검증
    fun validateToken(token: String): Boolean {
        try {
            parseClaims(token)
            return true
        } catch (e: Exception) {
            // 운영 로그를 남겨야 하는 지점 (만료, 변조, 형식 오류 등)
             println("Invalid JWT token: ${e.message}")
            return false
        }
    }

    // 내부적으로 토큰 파싱 (예외 발생 시 validateToken에서 잡음)
    private fun parseClaims(token: String): Claims {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload
    }
}
