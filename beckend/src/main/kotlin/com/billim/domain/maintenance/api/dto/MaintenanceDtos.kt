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
)

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
)

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
)

/**
 * 예방정비 알림 응답
 */
data class PreventiveMaintenanceAlertResponse(
    @field:NotNull(message = "가이드 목록은 필수입니다.")
    val guides: List<MaintenanceScheduleResponse> = emptyList(),

    @field:NotNull(message = "예정일까지 남은 일수는 필수입니다.")
    @JsonProperty("days_until_due")
    val daysUntilDue: Map<String, Int> = emptyMap()
)

/**
 * 예방정비 이력 응답
 */
data class MaintenanceHistoryResponse(
    @field:NotNull(message = "이력 목록은 필수입니다.")
    val history: List<MaintenanceHistoryItem> = emptyList(),

    @field:NotNull(message = "전체 개수는 필수입니다.")
    val count: Int = 0
)

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
