package com.billim.domain.workorder.domain

import com.billim.global.common.BaseEntity
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

/**
 * WorkOrder 타임라인 Entity
 * WorkOrder의 상태 변경 히스토리를 추적하는 Entity
 *
 * SQL 생성:
 * CREATE TABLE work_order_timelines (
 *   id BIGINT PRIMARY KEY AUTO_INCREMENT,
 *   work_order_id BIGINT NOT NULL,
 *   status VARCHAR(50) NOT NULL,
 *   description VARCHAR(500),
 *   changed_by VARCHAR(100) NOT NULL,
 *   changed_at DATETIME NOT NULL,
 *   created_at DATETIME NOT NULL,
 *   updated_at DATETIME NOT NULL,
 *   FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE
 * );
 */
@Entity
@Table(name = "work_order_timelines")
class WorkOrderTimeline(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_order_id", nullable = false)
    val workOrder: WorkOrder,

    @field:NotNull(message = "상태는 필수입니다.")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: WorkOrderStatus,

    @Column(nullable = true, length = 500)
    var description: String? = null,

    @field:NotBlank(message = "변경자는 필수입니다.")
    @Column(nullable = false, length = 100)
    var changedBy: String,

    @Column(nullable = false)
    var changedAt: LocalDateTime = LocalDateTime.now()

) : BaseEntity() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
}
