package com.billim.domain.workorder.infra

import com.billim.domain.workorder.domain.WorkOrderImage
import org.springframework.data.jpa.repository.JpaRepository

/**
 * WorkOrderImage Repository
 * WorkOrderImage Entity의 데이터 접근 계층
 */
interface WorkOrderImageRepository : JpaRepository<WorkOrderImage, Long> {
    /**
     * 특정 WorkOrder의 모든 이미지 조회
     */
    fun findAllByWorkOrderId(workOrderId: Long): List<WorkOrderImage>

    /**
     * 특정 WorkOrder의 이미지 개수
     */
    fun countByWorkOrderId(workOrderId: Long): Int

    /**
     * 특정 WorkOrder의 모든 이미지 삭제
     */
    fun deleteAllByWorkOrderId(workOrderId: Long)
}
