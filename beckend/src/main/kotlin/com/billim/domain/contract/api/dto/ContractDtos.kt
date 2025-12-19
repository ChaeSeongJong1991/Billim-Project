package com.billim.domain.contract.api.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDate

data class ContractCreateRequest(
    @field:NotNull(message = "건물 ID는 필수입니다.")
    val buildingId: Long,

    @field:NotBlank(message = "호수는 필수입니다.")
    val roomNumber: String,

    @field:NotBlank(message = "세입자 이름은 필수입니다.")
    val tenantName: String,

    @field:NotBlank(message = "세입자 연락처는 필수입니다.")
    val tenantPhone: String,

    @field:NotNull
    @field:Min(0)
    val deposit: Long,

    @field:NotNull
    @field:Min(0)
    val monthlyRent: Long,

    @field:NotNull
    @field:Min(1) @field:Max(31)
    val rentDay: Int,

    @field:NotNull
    val startDate: LocalDate,

    @field:NotNull
    val endDate: LocalDate
)

data class ContractResponse(
    val id: Long,
    val buildingName: String, // 건물 이름 포함 (편의성)
    val roomNumber: String,
    val tenantName: String,
    val monthlyRent: Long,
    val rentDay: Int,
    val startDate: LocalDate,
    val endDate: LocalDate
)
