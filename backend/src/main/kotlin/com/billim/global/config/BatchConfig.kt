package com.billim.global.config

import com.billim.batch.tasklet.ContractExpiryTasklet
import com.billim.batch.tasklet.MonthlyBillingTasklet
import org.springframework.batch.core.Job
import org.springframework.batch.core.Step
import org.springframework.batch.core.job.builder.JobBuilder
import org.springframework.batch.core.repository.JobRepository
import org.springframework.batch.core.step.builder.StepBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.transaction.PlatformTransactionManager

@Configuration
class BatchConfig(
    private val jobRepository: JobRepository,
    private val transactionManager: PlatformTransactionManager,
    private val monthlyBillingTasklet: MonthlyBillingTasklet,
    private val contractExpiryTasklet: ContractExpiryTasklet
) {

    // ─── 월세 자동 청구 Job ───────────────────────────────────────────────────

    @Bean
    fun monthlyBillingStep(): Step =
        StepBuilder("monthlyBillingStep", jobRepository)
            .tasklet(monthlyBillingTasklet, transactionManager)
            .build()

    @Bean
    fun monthlyBillingJob(): Job =
        JobBuilder("monthlyBillingJob", jobRepository)
            .start(monthlyBillingStep())
            .build()

    // ─── 계약 만료 알림 Job ──────────────────────────────────────────────────

    @Bean
    fun contractExpiryStep(): Step =
        StepBuilder("contractExpiryStep", jobRepository)
            .tasklet(contractExpiryTasklet, transactionManager)
            .build()

    @Bean
    fun contractExpiryJob(): Job =
        JobBuilder("contractExpiryJob", jobRepository)
            .start(contractExpiryStep())
            .build()
}
