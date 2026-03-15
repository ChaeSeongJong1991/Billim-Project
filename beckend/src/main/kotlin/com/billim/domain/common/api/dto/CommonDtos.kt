package com.billim.domain.common.api.dto

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

/**
 * 공통 API 응답 wrapper
 */
data class ApiResponse<T>(
    @field:NotNull(message = "성공 여부는 필수입니다.")
    val success: Boolean,

    val data: T? = null,

    val message: String = "",

    @JsonProperty("timestamp")
    val timestamp: LocalDateTime = LocalDateTime.now()
)

/**
 * 임차인 대시보드 응답
 */
data class TenantDashboardResponse(
    @field:NotNull(message = "통계는 필수입니다.")
    @JsonProperty("stats")
    val stats: DashboardStats,

    @field:NotNull(message = "최근 민원 목록은 필수입니다.")
    @JsonProperty("recent_work_orders")
    val recentWorkOrders: List<DashboardWorkOrderItem> = emptyList(),

    @JsonProperty("timestamp")
    val timestamp: LocalDateTime = LocalDateTime.now()
)

/**
 * 대시보드 통계
 */
data class DashboardStats(
    @field:NotNull(message = "접수된 민원 수는 필수입니다.")
    @JsonProperty("received_count")
    val receivedCount: Int = 0,

    @field:NotNull(message = "진행 중인 민원 수는 필수입니다.")
    @JsonProperty("in_progress_count")
    val inProgressCount: Int = 0,

    @field:NotNull(message = "완료된 민원 수는 필수입니다.")
    @JsonProperty("completed_count")
    val completedCount: Int = 0
)

/**
 * 대시보드 민원 항목
 */
data class DashboardWorkOrderItem(
    @field:NotNull(message = "민원 ID는 필수입니다.")
    val id: Long,

    @field:NotNull(message = "제목은 필수입니다.")
    val title: String,

    @field:NotNull(message = "상태는 필수입니다.")
    val status: String,

    @field:NotNull(message = "우선순위는 필수입니다.")
    val priority: String,

    @field:NotNull(message = "카테고리는 필수입니다.")
    val category: String,

    @JsonProperty("created_at")
    val createdAt: LocalDateTime = LocalDateTime.now()
)

/**
 * 관리자 대시보드 응답
 */
data class AdminDashboardResponse(
    @field:NotNull(message = "KPI는 필수입니다.")
    val kpi: DashboardKPI,

    @field:NotNull(message = "상태별 분포는 필수입니다.")
    @JsonProperty("status_distribution")
    val statusDistribution: Map<String, Int> = emptyMap(),

    @field:NotNull(message = "카테고리별 분포는 필수입니다.")
    @JsonProperty("category_distribution")
    val categoryDistribution: Map<String, Int> = emptyMap(),

    @field:NotNull(message = "최근 민원은 필수입니다.")
    @JsonProperty("recent_work_orders")
    val recentWorkOrders: List<DashboardWorkOrderItem> = emptyList(),

    @JsonProperty("timestamp")
    val timestamp: LocalDateTime = LocalDateTime.now()
)

/**
 * 대시보드 KPI (Key Performance Indicator)
 */
data class DashboardKPI(
    @field:NotNull(message = "완료율은 필수입니다.")
    @JsonProperty("completion_rate")
    val completionRate: Double = 0.0,

    @field:NotNull(message = "평균 처리 시간(일)은 필수입니다.")
    @JsonProperty("avg_completion_days")
    val avgCompletionDays: Double = 0.0,

    @field:NotNull(message = "총 민원 수는 필수입니다.")
    @JsonProperty("total_work_orders")
    val totalWorkOrders: Int = 0,

    @field:NotNull(message = "이번 달 완료된 민원은 필수입니다.")
    @JsonProperty("this_month_completed")
    val thisMonthCompleted: Int = 0
)

/**
 * 이미지 업로드 요청
 */
data class ImageUploadRequest(
    @field:NotNull(message = "작업 ID는 필수입니다.")
    @JsonProperty("work_order_id")
    val workOrderId: Long? = null
)

/**
 * 이미지 업로드 응답
 */
data class ImageUploadResponse(
    @field:NotNull(message = "이미지 ID는 필수입니다.")
    val id: Long,

    @field:NotNull(message = "이미지 URL은 필수입니다.")
    @JsonProperty("image_url")
    val imageUrl: String,

    @JsonProperty("uploaded_at")
    val uploadedAt: LocalDateTime = LocalDateTime.now()
) {
    fun copy(
        id: Long = this.id,
        imageUrl: String = this.imageUrl,
        uploadedAt: LocalDateTime = this.uploadedAt
    ) = ImageUploadResponse(id, imageUrl, uploadedAt)
}

/**
 * 이미지 삭제 요청
 */
data class ImageDeleteRequest(
    @field:NotNull(message = "이미지 ID는 필수입니다.")
    @JsonProperty("image_id")
    val imageId: Long
)

/**
 * 페이지네이션 요청
 */
data class PaginationRequest(
    @field:NotNull(message = "페이지는 필수입니다.")
    val page: Int = 0,

    @field:NotNull(message = "페이지 크기는 필수입니다.")
    @JsonProperty("page_size")
    val pageSize: Int = 10
)
