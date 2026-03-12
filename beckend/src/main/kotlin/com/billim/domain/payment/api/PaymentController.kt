package com.billim.domain.payment.api

import com.billim.domain.payment.api.dto.*
import com.billim.domain.payment.application.PaymentService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/payments")
class PaymentController(
    private val paymentService: PaymentService
) {

    // 청구서 수동 생성
    @PostMapping
    fun create(
        @AuthenticationPrincipal userDetails: UserDetails,
        @Valid @RequestBody request: PaymentCreateRequest
    ): ResponseEntity<Long> {
        val paymentId = paymentService.create(userDetails.username, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentId)
    }

    // 월별 장부 조회
    @GetMapping("/ledger")
    fun getLedger(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestParam buildingId: Long,
        @RequestParam year: Int,
        @RequestParam month: Int
    ): ResponseEntity<LedgerSummaryResponse> {
        val ledger = paymentService.getLedger(userDetails.username, buildingId, year, month)
        return ResponseEntity.ok(ledger)
    }

    // 대시보드 요약 (미납 건수/총액)
    @GetMapping("/dashboard-summary")
    fun getDashboardSummary(
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<DashboardSummaryResponse> {
        val summary = paymentService.getDashboardSummary(userDetails.username)
        return ResponseEntity.ok(summary)
    }

    // 수납 처리
    @PatchMapping("/{paymentId}/collect")
    fun collect(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable paymentId: Long,
        @Valid @RequestBody request: PaymentCollectRequest
    ): ResponseEntity<Unit> {
        paymentService.collect(userDetails.username, paymentId, request)
        return ResponseEntity.ok().build()
    }

    // 수납 기록 삭제
    @DeleteMapping("/{paymentId}")
    fun delete(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable paymentId: Long
    ): ResponseEntity<Unit> {
        paymentService.delete(userDetails.username, paymentId)
        return ResponseEntity.noContent().build()
    }
}
