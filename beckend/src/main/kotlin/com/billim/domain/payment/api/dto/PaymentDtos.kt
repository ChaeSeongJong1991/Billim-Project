package com.billim.domain.payment.api.dto

import com.billim.domain.payment.domain.PaymentStatus
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import java.time.LocalDate

// ─── 요청 ───────────────────────────────────────────────────────────────────

data class PaymentCreateRequest(
    @field:NotNull(message = "계약 ID는 필수입니다.")
    val contractId: Long,

    @field:NotNull
    @field:Min(2000) @field:Max(2100)
    val billingYear: Int,

    @field:NotNull
    @field:Min(1) @field:Max(12)
    val billingMonth: Int
)

data class PaymentCollectRequest(
    @field:NotNull(message = "납부 금액은 필수입니다.")
    @field:Min(1)
    val paidAmount: Long,

    val paymentMethod: String? = null, // 계좌이체, 현금, 자동이체 등

    val memo: String? = null
)

// ─── 응답 ───────────────────────────────────────────────────────────────────

data class PaymentResponse(
    val id: Long,
    val contractId: Long,
    val roomNumber: String,
    val tenantName: String,
    val billingYear: Int,
    val billingMonth: Int,
    val billedAmount: Long,
    val paidAmount: Long,
    val status: PaymentStatus,
    val paymentDate: LocalDate?,
    val paymentMethod: String?,
    val memo: String?,
    val overdueDays: Int?      // 미납 시 연체 일수
)

data class LedgerSummaryResponse(
    val totalBilled: Long,
    val totalPaid: Long,
    val collectionRate: Int,   // 징수율 (%)
    val unpaidAmount: Long,
    val payments: List<PaymentResponse>
)

data class DashboardSummaryResponse(
    val unpaidCount: Long,
    val unpaidAmount: Long
)

data class ShareLinkResponse(
    val paymentId: Long,
    val shareToken: String,
    val shareUrl: String
)

data class PublicPaymentResponse(
    val id: Long,
    val buildingName: String,
    val roomNumber: String,
    val tenantName: String,
    val billingYear: Int,
    val billingMonth: Int,
    val billedAmount: Long,
    val paidAmount: Long,
    val status: PaymentStatus,
    val paymentDate: LocalDate?,
    val paymentMethod: String?
)
