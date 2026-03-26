package com.billim.domain.workorder.infra

import com.billim.domain.building.domain.Building
import com.billim.domain.building.domain.Room
import com.billim.domain.tenant.domain.Tenant
import com.billim.domain.workorder.domain.WorkOrder
import com.billim.domain.workorder.domain.WorkOrderStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

/**
 * WorkOrder Repository
 * WorkOrder Entity의 데이터 접근 계층
 */
interface WorkOrderRepository : JpaRepository<WorkOrder, Long> {
    /**
     * 임차인의 모든 WorkOrder 조회 (soft delete 제외)
     */
    fun findAllByTenantAndDeletedAtIsNull(tenant: Tenant): List<WorkOrder>

    /**
     * 건물의 모든 WorkOrder 조회 (soft delete 제외)
     */
    fun findAllByBuildingAndDeletedAtIsNull(building: Building): List<WorkOrder>

    /**
     * 호실의 모든 WorkOrder 조회 (soft delete 제외)
     */
    fun findAllByUnitAndDeletedAtIsNull(unit: Room): List<WorkOrder>

    /**
     * 특정 상태의 WorkOrder 조회 (soft delete 제외)
     */
    fun findAllByStatusAndDeletedAtIsNull(status: WorkOrderStatus): List<WorkOrder>

    /**
     * 협력업체에 할당된 WorkOrder 조회 (soft delete 제외)
     */
    fun findAllByAssignedVendorIdAndDeletedAtIsNull(vendorId: Long): List<WorkOrder>

    /**
     * 임차인 + 상태로 WorkOrder 조회 (soft delete 제외)
     */
    fun findAllByTenantAndStatusAndDeletedAtIsNull(tenant: Tenant, status: WorkOrderStatus): List<WorkOrder>

    /**
     * 건물 + 상태로 WorkOrder 조회 (soft delete 제외)
     */
    fun findAllByBuildingAndStatusAndDeletedAtIsNull(building: Building, status: WorkOrderStatus): List<WorkOrder>

    /**
     * 할당되지 않은 WorkOrder 조회
     */
    @Query("""
        SELECT w FROM WorkOrder w
        WHERE w.assignedVendorId IS NULL
        AND w.status != 'COMPLETED'
        AND w.deletedAt IS NULL
    """)
    fun findUnassignedWorkOrders(): List<WorkOrder>

    /**
     * 완료되지 않은 WorkOrder 조회
     */
    @Query("""
        SELECT w FROM WorkOrder w
        WHERE w.status IN ('RECEIVED', 'IN_PROGRESS')
        AND w.deletedAt IS NULL
    """)
    fun findPendingWorkOrders(): List<WorkOrder>
}
