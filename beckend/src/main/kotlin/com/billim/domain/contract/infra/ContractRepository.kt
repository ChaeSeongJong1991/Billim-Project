package com.billim.domain.contract.infra

import com.billim.domain.contract.domain.Contract
import org.springframework.data.jpa.repository.JpaRepository

interface ContractRepository : JpaRepository<Contract, Long> {
    // 특정 건물의 계약 목록 조회
    fun findAllByBuildingId(buildingId: Long): List<Contract>
}
