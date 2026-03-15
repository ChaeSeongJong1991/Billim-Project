package com.billim.domain.vendor.api.dto

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import java.time.LocalDateTime

/**
 * 협력업체 생성 요청
 */
data class CreateVendorRequest(
    @field:NotBlank(message = "이름은 필수입니다.")
    val name: String,

    @field:NotBlank(message = "이메일은 필수입니다.")
    @field:Email(message = "올바른 이메일 형식이 아닙니다.")
    val email: String,

    @field:NotBlank(message = "전화번호는 필수입니다.")
    @field:Pattern(
        regexp = "^01[0-9]-?\\d{3,4}-?\\d{4}$",
        message = "올바른 전화번호 형식이 아닙니다."
    )
    val phone: String,

    @field:NotBlank(message = "주소는 필수입니다.")
    val address: String,

    @field:NotBlank(message = "카테고리는 필수입니다.")
    val category: String,

    @JsonProperty("description")
    val description: String = ""
)

/**
 * 협력업체 수정 요청
 */
data class UpdateVendorRequest(
    @field:NotBlank(message = "이름은 필수입니다.")
    val name: String,

    @field:NotBlank(message = "전화번호는 필수입니다.")
    @field:Pattern(
        regexp = "^01[0-9]-?\\d{3,4}-?\\d{4}$",
        message = "올바른 전화번호 형식이 아닙니다."
    )
    val phone: String,

    @field:NotBlank(message = "주소는 필수입니다.")
    val address: String,

    @JsonProperty("description")
    val description: String = ""
)

/**
 * 협력업체 기본 응답
 */
data class VendorResponse(
    @field:NotNull(message = "협력업체 ID는 필수입니다.")
    val id: Long,

    @field:NotBlank(message = "이름은 필수입니다.")
    val name: String,

    @field:NotBlank(message = "이메일은 필수입니다.")
    val email: String,

    @field:NotBlank(message = "전화번호는 필수입니다.")
    val phone: String,

    @field:NotBlank(message = "주소는 필수입니다.")
    val address: String,

    @field:NotBlank(message = "카테고리는 필수입니다.")
    val category: String
)

/**
 * 협력업체 상세 응답
 */
data class VendorDetailResponse(
    @field:NotNull(message = "협력업체 ID는 필수입니다.")
    val id: Long,

    @field:NotBlank(message = "이름은 필수입니다.")
    val name: String,

    @field:NotBlank(message = "이메일은 필수입니다.")
    val email: String,

    @field:NotBlank(message = "전화번호는 필수입니다.")
    val phone: String,

    @field:NotBlank(message = "주소는 필수입니다.")
    val address: String,

    @field:NotBlank(message = "카테고리는 필수입니다.")
    val category: String,

    @JsonProperty("description")
    val description: String = "",

    @JsonProperty("registered_at")
    val registeredAt: LocalDateTime = LocalDateTime.now(),

    @field:NotNull(message = "활성 상태는 필수입니다.")
    @JsonProperty("is_active")
    val isActive: Boolean = true
)

/**
 * 협력업체 목록 응답
 */
data class VendorListResponse(
    @field:NotNull(message = "협력업체 목록은 필수입니다.")
    val vendors: List<VendorResponse> = emptyList(),

    @field:NotNull(message = "전체 개수는 필수입니다.")
    @JsonProperty("total_count")
    val totalCount: Int = 0
)

/**
 * 협력업체 카테고리 요청
 */
data class VendorCategoryRequest(
    @field:NotNull(message = "카테고리 목록은 필수입니다.")
    val categories: List<String> = emptyList()
)

/**
 * 협력업체 성과 응답
 */
data class VendorPerformanceResponse(
    @field:NotNull(message = "협력업체 ID는 필수입니다.")
    val id: Long,

    @field:NotBlank(message = "협력업체 이름은 필수입니다.")
    val name: String,

    @field:NotNull(message = "완료된 작업은 필수입니다.")
    @JsonProperty("total_completed_work")
    val totalCompletedWork: Int = 0,

    @field:NotNull(message = "평균 완료 시간은 필수입니다.")
    @JsonProperty("avg_completion_days")
    val avgCompletionDays: Double = 0.0,

    @field:NotNull(message = "평점은 필수입니다.")
    val rating: Double = 0.0
)

/**
 * 민원 배정 요청
 */
data class AssignWorkOrderRequest(
    @field:NotNull(message = "민원 ID는 필수입니다.")
    @JsonProperty("work_order_id")
    val workOrderId: Long,

    @field:NotNull(message = "협력업체 ID는 필수입니다.")
    @JsonProperty("vendor_id")
    val vendorId: Long
)
