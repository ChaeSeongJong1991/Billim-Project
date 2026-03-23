package com.billim.domain.payment.infra

import com.billim.domain.payment.domain.Payment
import com.billim.domain.payment.domain.PaymentStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface PaymentRepository : JpaRepository<Payment, Long> {

    // 건물별 + 연월 기준 수납 목록 (장부 조회)
    @Query("""
        SELECT p FROM Payment p
        JOIN FETCH p.contract c
        JOIN FETCH c.building b
        WHERE b.id = :buildingId
          AND p.billingYear = :year
          AND p.billingMonth = :month
    """)
    fun findByBuildingAndYearMonth(buildingId: Long, year: Int, month: Int): List<Payment>

    // 계약별 수납 이력
    fun findAllByContractIdOrderByBillingYearDescBillingMonthDesc(contractId: Long): List<Payment>

    // 중복 청구 방지 체크
    fun existsByContractIdAndBillingYearAndBillingMonth(
        contractId: Long, billingYear: Int, billingMonth: Int
    ): Boolean

    // 미납 건수 집계 (대시보드용)
    @Query("""
        SELECT COUNT(p) FROM Payment p
        JOIN p.contract c
        JOIN c.building b
        WHERE b.user.email = :email
          AND p.status != :status
    """)
    fun countUnpaidByUserEmail(email: String, status: PaymentStatus = PaymentStatus.PAID): Long

    // 미납 총액 집계 (대시보드용)
    @Query("""
        SELECT COALESCE(SUM(p.billedAmount - p.paidAmount), 0) FROM Payment p
        JOIN p.contract c
        JOIN c.building b
        WHERE b.user.email = :email
          AND p.status IN ('UNPAID', 'PARTIAL')
    """)
    fun sumUnpaidAmountByUserEmail(email: String): Long

    // 공유 토큰으로 납부 조회 (공개 청구서)
    fun findByShareToken(shareToken: String): Payment?
}
