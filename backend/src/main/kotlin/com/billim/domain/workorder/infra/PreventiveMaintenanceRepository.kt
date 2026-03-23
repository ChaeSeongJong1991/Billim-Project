package com.billim.domain.workorder.infra

import com.billim.domain.maintenance.domain.PreventiveMaintenance
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

/**
 * PreventiveMaintenance Repository
 * 예방정비(주기적인 유지보수) 데이터 접근 계층
 * 예: 냉난방 필터 교체 - 분기별, 통풍기 점검 - 월별 등
 */
@Repository
interface PreventiveMaintenanceRepository : JpaRepository<PreventiveMaintenance, Long> {
    /**
     * 특정 건물의 모든 예방정비 조회
     */
    fun findByBuildingId(buildingId: Long): List<PreventiveMaintenance>

    /**
     * 특정 호실의 모든 예방정비 조회
     */
    fun findByUnitId(unitId: Long): List<PreventiveMaintenance>

    /**
     * 특정 호실의 특정 카테고리 예방정비 조회
     */
    fun findByUnitIdAndCategory(unitId: Long, category: String): List<PreventiveMaintenance>

    /**
     * 특정 건물과 카테고리로 예방정비 조회
     */
    fun findByBuildingIdAndCategory(buildingId: Long, category: String): List<PreventiveMaintenance>

    /**
     * 활성화된 모든 예방정비 조회
     */
    fun findByIsActiveTrue(): List<PreventiveMaintenance>

    /**
     * 활성화되고 예정 날짜가 지난 예방정비 조회 (수행 필요)
     */
    @Query("SELECT pm FROM PreventiveMaintenance pm WHERE pm.isActive = true AND pm.nextDueAt <= :now")
    fun findDuePreventiveMaintenances(now: LocalDateTime = LocalDateTime.now()): List<PreventiveMaintenance>

    /**
     * 특정 기간의 예방정비 조회
     */
    @Query("SELECT pm FROM PreventiveMaintenance pm WHERE pm.nextDueAt >= :startDate AND pm.nextDueAt <= :endDate")
    fun findByDateRange(startDate: LocalDateTime, endDate: LocalDateTime): List<PreventiveMaintenance>
}
