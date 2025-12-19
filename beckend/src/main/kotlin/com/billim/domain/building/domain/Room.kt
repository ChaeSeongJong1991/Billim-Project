package com.billim.domain.building.domain

import jakarta.persistence.*

@Entity
@Table(name = "rooms")
class Room(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    val building: Building,

    @Column(name = "room_number", nullable = false, unique = true)
    var roomNumber: String,

    @Column(name = "management_number", nullable = true)
    var managementNumber: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false)
    var propertyType: PropertyType,

    @Column(nullable = false)
    var floor: Int,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
)

enum class PropertyType {
    ONE_ROOM, APT
}
