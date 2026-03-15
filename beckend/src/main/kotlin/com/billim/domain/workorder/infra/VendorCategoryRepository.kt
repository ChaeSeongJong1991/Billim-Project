package com.billim.domain.workorder.infra

import com.billim.domain.workorder.domain.WorkOrderCategory
import org.springframework.data.jpa.repository.JpaRepository

/**
 * VendorCategory Repository
 * 협력업체(Vendor)의 카테고리 매핑 데이터 접근 계층
 * 예: Vendor 1 은 ELECTRICAL, PLUMBING 카테고리 처리 가능
 *
 * SQL 생성:
 * CREATE TABLE vendor_categories (
 *   id BIGINT PRIMARY KEY AUTO_INCREMENT,
 *   vendor_id BIGINT NOT NULL,
 *   category VARCHAR(50) NOT NULL,
 *   created_at DATETIME NOT NULL,
 *   updated_at DATETIME NOT NULL,
 *   FOREIGN KEY (vendor_id) REFERENCES vendors(id),
 *   UNIQUE KEY uk_vendor_category (vendor_id, category)
 * );
 */
interface VendorCategoryRepository : JpaRepository<Any, Long> {
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
