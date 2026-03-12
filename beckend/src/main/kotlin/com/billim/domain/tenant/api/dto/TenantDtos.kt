package com.billim.domain.tenant.api.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern

data class TenantCreateRequest(
    @field:NotBlank(message = "이름은 필수입니다.")
    val name: String,

    @field:NotBlank(message = "휴대폰 번호는 필수입니다.")
    @field:Pattern(
        regexp = "^01[0-9]-?\\d{3,4}-?\\d{4}$",
        message = "올바른 휴대폰 번호 형식이 아닙니다."
    )
    val phoneNumber: String
)

data class TenantUpdateRequest(
    @field:NotBlank(message = "이름은 필수입니다.")
    val name: String,

    @field:NotBlank(message = "휴대폰 번호는 필수입니다.")
    @field:Pattern(
        regexp = "^01[0-9]-?\\d{3,4}-?\\d{4}$",
        message = "올바른 휴대폰 번호 형식이 아닙니다."
    )
    val phoneNumber: String
)

data class TenantResponse(
    val id: Long,
    val name: String,
    val phoneNumber: String,
    val isAppUser: Boolean  // userId != null 이면 앱 가입 세입자
)
