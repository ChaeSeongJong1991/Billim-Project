package com.billim.domain.contract.api.dto

import com.billim.domain.contract.domain.ContractType
import com.billim.domain.contract.domain.RenewalStatus
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

    @field:NotNull(message = "계약 유형은 필수입니다.")
    val contractType: ContractType,

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
    @field:Min(0)
    val maintenanceFee: Long = 0,

    @field:NotNull
    @field:Min(1) @field:Max(31)
    val rentDay: Int,

    @field:NotNull
    val startDate: LocalDate,

    @field:NotNull
    val endDate: LocalDate,

    @field:NotNull
    @field:Min(1)
    val householdCount: Int = 1,

    val memo: String? = null
)

data class ContractUpdateRequest(
    @field:NotNull(message = "계약 유형은 필수입니다.")
    val contractType: ContractType,

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
    @field:Min(0)
    val maintenanceFee: Long = 0,

    @field:NotNull
    @field:Min(1) @field:Max(31)
    val rentDay: Int,

    @field:NotNull
    val startDate: LocalDate,

    @field:NotNull
    val endDate: LocalDate,

    @field:NotNull
    @field:Min(1)
    val householdCount: Int = 1,

    val memo: String? = null
)

data class ContractResponse(
    val id: Long,
    val buildingId: Long,
    val buildingName: String,
    val roomNumber: String,
    val contractType: ContractType,
    val tenantName: String,
    val tenantPhone: String,
    val deposit: Long,
    val monthlyRent: Long,
    val maintenanceFee: Long,
    val rentDay: Int,
    val startDate: LocalDate,
    val endDate: LocalDate,
    val householdCount: Int,
    val memo: String?,
    val renewalStatus: RenewalStatus = RenewalStatus.ACTIVE,
    val parentContractId: Long? = null
)

data class ExpiringContractResponse(
    val id: Long,
    val buildingId: Long,
    val buildingName: String,
    val roomNumber: String,
    val tenantName: String,
    val tenantPhone: String,
    val monthlyRent: Long,
    val deposit: Long,
    val startDate: LocalDate,
    val endDate: LocalDate,
    val daysLeft: Long,
    val contractType: ContractType,
    val renewalStatus: RenewalStatus
)

enum class RenewType { KEEP, MODIFY }

data class ContractRenewRequest(
    @field:NotNull(message = "갱신 유형은 필수입니다.")
    val renewType: RenewType,

    @field:NotNull(message = "새 종료일은 필수입니다.")
    val newEndDate: LocalDate,

    // MODIFY 시 변경 가능한 항목들 (null이면 기존 값 유지)
    val newStartDate: LocalDate? = null,
    @field:Min(0) val monthlyRent: Long? = null,
    @field:Min(0) val deposit: Long? = null,
    @field:Min(0) val maintenanceFee: Long? = null,
    @field:Min(1) @field:Max(31) val rentDay: Int? = null,
    val memo: String? = null
)
