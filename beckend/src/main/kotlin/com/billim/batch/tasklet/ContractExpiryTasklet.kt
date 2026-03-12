package com.billim.batch.tasklet

import com.billim.domain.contract.domain.Contract
import com.billim.domain.contract.infra.ContractRepository
import org.slf4j.LoggerFactory
import org.springframework.batch.core.StepContribution
import org.springframework.batch.core.scope.context.ChunkContext
import org.springframework.batch.core.step.tasklet.Tasklet
import org.springframework.batch.repeat.RepeatStatus
import org.springframework.stereotype.Component
import java.time.LocalDate
import java.time.temporal.ChronoUnit

/**
 * 계약 만료 알림 Tasklet
 *
 * 실행 시점: 매일 오전 9시 (BatchScheduler)
 * 동작: 30일 이내 만료 예정 계약을 조회하여 로그 기록 및 알림 준비
 *       (FCM Push 알림은 세입자 앱 개발 후 연동 예정)
 */
@Component
class ContractExpiryTasklet(
    private val contractRepository: ContractRepository
) : Tasklet {

    private val log = LoggerFactory.getLogger(ContractExpiryTasklet::class.java)

    companion object {
        private const val EXPIRY_ALERT_DAYS = 30L
    }

    override fun execute(contribution: StepContribution, chunkContext: ChunkContext): RepeatStatus {
        val today = LocalDate.now()
        val limitDate = today.plusDays(EXPIRY_ALERT_DAYS)

        log.info("[ContractExpiry] START - 만료 임박 계약 확인 (기준일: $today ~ $limitDate)")

        val expiringContracts = contractRepository.findExpiringContracts(today, limitDate)

        if (expiringContracts.isEmpty()) {
            log.info("[ContractExpiry] 만료 임박 계약 없음")
            return RepeatStatus.FINISHED
        }

        log.info("[ContractExpiry] 만료 임박 계약 ${expiringContracts.size}건 발견")

        expiringContracts.forEach { contract ->
            val daysLeft = ChronoUnit.DAYS.between(today, contract.endDate)
            logExpiryAlert(contract, daysLeft)

            // TODO: FCM Push 알림 발송 (세입자 앱 개발 후 연동)
            // if (contract.tenantUserId != null) {
            //     fcmService.sendExpiryNotification(contract.tenantUserId, daysLeft)
            // }
        }

        repeat(expiringContracts.size) { contribution.incrementReadCount() }
        log.info("[ContractExpiry] DONE")

        return RepeatStatus.FINISHED
    }

    private fun logExpiryAlert(contract: Contract, daysLeft: Long) {
        val urgency = when {
            daysLeft <= 7 -> "🚨 [긴급]"
            daysLeft <= 14 -> "⚠️ [주의]"
            else -> "📋 [안내]"
        }
        log.warn(
            "$urgency 계약 만료 D-${daysLeft} | " +
            "건물=${contract.building.name}, 호실=${contract.roomNumber}, " +
            "세입자=${contract.tenantName}(${contract.tenantPhone}), " +
            "만료일=${contract.endDate}"
        )
    }
}
