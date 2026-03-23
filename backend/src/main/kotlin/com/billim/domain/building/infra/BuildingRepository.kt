package com.billim.domain.building.infra

import com.billim.domain.building.domain.Building
import org.springframework.data.jpa.repository.JpaRepository

interface BuildingRepository : JpaRepository<Building, Long> {
    // 특정 사용자의 건물 목록 조회
    fun findAllByUserEmail(email: String): List<Building> 
}
