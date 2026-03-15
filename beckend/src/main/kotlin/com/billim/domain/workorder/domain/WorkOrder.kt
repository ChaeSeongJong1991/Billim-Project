package com.billim.domain.workorder.domain

import com.billim.global.common.BaseEntity
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

/**
 * WorkOrder (유지보수 요청) Entity
 * 임차인이 신청한 수리/유지보수 요청을 관리하는 Entity
 *
 * SQL 생성:
 * CREATE TABLE work_orders (
 *   id BIGINT PRIMARY KEY AUTO_INCREMENT,
 *   tenant_id BIGINT NOT NULL,
 *   building_id BIGINT NOT NULL,
 *   unit_id BIGINT NOT NULL,
 *   title VARCHAR(255) NOT NULL,
 *   description VARCHAR(1000),
 *   category VARCHAR(50) NOT NULL,
 *   priority VARCHAR(50) NOT NULL,
 *   status VARCHAR(50) NOT NULL,
 *   assigned_vendor_id BIGINT,
 *   created_at DATETIME NOT NULL,
 *   updated_at DATETIME NOT NULL,
 *   deleted_at DATETIME,
 *   FOREIGN KEY (tenant_id) REFERENCES tenants(id),
 *   FOREIGN KEY (building_id) REFERENCES buildings(id),
 *   FOREIGN KEY (unit_id) REFERENCES rooms(id),
 *   INDEX idx_tenant (tenant_id),
 *   INDEX idx_building (building_id),
 *   INDEX idx_unit (unit_id),
 *   INDEX idx_status (status)
 * );
 */
@Entity
@Table(
    name = "work_orders",
    indexes = [
        Index(name = "idx_tenant", columnList = "tenant_id"),
        Index(name = "idx_building", columnList = "building_id"),
        Index(name = "idx_unit", columnList = "unit_id"),
        Index(name = "idx_status", columnList = "status")
    ]
)
class WorkOrder(
    @field:NotNull(message = "임차인 ID는 필수입니다.")
    @Column(nullable = false)
    var tenantId: Long,

    @field:NotNull(message = "건물 ID는 필수입니다.")
    @Column(nullable = false)
    var buildingId: Long,

    @field:NotNull(message = "호실 ID는 필수입니다.")
    @Column(nullable = false)
    var unitId: Long,

    @field:NotBlank(message = "제목은 필수입니다.")
    @Column(nullable = false, length = 255)
    var title: String,

    @Column(nullable = true, length = 1000)
    var description: String? = null,

    @field:NotNull(message = "카테고리는 필수입니다.")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var category: WorkOrderCategory,

    @field:NotNull(message = "우선순위는 필수입니다.")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var priority: Priority = Priority.MEDIUM,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: WorkOrderStatus = WorkOrderStatus.RECEIVED,

    @OneToMany(
        mappedBy = "workOrder",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    val images: MutableList<WorkOrderImage> = mutableListOf(),

    @OneToMany(
        mappedBy = "workOrder",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    val timeline: MutableList<WorkOrderTimeline> = mutableListOf(),

    @Column(nullable = true)
    var assignedVendorId: Long? = null,

    @Column(nullable = true)
    var deletedAt: LocalDateTime? = null

) : BaseEntity() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null

    /**
     * WorkOrder 업데이트 메서드 (제목, 설명, 카테고리, 우선순위)
     */
    fun update(
        title: String,
        description: String?,
        category: WorkOrderCategory,
        priority: Priority
    ) {
        this.title = title
        this.description = description
        this.category = category
        this.priority = priority
    }

    /**
     * WorkOrder 상태 업데이트 메서드
     */
    fun updateStatus(status: WorkOrderStatus) {
        this.status = status
    }

    /**
     * 협력업체 할당
     */
    fun assignVendor(vendorId: Long) {
        this.assignedVendorId = vendorId
    }

    /**
     * 협력업체 할당 해제
     */
    fun unassignVendor() {
        this.assignedVendorId = null
    }

    /**
     * 이미지 추가
     */
    fun addImage(image: WorkOrderImage) {
        images.add(image)
    }

    /**
     * 이미지 제거
     */
    fun removeImage(image: WorkOrderImage) {
        images.remove(image)
    }

    /**
     * 타임라인 항목 추가 (상태 변경 기록)
     */
    fun addTimeline(timeline: WorkOrderTimeline) {
        this.timeline.add(timeline)
    }

    /**
     * soft delete
     */
    fun delete() {
        this.deletedAt = LocalDateTime.now()
    }

    /**
     * soft delete 복원
     */
    fun restore() {
        this.deletedAt = null
    }
}
