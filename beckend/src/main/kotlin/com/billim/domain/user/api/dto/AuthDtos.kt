package com.billim.domain.user.api.dto

import com.billim.domain.user.domain.AuthProvider
import jakarta.validation.constraints.NotBlank

// 소셜 로그인 요청 (Google/Kakao — 프론트에서 access/id token 전달)
data class SocialLoginRequest(
    @field:NotBlank(message = "토큰이 필요합니다.")
    val idToken: String,

    val provider: AuthProvider
)

// Naver OAuth 콜백 요청 (authorization code 방식)
data class NaverCallbackRequest(
    @field:NotBlank
    val code: String,

    @field:NotBlank
    val state: String
)

// 토큰 응답
data class TokenResponse(
    val accessToken: String,
    val tokenType: String = "Bearer"
)
