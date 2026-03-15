package com.billim.domain.workorder.domain

import com.billim.global.common.BaseEntity
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import java.time.LocalDateTime

/**
 * WorkOrder 이미지 Entity
 * WorkOrder의 첨부 이미지를 저장하는 Entity
 *
 * SQL 생성:
 * CREATE TABLE work_order_images (
 *   id BIGINT PRIMARY KEY AUTO_INCREMENT,
 *   work_order_id BIGINT NOT NULL,
 *   image_url VARCHAR(500) NOT NULL,
 *   uploaded_at DATETIME NOT NULL,
 *   created_at DATETIME NOT NULL,
 *   updated_at DATETIME NOT NULL,
 *   FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE
 * );
 */
@Entity
@Table(name = "work_order_images")
class WorkOrderImage(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_order_id", nullable = false)
    val workOrder: WorkOrder,

    @field:NotBlank(message = "이미지 URL은 필수입니다.")
    @Column(nullable = false, length = 500)
    var imageUrl: String,

    @Column(nullable = false)
    var uploadedAt: LocalDateTime = LocalDateTime.now()

) : BaseEntity() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null

    fun update(imageUrl: String) {
        this.imageUrl = imageUrl
        this.uploadedAt = LocalDateTime.now()
    }
}
