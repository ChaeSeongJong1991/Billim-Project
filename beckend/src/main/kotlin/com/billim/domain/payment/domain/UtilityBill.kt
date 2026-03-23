package com.billim.domain.payment.domain

import com.billim.domain.building.domain.Building
import com.billim.global.common.BaseEntity
import jakarta.persistence.*

@Entity
@Table(
    name = "utility_bills",
    indexes = [Index(name = "idx_building_year_month", columnList = "building_id, billing_year, billing_month")]
)
class UtilityBill(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    val building: Building,

    @Column(name = "billing_year", nullable = false)
    val billingYear: Int,

    @Column(name = "billing_month", nullable = false)
    val billingMonth: Int,

    @Column(name = "type", nullable = false)
    val type: String, // e.g. ELECTRICITY, WATER, GAS, ETC

    @Column(name = "total_amount", nullable = false)
    val totalAmount: Long,

    @Column(name = "room_count", nullable = false)
    val roomCount: Int,

    @Column(name = "per_room_amount", nullable = false)
    val perRoomAmount: Long,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
) : BaseEntity()
