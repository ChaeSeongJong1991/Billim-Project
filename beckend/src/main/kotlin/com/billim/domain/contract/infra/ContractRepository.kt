package com.billim.domain.contract.infra

import com.billim.domain.contract.domain.Contract
import com.billim.domain.contract.domain.RenewalStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDate

interface ContractRepository : JpaRepository<Contract, Long> {

    fun findAllByBuildingId(buildingId: Long): List<Contract>

    fun findAllByBuildingIdAndRoomNumber(buildingId: Long, roomNumber: String): List<Contract>

    // 현재 활성 계약 (Batch - 월세 자동 청구용)
    @Query("SELECT c FROM Contract c JOIN FETCH c.building WHERE c.startDate <= :today AND c.endDate >= :today AND c.renewalStatus = :status")
    fun findAllActiveContracts(today: LocalDate, status: RenewalStatus = RenewalStatus.ACTIVE): List<Contract>

    // 만료 임박 ACTIVE 계약 - RENEWED 계약 제외 (Batch + API 공용)
    // JOIN FETCH b.user: getExpiringContracts()에서 building.user.id 접근 시 N+1 방지
    @Query("SELECT c FROM Contract c JOIN FETCH c.building b JOIN FETCH b.user WHERE c.endDate BETWEEN :today AND :limitDate AND c.renewalStatus = :status")
    fun findExpiringContracts(today: LocalDate, limitDate: LocalDate, status: RenewalStatus = RenewalStatus.ACTIVE): List<Contract>
}
