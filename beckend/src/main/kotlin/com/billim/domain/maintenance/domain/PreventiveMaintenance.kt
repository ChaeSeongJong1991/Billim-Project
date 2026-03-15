package com.billim.domain.maintenance.domain

import com.billim.global.common.BaseEntity
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

/**
 * PreventiveMaintenance (예방정비) Entity
 * 주기적인 유지보수 계획을 관리하는 Entity
 * 예: 냉난방 필터 교체 - 분기별, 통풍기 점검 - 월별 등
 *
 * SQL 생성:
 * CREATE TABLE preventive_maintenances (
 *   id BIGINT PRIMARY KEY AUTO_INCREMENT,
 *   building_id BIGINT NOT NULL,
 *   unit_id BIGINT NOT NULL,
 *   category VARCHAR(50) NOT NULL,
 *   title VARCHAR(255) NOT NULL,
 *   description VARCHAR(1000),
 *   frequency VARCHAR(50) NOT NULL,
 *   last_performed_at DATETIME,
 *   next_due_at DATETIME NOT NULL,
 *   is_active BOOLEAN DEFAULT TRUE,
 *   created_at DATETIME NOT NULL,
 *   updated_at DATETIME NOT NULL,
 *   FOREIGN KEY (building_id) REFERENCES buildings(id),
 *   FOREIGN KEY (unit_id) REFERENCES rooms(id),
 *   INDEX idx_building (building_id),
 *   INDEX idx_unit (unit_id),
 *   INDEX idx_next_due (next_due_at),
 *   INDEX idx_is_active (is_active)
 * );
 */
@Entity
@Table(
    name = "preventive_maintenances",
    indexes = [
        Index(name = "idx_building", columnList = "building_id"),
        Index(name = "idx_unit", columnList = "unit_id"),
        Index(name = "idx_next_due", columnList = "next_due_at"),
        Index(name = "idx_is_active", columnList = "is_active")
    ]
)
class PreventiveMaintenance(
    @field:NotNull(message = "건물 ID는 필수입니다.")
    @Column(nullable = false)
    var buildingId: Long,

    @field:NotNull(message = "호실 ID는 필수입니다.")
    @Column(nullable = false)
    var unitId: Long,

    @field:NotBlank(message = "카테고리는 필수입니다.")
    @Column(nullable = false, length = 50)
    var category: String,

    @field:NotBlank(message = "제목은 필수입니다.")
    @Column(nullable = false, length = 255)
    var title: String,

    @Column(nullable = true, length = 1000)
    var description: String? = null,

    @field:NotBlank(message = "주기는 필수입니다.")
    @Column(nullable = false, length = 50)
    var frequency: String, // WEEKLY, MONTHLY, QUARTERLY, YEARLY

    @Column(nullable = true)
    var lastPerformedAt: LocalDateTime? = null,

    @field:NotNull(message = "예정 날짜는 필수입니다.")
    @Column(nullable = false)
    var nextDueAt: LocalDateTime,

    @Column(nullable = false)
    var isActive: Boolean = true

) : BaseEntity() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null

    /**
     * 예방정비 수행 기록 업데이트
     */
    fun markAsPerformed(nextDueAt: LocalDateTime) {
        this.lastPerformedAt = LocalDateTime.now()
        this.nextDueAt = nextDueAt
    }

    /**
     * 예방정비 활성화
     */
    fun activate() {
        this.isActive = true
    }

    /**
     * 예방정비 비활성화
     */
    fun deactivate() {
        this.isActive = false
    }

    /**
     * 예방정비 정보 업데이트
     */
    fun update(
        title: String,
        description: String?,
        category: String,
        frequency: String,
        nextDueAt: LocalDateTime
    ) {
        this.title = title
        this.description = description
        this.category = category
        this.frequency = frequency
        this.nextDueAt = nextDueAt
    }
}
