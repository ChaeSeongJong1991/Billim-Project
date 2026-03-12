package com.billim.batch

import org.slf4j.LoggerFactory
import org.springframework.batch.core.Job
import org.springframework.batch.core.JobParametersBuilder
import org.springframework.batch.core.launch.JobLauncher
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDateTime

/**
 * Batch Job 스케줄러
 *
 * @EnableScheduling 은 BillimApplication 에서 활성화
 */
@Component
class BatchScheduler(
    private val jobLauncher: JobLauncher,
    @Qualifier("monthlyBillingJob") private val monthlyBillingJob: Job,
    @Qualifier("contractExpiryJob") private val contractExpiryJob: Job
) {

    private val log = LoggerFactory.getLogger(BatchScheduler::class.java)

    /**
     * 월세 자동 청구서 생성
     * 매월 1일 새벽 1시 실행
     * Cron: 초 분 시 일 월 요일
     */
    @Scheduled(cron = "0 0 1 1 * *", zone = "Asia/Seoul")
    fun runMonthlyBillingJob() {
        log.info("[Scheduler] monthlyBillingJob 시작 - ${LocalDateTime.now()}")
        val params = JobParametersBuilder()
            .addLocalDateTime("executedAt", LocalDateTime.now())
            .toJobParameters()

        try {
            val execution = jobLauncher.run(monthlyBillingJob, params)
            log.info("[Scheduler] monthlyBillingJob 완료 - Status: ${execution.status}")
        } catch (e: Exception) {
            log.error("[Scheduler] monthlyBillingJob 실패", e)
        }
    }

    /**
     * 계약 만료 임박 알림
     * 매일 오전 9시 실행
     */
    @Scheduled(cron = "0 0 9 * * *", zone = "Asia/Seoul")
    fun runContractExpiryJob() {
        log.info("[Scheduler] contractExpiryJob 시작 - ${LocalDateTime.now()}")
        val params = JobParametersBuilder()
            .addLocalDateTime("executedAt", LocalDateTime.now())
            .toJobParameters()

        try {
            val execution = jobLauncher.run(contractExpiryJob, params)
            log.info("[Scheduler] contractExpiryJob 완료 - Status: ${execution.status}")
        } catch (e: Exception) {
            log.error("[Scheduler] contractExpiryJob 실패", e)
        }
    }
}
