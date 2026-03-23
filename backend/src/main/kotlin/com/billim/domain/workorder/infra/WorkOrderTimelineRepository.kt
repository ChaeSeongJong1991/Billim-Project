package com.billim.domain.workorder.infra

import com.billim.domain.workorder.domain.WorkOrderStatus
import com.billim.domain.workorder.domain.WorkOrderTimeline
import org.springframework.data.jpa.repository.JpaRepository

/**
 * WorkOrderTimeline Repository
 * WorkOrderTimeline Entity의 데이터 접근 계층
 */
interface WorkOrderTimelineRepository : JpaRepository<WorkOrderTimeline, Long> {
    /**
     * 특정 WorkOrder의 모든 타임라인 조회
     */
    fun findAllByWorkOrderIdOrderByChangedAtDesc(workOrderId: Long): List<WorkOrderTimeline>

    /**
     * 특정 WorkOrder의 타임라인 개수
     */
    fun countByWorkOrderId(workOrderId: Long): Int

    /**
     * 특정 상태로 변경된 타임라인 조회
     */
    fun findAllByWorkOrderIdAndStatus(workOrderId: Long, status: WorkOrderStatus): List<WorkOrderTimeline>

    /**
     * 특정 WorkOrder의 모든 타임라인 삭제
     */
    fun deleteAllByWorkOrderId(workOrderId: Long)
}
