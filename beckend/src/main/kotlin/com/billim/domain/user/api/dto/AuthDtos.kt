package com.billim.domain.user.api.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import com.billim.domain.user.domain.AuthProvider

// 회원가입 요청
data class SignUpRequest(
    @field:Email(message = "이메일 형식이 올바르지 않습니다.")
    @field:NotBlank
    val email: String,

    @field:NotBlank
    @field:Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.")
    val password: String,

    @field:NotBlank
    val name: String,

    val provider: AuthProvider = AuthProvider.LOCAL
)

// 로그인 요청
data class SignInRequest(
    @field:Email
    @field:NotBlank
    val email: String,

    @field:NotBlank
    val password: String
)

// 토큰 응답 (프론트엔드로 내려줄 데이터)
data class TokenResponse(
    val accessToken: String,
    val refreshToken: String, // 추후 Redis 연동 시 사용
    val tokenType: String = "Bearer"
)
