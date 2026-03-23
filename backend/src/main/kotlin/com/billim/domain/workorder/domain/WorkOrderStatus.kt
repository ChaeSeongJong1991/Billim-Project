package com.billim.domain.workorder.domain

/**
 * WorkOrder 상태 enum
 * RECEIVED: 접수 (새로운 요청이 들어온 상태)
 * IN_PROGRESS: 진행 (작업이 진행 중인 상태)
 * COMPLETED: 완료 (작업이 완료된 상태)
 */
enum class WorkOrderStatus {
    RECEIVED,
    IN_PROGRESS,
    COMPLETED
}
