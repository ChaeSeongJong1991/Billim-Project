package com.billim.domain.workorder.api.dto

import com.billim.domain.workorder.domain.Priority
import com.billim.domain.workorder.domain.WorkOrderCategory
import com.billim.domain.workorder.domain.WorkOrderStatus
import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

/**
 * WorkOrder 생성 요청
 */
data class CreateWorkOrderRequest(
    @field:NotNull(message = "임차인 ID는 필수입니다.")
    @field:Min(value = 1, message = "임차인 ID는 양수여야 합니다.")
    @JsonProperty("tenant_id")
    val tenantId: Long,

    @field:NotNull(message = "건물 ID는 필수입니다.")
    @field:Min(value = 1, message = "건물 ID는 양수여야 합니다.")
    @JsonProperty("building_id")
    val buildingId: Long,

    @field:NotNull(message = "호실 ID는 필수입니다.")
    @field:Min(value = 1, message = "호실 ID는 양수여야 합니다.")
    @JsonProperty("unit_id")
    val unitId: Long,

    @field:NotBlank(message = "제목은 필수입니다.")
    val title: String,

    val description: String? = null,

    @field:NotNull(message = "카테고리는 필수입니다.")
    val category: WorkOrderCategory,

    @field:NotNull(message = "우선순위는 필수입니다.")
    val priority: Priority = Priority.MEDIUM,

    @JsonProperty("images")
    val images: List<Long> = emptyList()
)

/**
 * WorkOrder 업데이트 요청
 */
data class UpdateWorkOrderRequest(
    @field:NotBlank(message = "제목은 필수입니다.")
    val title: String,

    val description: String? = null,

    @field:NotNull(message = "카테고리는 필수입니다.")
    val category: WorkOrderCategory,

    @field:NotNull(message = "우선순위는 필수입니다.")
    val priority: Priority
)

/**
 * WorkOrder 상태 업데이트 요청
 */
data class UpdateWorkOrderStatusRequest(
    @field:NotNull(message = "상태는 필수입니다.")
    val status: WorkOrderStatus,

    @JsonProperty("description")
    val description: String? = null
)

/**
 * WorkOrder 기본 정보 응답 DTO
 */
data class WorkOrderResponse(
    @field:NotNull(message = "WorkOrder ID는 필수입니다.")
    val id: Long,

    @field:NotNull(message = "임차인 ID는 필수입니다.")
    @JsonProperty("tenant_id")
    val tenantId: Long,

    @field:NotNull(message = "건물 ID는 필수입니다.")
    @JsonProperty("building_id")
    val buildingId: Long,

    @field:NotNull(message = "호실 ID는 필수입니다.")
    @JsonProperty("unit_id")
    val unitId: Long,

    @field:NotBlank(message = "제목은 필수입니다.")
    val title: String,

    val description: String? = null,

    @field:NotNull(message = "카테고리는 필수입니다.")
    val category: WorkOrderCategory,

    @field:NotNull(message = "우선순위는 필수입니다.")
    val priority: Priority,

    @field:NotNull(message = "상태는 필수입니다.")
    val status: WorkOrderStatus,

    @JsonProperty("assigned_vendor_id")
    val assignedVendorId: Long? = null,

    @JsonProperty("image_count")
    val imageCount: Int = 0,

    @JsonProperty("created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @JsonProperty("updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

/**
 * WorkOrder 상세 조회 응답 DTO
 */
data class WorkOrderDetailResponse(
    @field:NotNull(message = "WorkOrder ID는 필수입니다.")
    val id: Long,

    @field:NotNull(message = "임차인 ID는 필수입니다.")
    @JsonProperty("tenant_id")
    val tenantId: Long,

    @field:NotNull(message = "건물 ID는 필수입니다.")
    @JsonProperty("building_id")
    val buildingId: Long,

    @field:NotNull(message = "호실 ID는 필수입니다.")
    @JsonProperty("unit_id")
    val unitId: Long,

    @field:NotBlank(message = "제목은 필수입니다.")
    val title: String,

    val description: String? = null,

    @field:NotNull(message = "카테고리는 필수입니다.")
    val category: WorkOrderCategory,

    @field:NotNull(message = "우선순위는 필수입니다.")
    val priority: Priority,

    @field:NotNull(message = "상태는 필수입니다.")
    val status: WorkOrderStatus,

    @JsonProperty("assigned_vendor_id")
    val assignedVendorId: Long? = null,

    @JsonProperty("images")
    val images: List<WorkOrderImageResponse> = emptyList(),

    @JsonProperty("timeline")
    val timeline: List<WorkOrderTimelineResponse> = emptyList(),

    @JsonProperty("created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @JsonProperty("updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

/**
 * WorkOrder 목록 응답 DTO
 */
data class WorkOrderListResponse(
    @field:NotNull(message = "WorkOrder 목록은 필수입니다.")
    @JsonProperty("work_orders")
    val workOrders: List<WorkOrderResponse> = emptyList(),

    @field:NotNull(message = "전체 개수는 필수입니다.")
    @JsonProperty("total_count")
    val totalCount: Int = 0,

    @field:NotNull(message = "페이지 번호는 필수입니다.")
    @JsonProperty("page_number")
    val pageNumber: Int = 1,

    @field:NotNull(message = "페이지 크기는 필수입니다.")
    @JsonProperty("page_size")
    val pageSize: Int = 10
)

/**
 * WorkOrder 필터 요청 DTO
 */
data class WorkOrderFilterRequest(
    @JsonProperty("status")
    val status: WorkOrderStatus? = null,

    @JsonProperty("priority")
    val priority: Priority? = null,

    @JsonProperty("category")
    val category: WorkOrderCategory? = null,

    @JsonProperty("tenant_id")
    val tenantId: Long? = null,

    @JsonProperty("building_id")
    val buildingId: Long? = null,

    @JsonProperty("date_range_start")
    val dateRangeStart: LocalDateTime? = null,

    @JsonProperty("date_range_end")
    val dateRangeEnd: LocalDateTime? = null,

    @field:NotNull(message = "페이지 번호는 필수입니다.")
    @JsonProperty("page_number")
    val pageNumber: Int = 1,

    @field:NotNull(message = "페이지 크기는 필수입니다.")
    @JsonProperty("page_size")
    val pageSize: Int = 10
)

/**
 * WorkOrder 타임라인 응답 DTO
 */
data class WorkOrderTimelineResponse(
    val id: Long,

    @field:NotNull(message = "상태는 필수입니다.")
    val status: WorkOrderStatus,

    val description: String? = null,

    @field:NotBlank(message = "변경자는 필수입니다.")
    @JsonProperty("changed_by")
    val changedBy: String,

    @JsonProperty("changed_at")
    val changedAt: LocalDateTime = LocalDateTime.now()
)

/**
 * WorkOrder 이미지 응답 DTO
 */
data class WorkOrderImageResponse(
    @field:NotNull(message = "이미지 ID는 필수입니다.")
    val id: Long,

    @field:NotBlank(message = "이미지 URL은 필수입니다.")
    @JsonProperty("image_url")
    val imageUrl: String,

    @JsonProperty("uploaded_at")
    val uploadedAt: LocalDateTime = LocalDateTime.now()
)

/**
 * WorkOrder 협력업체 할당 요청 DTO
 */
data class AssignVendorRequest(
    @field:NotNull(message = "협력업체 ID는 필수입니다.")
    @field:Min(value = 1, message = "협력업체 ID는 양수여야 합니다.")
    @JsonProperty("vendor_id")
    val vendorId: Long
)

/**
 * WorkOrder 협력업체 할당 해제 응답 DTO
 */
data class UnassignVendorResponse(
    val id: Long,
    val title: String,
    val status: WorkOrderStatus,
    val message: String = "협력업체 할당이 해제되었습니다."
)

/**
 * WorkOrder 생성 응답 DTO
 */
data class CreateWorkOrderResponse(
    val id: Long,

    @JsonProperty("tenant_id")
    val tenantId: Long,

    @JsonProperty("building_id")
    val buildingId: Long,

    @JsonProperty("unit_id")
    val unitId: Long,

    val title: String,

    val status: WorkOrderStatus,

    val category: WorkOrderCategory,

    val priority: Priority,

    val message: String = "WorkOrder가 성공적으로 생성되었습니다."
)
