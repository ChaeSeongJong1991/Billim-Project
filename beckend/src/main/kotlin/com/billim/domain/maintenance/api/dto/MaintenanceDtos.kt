package com.billim.domain.maintenance.api.dto

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

/**
 * 예방정비 가이드 생성 요청
 */
data class CreateMaintenanceGuideRequest(
    @field:NotNull(message = "호실 ID는 필수입니다.")
    @JsonProperty("unit_id")
    val unitId: Long,

    @field:NotBlank(message = "항목명은 필수입니다.")
    @JsonProperty("item_name")
    val itemName: String,

    @field:NotBlank(message = "카테고리는 필수입니다.")
    val category: String,

    @field:NotNull(message = "교체 주기(개월)는 필수입니다.")
    @JsonProperty("replacement_interval_months")
    val replacementIntervalMonths: Int,

    @JsonProperty("last_replaced_date")
    val lastReplacedDate: LocalDateTime? = null
) {
    fun copy(
        unitId: Long = this.unitId,
        itemName: String = this.itemName,
        category: String = this.category,
        replacementIntervalMonths: Int = this.replacementIntervalMonths,
        lastReplacedDate: LocalDateTime? = this.lastReplacedDate
    ) = CreateMaintenanceGuideRequest(unitId, itemName, category, replacementIntervalMonths, lastReplacedDate)
}

/**
 * 예방정비 가이드 수정 요청
 */
data class UpdateMaintenanceGuideRequest(
    @field:NotBlank(message = "항목명은 필수입니다.")
    @JsonProperty("item_name")
    val itemName: String,

    @field:NotNull(message = "교체 주기(개월)는 필수입니다.")
    @JsonProperty("replacement_interval_months")
    val replacementIntervalMonths: Int,

    @JsonProperty("last_replaced_date")
    val lastReplacedDate: LocalDateTime? = null
) {
    fun copy(
        itemName: String = this.itemName,
        replacementIntervalMonths: Int = this.replacementIntervalMonths,
        lastReplacedDate: LocalDateTime? = this.lastReplacedDate
    ) = UpdateMaintenanceGuideRequest(itemName, replacementIntervalMonths, lastReplacedDate)
}

/**
 * 예방정비 가이드 기본 응답
 */
data class MaintenanceGuideResponse(
    @field:NotNull(message = "가이드 ID는 필수입니다.")
    val id: Long,

    @field:NotBlank(message = "항목명은 필수입니다.")
    @JsonProperty("item_name")
    val itemName: String,

    @field:NotBlank(message = "카테고리는 필수입니다.")
    val category: String,

    @field:NotNull(message = "교체 주기(개월)는 필수입니다.")
    @JsonProperty("replacement_interval_months")
    val replacementIntervalMonths: Int
) {
    fun copy(
        id: Long = this.id,
        itemName: String = this.itemName,
        category: String = this.category,
        replacementIntervalMonths: Int = this.replacementIntervalMonths
    ) = MaintenanceGuideResponse(id, itemName, category, replacementIntervalMonths)
}

/**
 * 예방정비 가이드 목록 응답
 */
data class MaintenanceGuideListResponse(
    @field:NotNull(message = "가이드 목록은 필수입니다.")
    val guides: List<MaintenanceGuideResponse> = emptyList(),

    @field:NotNull(message = "전체 개수는 필수입니다.")
    @JsonProperty("total_count")
    val totalCount: Int = 0
) {
    fun copy(
        guides: List<MaintenanceGuideResponse> = this.guides,
        totalCount: Int = this.totalCount
    ) = MaintenanceGuideListResponse(guides, totalCount)
}

/**
 * 예방정비 스케줄 응답
 */
data class MaintenanceScheduleResponse(
    @field:NotBlank(message = "항목명은 필수입니다.")
    @JsonProperty("item_name")
    val itemName: String,

    @JsonProperty("last_replaced_date")
    val lastReplacedDate: LocalDateTime? = null,

    @field:NotNull(message = "다음 교체 예정일은 필수입니다.")
    @JsonProperty("next_due_date")
    val nextDueDate: LocalDateTime
) {
    fun copy(
        itemName: String = this.itemName,
        lastReplacedDate: LocalDateTime? = this.lastReplacedDate,
        nextDueDate: LocalDateTime = this.nextDueDate
    ) = MaintenanceScheduleResponse(itemName, lastReplacedDate, nextDueDate)
}

/**
 * 예방정비 알림 응답
 */
data class PreventiveMaintenanceAlertResponse(
    @field:NotNull(message = "가이드 목록은 필수입니다.")
    val guides: List<MaintenanceScheduleResponse> = emptyList(),

    @field:NotNull(message = "예정일까지 남은 일수는 필수입니다.")
    @JsonProperty("days_until_due")
    val daysUntilDue: Map<String, Int> = emptyMap()
) {
    fun copy(
        guides: List<MaintenanceScheduleResponse> = this.guides,
        daysUntilDue: Map<String, Int> = this.daysUntilDue
    ) = PreventiveMaintenanceAlertResponse(guides, daysUntilDue)
}

/**
 * 예방정비 이력 응답
 */
data class MaintenanceHistoryResponse(
    @field:NotNull(message = "이력 목록은 필수입니다.")
    val history: List<MaintenanceHistoryItem> = emptyList(),

    @field:NotNull(message = "전체 개수는 필수입니다.")
    val count: Int = 0
) {
    fun copy(
        history: List<MaintenanceHistoryItem> = this.history,
        count: Int = this.count
    ) = MaintenanceHistoryResponse(history, count)
}

/**
 * 예방정비 이력 항목
 */
data class MaintenanceHistoryItem(
    @field:NotNull(message = "항목 ID는 필수입니다.")
    val id: Long,

    @field:NotBlank(message = "항목명은 필수입니다.")
    @JsonProperty("item_name")
    val itemName: String,

    @field:NotBlank(message = "카테고리는 필수입니다.")
    val category: String,

    @JsonProperty("replaced_date")
    val replacedDate: LocalDateTime,

    @field:NotBlank(message = "설명은 필수입니다.")
    val description: String = ""
)
