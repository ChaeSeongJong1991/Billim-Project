package com.billim.domain.user.api

import com.billim.domain.user.api.dto.SignInRequest
import com.billim.domain.user.api.dto.SignUpRequest
import com.billim.domain.user.api.dto.TokenResponse
import com.billim.domain.user.application.AuthService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
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

    @PostMapping("/signup")
    fun signUp(@Valid @RequestBody request: SignUpRequest): ResponseEntity<String> {
        authService.signUp(request)
        return ResponseEntity.status(HttpStatus.CREATED).body("회원가입 성공")
    }

    @PostMapping("/signin")
    fun signIn(@Valid @RequestBody request: SignInRequest): ResponseEntity<TokenResponse> {
        val tokenResponse = authService.signIn(request)
        return ResponseEntity.ok(tokenResponse)
    }
}
