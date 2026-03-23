package com.billim.domain.maintenance.api.dto

import com.billim.domain.workorder.domain.WorkOrderCategory
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.LocalDate
import java.time.LocalDateTime

// ─── 예방 정비 가이드 요청 ─────────────────────────────────────────────────────

data class MaintenanceGuideCreateRequest(
    @field:NotBlank(message = "항목명은 필수입니다")
    @field:Size(min = 1, max = 150, message = "항목명은 1-150자 사이여야 합니다")
    val title: String,

    @field:NotNull(message = "카테고리는 필수입니다")
    val category: WorkOrderCategory,

    @field:NotNull(message = "정비 주기는 필수입니다")
    @field:Min(value = 1, message = "정비 주기는 최소 1개월 이상이어야 합니다")
    val intervalMonths: Int,

    @field:Size(max = 1000, message = "설명은 최대 1000자 사이여야 합니다")
    val description: String? = null,

    @field:NotNull(message = "기준 시행일은 필수입니다")
    val baseExecutionDate: LocalDate,

    @field:Size(max = 500, message = "영향 호실은 최대 500개까지 선택 가능합니다")
    val affectedRoomIds: List<Long> = emptyList()
)

data class MaintenanceGuideUpdateRequest(
    @field:Size(min = 1, max = 150, message = "항목명은 1-150자 사이여야 합니다")
    val title: String? = null,

    val category: WorkOrderCategory? = null,

    @field:Min(value = 1, message = "정비 주기는 최소 1개월 이상이어야 합니다")
    val intervalMonths: Int? = null,

    @field:Size(max = 1000, message = "설명은 최대 1000자 사이여야 합니다")
    val description: String? = null,

    val baseExecutionDate: LocalDate? = null,

    val affectedRoomIds: List<Long>? = null
)

data class MaintenanceGuideExecuteRequest(
    @field:NotNull(message = "실행 날짜는 필수입니다")
    val executedDate: LocalDate,

    @field:Size(max = 500, message = "메모는 최대 500자 사이여야 합니다")
    val memo: String? = null
)

// ─── 예방 정비 가이드 응답 ─────────────────────────────────────────────────────

data class MaintenanceGuideResponse(
    val id: Long,
    val title: String,
    val category: WorkOrderCategory,
    val intervalMonths: Int,
    val description: String? = null,
    val baseExecutionDate: LocalDate,
    val lastExecutedAt: LocalDate? = null,
    val nextScheduledAt: LocalDate,
    val isOverdue: Boolean,
    val affectedRoomCount: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class MaintenanceGuideDetailResponse(
    val id: Long,
    val title: String,
    val category: WorkOrderCategory,
    val intervalMonths: Int,
    val description: String? = null,
    val baseExecutionDate: LocalDate,
    val lastExecutedAt: LocalDate? = null,
    val nextScheduledAt: LocalDate,
    val isOverdue: Boolean,
    val daysUntilNextExecution: Int,
    val affectedRoomCount: Int,
    val affectedRooms: List<AffectedRoomResponse> = emptyList(),
    val executionHistory: List<MaintenanceExecutionResponse> = emptyList(),
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class MaintenanceGuideListResponse(
    val content: List<MaintenanceGuideResponse>,
    val totalElements: Long,
    val totalPages: Int,
    val currentPage: Int,
    val pageSize: Int,
    val hasNext: Boolean
)

data class MaintenanceGuideCreateResponse(
    val id: Long,
    val title: String,
    val nextScheduledAt: LocalDate,
    val createdAt: LocalDateTime
)

// ─── 영향받는 호실 정보 ────────────────────────────────────────────────────────

data class AffectedRoomResponse(
    val roomId: Long,
    val buildingName: String,
    val roomNumber: String,
    val lastExecutedAt: LocalDate? = null,
    val nextScheduledAt: LocalDate,
    val isOverdue: Boolean
)

// ─── 정비 실행 이력 ────────────────────────────────────────────────────────────

data class MaintenanceExecutionResponse(
    val id: Long,
    val guideId: Long,
    val executedDate: LocalDate,
    val executedBy: String, // admin, system
    val memo: String? = null,
    val recordedAt: LocalDateTime
)

// ─── 페이지네이션 응답 ────────────────────────────────────────────────────────

data class PagedResponse<T>(
    val content: List<T>,
    val totalElements: Long,
    val totalPages: Int,
    val currentPage: Int,
    val pageSize: Int,
    val hasNext: Boolean
)

// ─── 정비 통계 응답 ───────────────────────────────────────────────────────────

data class MaintenanceStatsResponse(
    val totalGuides: Int,
    val overdueCount: Int,
    val dueThisWeekCount: Int,
    val completedThisMonthCount: Int,
    val overdueCategoryBreakdown: Map<WorkOrderCategory, Int>
)
