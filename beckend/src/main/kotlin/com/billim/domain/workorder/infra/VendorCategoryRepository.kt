package com.billim.domain.workorder.infra

import com.billim.domain.vendor.domain.VendorCategory
import com.billim.domain.workorder.domain.WorkOrderCategory
import org.springframework.data.jpa.repository.JpaRepository

interface VendorCategoryRepository : JpaRepository<VendorCategory, Long> {
    /**
     * 특정 협력업체가 처리 가능한 카테고리 조회
     */
    fun findAllByVendorId(vendorId: Long): List<WorkOrderCategory>

    /**
     * 특정 카테고리를 처리할 수 있는 협력업체 조회
     */
    fun findAllByCategory(category: WorkOrderCategory): List<Long>

    /**
     * 특정 협력업체의 특정 카테고리 처리 가능 확인
     */
    fun existsByVendorIdAndCategory(vendorId: Long, category: WorkOrderCategory): Boolean
}
