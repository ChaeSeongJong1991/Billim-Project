package com.billim.domain.workorder.infra

import com.billim.domain.workorder.domain.WorkOrderCategory
import org.springframework.data.jpa.repository.JpaRepository

/**
 * PreventiveMaintenance Repository
 * 예방정비(주기적인 유지보수) 데이터 접근 계층
 * 예: 냉난방 필터 교체 - 분기별, 통풍기 점검 - 월별 등
 *
 * SQL 생성:
 * CREATE TABLE preventive_maintenances (
 *   id BIGINT PRIMARY KEY AUTO_INCREMENT,
 *   unit_id BIGINT NOT NULL,
 *   category VARCHAR(50) NOT NULL,
 *   title VARCHAR(255) NOT NULL,
 *   description VARCHAR(1000),
 *   frequency VARCHAR(50) NOT NULL, -- WEEKLY, MONTHLY, QUARTERLY, YEARLY
 *   last_performed_at DATETIME,
 *   next_due_at DATETIME NOT NULL,
 *   created_at DATETIME NOT NULL,
 *   updated_at DATETIME NOT NULL,
 *   FOREIGN KEY (unit_id) REFERENCES rooms(id),
 *   INDEX idx_unit (unit_id),
 *   INDEX idx_next_due (next_due_at)
 * );
 */
interface PreventiveMaintenanceRepository : JpaRepository<Any, Long> {
    /**
     * 특정 호실의 모든 예방정비 조회
     */
    fun findAllByUnitId(unitId: Long): List<Any>

    /**
     * 특정 호실의 특정 카테고리 예방정비 조회
     */
    fun findAllByUnitIdAndCategory(unitId: Long, category: WorkOrderCategory): List<Any>

    /**
     * 예정 날짜가 지난 예방정비 조회 (수행 필요)
     */
    fun findDuePreventiveMaintenances(): List<Any>
}
