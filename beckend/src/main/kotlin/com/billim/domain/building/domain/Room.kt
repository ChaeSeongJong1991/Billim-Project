package com.billim.domain.building.domain

import com.billim.global.common.BaseEntity
import jakarta.persistence.*

@Entity
@Table(
    name = "rooms",
    uniqueConstraints = [UniqueConstraint(columnNames = ["building_id", "room_number"])]
)
class Room(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    val building: Building,

    @Column(name = "room_number", nullable = false)
    var roomNumber: String,

    @Column(name = "management_number", nullable = true)
    var managementNumber: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false)
    var propertyType: PropertyType,

    @Column(nullable = false)
    var floor: Int,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: RoomStatus = RoomStatus.VACANT,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
) : BaseEntity() {

    fun update(roomNumber: String, managementNumber: String?, propertyType: PropertyType, floor: Int) {
        this.roomNumber = roomNumber
        this.managementNumber = managementNumber
        this.propertyType = propertyType
        this.floor = floor
    }

    fun updateStatus(status: RoomStatus) {
        this.status = status
    }
}

enum class PropertyType {
    ONE_ROOM, TWO_ROOM, THREE_ROOM, APT, OFFICE, SHOP, ETC
}

enum class RoomStatus {
    VACANT, OCCUPIED, MAINTENANCE
}
