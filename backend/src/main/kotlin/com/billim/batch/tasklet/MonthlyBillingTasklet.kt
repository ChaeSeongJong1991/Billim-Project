package com.billim.batch.tasklet

import com.billim.domain.contract.infra.ContractRepository
import com.billim.domain.payment.domain.Payment
import com.billim.domain.payment.infra.PaymentRepository
import org.slf4j.LoggerFactory
import org.springframework.batch.core.StepContribution
import org.springframework.batch.core.scope.context.ChunkContext
import org.springframework.batch.core.step.tasklet.Tasklet
import org.springframework.batch.repeat.RepeatStatus
import org.springframework.stereotype.Component
import java.time.LocalDate

/**
 * 월세 자동 청구 Tasklet
 *
 * 실행 시점: 매월 1일 새벽 1시 (BatchScheduler)
 * 동작: 현재 활성 상태인 모든 계약에 대해 당월 수납 기록을 생성
 *       이미 생성된 기록은 중복 생성하지 않음 (idempotent)
 */
@Component
class MonthlyBillingTasklet(
    private val contractRepository: ContractRepository,
    private val paymentRepository: PaymentRepository
) : Tasklet {

    private val log = LoggerFactory.getLogger(MonthlyBillingTasklet::class.java)

    override fun execute(contribution: StepContribution, chunkContext: ChunkContext): RepeatStatus {
        val today = LocalDate.now()
        val year = today.year
        val month = today.monthValue

        log.info("[MonthlyBilling] START - ${year}년 ${month}월 자동 청구 시작")

        val activeContracts = contractRepository.findAllActiveContracts(today)
        log.info("[MonthlyBilling] 활성 계약 수: ${activeContracts.size}건")

        var created = 0
        var skipped = 0

        activeContracts.forEach { contract ->
            // 중복 방지: 이미 해당 월 청구서가 존재하면 건너뜀
            if (paymentRepository.existsByContractIdAndBillingYearAndBillingMonth(
                    contract.id!!, year, month
                )
            ) {
                log.debug("[MonthlyBilling] SKIP - 계약ID=${contract.id} (${year}년 ${month}월 이미 존재)")
                skipped++
                return@forEach
            }

            val payment = Payment(
                contract = contract,
                billingYear = year,
                billingMonth = month,
                billedAmount = contract.monthlyRent
            )
            paymentRepository.save(payment)
            created++

            log.info(
                "[MonthlyBilling] CREATE - 건물=${contract.building.name}, " +
                "호실=${contract.roomNumber}, 세입자=${contract.tenantName}, " +
                "청구액=${contract.monthlyRent}원"
            )
        }

        log.info("[MonthlyBilling] DONE - 생성: ${created}건, 스킵: ${skipped}건")
        contribution.incrementWriteCount(created.toLong())

        return RepeatStatus.FINISHED
    }
}
