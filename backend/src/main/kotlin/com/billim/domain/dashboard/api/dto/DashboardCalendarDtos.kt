package com.billim.domain.dashboard.api.dto

import java.time.LocalDate

data class DailyPaymentStatus(
    val date: LocalDate,
    val expectedAmount: Long,
    val paidAmount: Long,
    val status: String // PAID, WAITING, OVERDUE
)

data class DashboardCalendarResponse(
    val year: Int,
    val month: Int,
    val dailyStatuses: List<DailyPaymentStatus>
)
