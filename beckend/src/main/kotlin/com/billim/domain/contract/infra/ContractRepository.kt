package com.billim.domain.contract.infra

import com.billim.domain.contract.domain.Contract
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDate

interface ContractRepository : JpaRepository<Contract, Long> {

    fun findAllByBuildingId(buildingId: Long): List<Contract>

    // 현재 활성 계약 (Batch - 월세 자동 청구용)
    @Query("SELECT c FROM Contract c WHERE c.startDate <= :today AND c.endDate >= :today")
    fun findAllActiveContracts(today: LocalDate): List<Contract>

    // 만료 임박 계약 (Batch - 계약 만료 알림용)
    @Query("SELECT c FROM Contract c WHERE c.endDate BETWEEN :today AND :limitDate")
    fun findExpiringContracts(today: LocalDate, limitDate: LocalDate): List<Contract>
}
