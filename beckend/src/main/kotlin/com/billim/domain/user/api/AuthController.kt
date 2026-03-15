package com.billim.domain.user.api

import com.billim.domain.user.api.dto.NaverCallbackRequest
import com.billim.domain.user.api.dto.SocialLoginRequest
import com.billim.domain.user.api.dto.TokenResponse
import com.billim.domain.user.application.AuthService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(
    private val authService: AuthService
) {

    /**
     * POST /api/v1/auth/social
     * Google / Kakao 소셜 로그인 — 최초 접근 시 자동 회원가입
     */
    @PostMapping("/social")
    fun socialLogin(@Valid @RequestBody request: SocialLoginRequest): ResponseEntity<TokenResponse> {
        return ResponseEntity.ok(authService.socialLogin(request))
    }

    /**
     * POST /api/v1/auth/social/naver
     * Naver OAuth 콜백 — authorization code를 access token으로 교환 후 로그인
     */
    @PostMapping("/social/naver")
    fun naverCallback(@Valid @RequestBody request: NaverCallbackRequest): ResponseEntity<TokenResponse> {
        return ResponseEntity.ok(authService.naverCallback(request))
    }
}
