package com.billim.domain.payment.application

import com.billim.domain.contract.infra.ContractRepository
import com.billim.domain.payment.domain.Payment
import com.billim.domain.payment.infra.PaymentRepository
import org.slf4j.LoggerFactory
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
class PaymentGeneratorService(
    private val contractRepository: ContractRepository,
    private val paymentRepository: PaymentRepository
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    /**
     * 매일 자정 1시에 실행되어, 각 계약의 시작일부터 현재까지 빠져있는 월별 수납(청구) 내역을 자동 생성.
     * 또한, 서버 애플리케이션 시작 시(ApplicationReadyEvent)에도 1회 실행하여 바로 적용되도록 함.
     */
    @EventListener(ApplicationReadyEvent::class)
    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    fun generateMonthlyPayments() {
        val today = LocalDate.now()
        logger.info("Starting automatic payment generation up to $today...")

        // 모든 계약 가져오기 (종료되었더라도 이전 납부내역 생성이 안 된 경우를 위해)
        val allContracts = contractRepository.findAll()

        var createdCount = 0

        for (contract in allContracts) {
            val start = contract.startDate.withDayOfMonth(1)
            val end = minOf(contract.endDate, today).withDayOfMonth(1)
            
            var current = start
            while (!current.isAfter(end)) {
                val year = current.year
                val month = current.monthValue

                val exists = paymentRepository.existsByContractIdAndBillingYearAndBillingMonth(
                    contract.id!!, year, month
                )

                if (!exists) {
                    val payment = Payment(
                        contract = contract,
                        billingYear = year,
                        billingMonth = month,
                        billedAmount = contract.monthlyRent
                    )
                    paymentRepository.save(payment)
                    createdCount++
                }

                current = current.plusMonths(1)
            }
        }
        
        logger.info("Automatic payment generation completed. Created $createdCount new payments.")
    }
}
