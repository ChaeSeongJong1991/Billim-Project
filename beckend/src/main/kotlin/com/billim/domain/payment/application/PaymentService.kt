package com.billim.domain.payment.application

import com.billim.domain.building.infra.BuildingRepository
import com.billim.domain.contract.infra.ContractRepository
import com.billim.domain.payment.api.dto.*
import com.billim.domain.payment.domain.Payment
import com.billim.domain.payment.domain.PaymentStatus
import com.billim.domain.payment.infra.PaymentRepository
import com.billim.global.exception.EntityNotFoundException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.temporal.ChronoUnit

@Service
@Transactional(readOnly = true)
class PaymentService(
    private val paymentRepository: PaymentRepository,
    private val contractRepository: ContractRepository,
    private val buildingRepository: BuildingRepository
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    // 수납 청구서 수동 생성
    @Transactional
    fun create(email: String, request: PaymentCreateRequest): Long {
        logger.info("Creating payment for contract: {}, year: {}, month: {}",
            request.contractId, request.billingYear, request.billingMonth)
        val contract = contractRepository.findById(request.contractId)
            .orElseThrow { EntityNotFoundException(request.contractId, "계약을 찾을 수 없습니다.") }

        if (contract.building.user.email != email) {
            throw IllegalStateException("본인 소유 건물의 계약만 처리할 수 있습니다.")
        }

        if (paymentRepository.existsByContractIdAndBillingYearAndBillingMonth(
                request.contractId, request.billingYear, request.billingMonth
            )) {
            throw IllegalArgumentException("${request.billingYear}년 ${request.billingMonth}월 청구서가 이미 존재합니다.")
        }

        val payment = Payment(
            contract = contract,
            billingYear = request.billingYear,
            billingMonth = request.billingMonth,
            billedAmount = contract.monthlyRent
        )

        return paymentRepository.save(payment).id!!
    }

    // 건물별 월 장부 조회
    fun getLedger(email: String, buildingId: Long, year: Int, month: Int): LedgerSummaryResponse {
        val building = buildingRepository.findById(buildingId)
            .orElseThrow { EntityNotFoundException(buildingId, "건물을 찾을 수 없습니다.") }

        if (building.user.email != email) {
            throw IllegalStateException("본인 소유 건물만 조회할 수 있습니다.")
        }

        val payments = paymentRepository.findByBuildingAndYearMonth(buildingId, year, month)
        val paymentResponses = payments.map { it.toResponse() }

        val totalBilled = payments.sumOf { it.billedAmount }
        val totalPaid = payments.sumOf { it.paidAmount }
        val collectionRate = if (totalBilled > 0) ((totalPaid.toDouble() / totalBilled) * 100).toInt() else 0
        val unpaidAmount = payments.filter { it.status != PaymentStatus.PAID }
            .sumOf { it.billedAmount - it.paidAmount }

        return LedgerSummaryResponse(
            totalBilled = totalBilled,
            totalPaid = totalPaid,
            collectionRate = collectionRate,
            unpaidAmount = unpaidAmount,
            payments = paymentResponses
        )
    }

    // 수납 처리 (납부 등록)
    @Transactional
    fun collect(email: String, paymentId: Long, request: PaymentCollectRequest) {
        val payment = paymentRepository.findById(paymentId)
            .orElseThrow { EntityNotFoundException(paymentId, "수납 기록을 찾을 수 없습니다.") }

        if (payment.contract.building.user.email != email) {
            throw IllegalStateException("본인 소유 건물의 수납만 처리할 수 있습니다.")
        }

        payment.collect(request.paidAmount, request.paymentMethod, request.memo)
    }

    // 수납 기록 삭제
    @Transactional
    fun delete(email: String, paymentId: Long) {
        val payment = paymentRepository.findById(paymentId)
            .orElseThrow { EntityNotFoundException(paymentId, "수납 기록을 찾을 수 없습니다.") }

        if (payment.contract.building.user.email != email) {
            throw IllegalStateException("본인 소유 건물의 수납만 삭제할 수 있습니다.")
        }

        paymentRepository.delete(payment)
    }

    // 대시보드 요약 (미납 건수 + 미납 총액)
    fun getDashboardSummary(email: String): DashboardSummaryResponse {
        return DashboardSummaryResponse(
            unpaidCount = paymentRepository.countUnpaidByUserEmail(email),
            unpaidAmount = paymentRepository.sumUnpaidAmountByUserEmail(email)
        )
    }

    private fun Payment.toResponse(): PaymentResponse {
        val today = LocalDate.now()
        val rentDay = this.contract.rentDay
        val dueDate = LocalDate.of(this.billingYear, this.billingMonth, minOf(rentDay, today.month.length(today.isLeapYear)))
        val overdueDays = if (this.status != PaymentStatus.PAID && today.isAfter(dueDate)) {
            ChronoUnit.DAYS.between(dueDate, today).toInt()
        } else null

        return PaymentResponse(
            id = this.id!!,
            contractId = this.contract.id!!,
            roomNumber = this.contract.roomNumber,
            tenantName = this.contract.tenantName,
            billingYear = this.billingYear,
            billingMonth = this.billingMonth,
            billedAmount = this.billedAmount,
            paidAmount = this.paidAmount,
            status = this.status,
            paymentDate = this.paymentDate,
            paymentMethod = this.paymentMethod,
            memo = this.memo,
            overdueDays = overdueDays
        )
    }
}
