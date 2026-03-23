package com.billim.domain.building.domain

import com.billim.domain.user.domain.User
import com.billim.global.common.BaseEntity
import jakarta.persistence.*

@Entity
@Table(name = "buildings")
class Building(
    @Column(nullable = false)
    var name: String, // 건물 애칭 (예: 강남 1호점)

    @Column(nullable = false)
    var address: String, // 전체 주소

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var type: BuildingType, // 빌라, 아파트, 상가 등
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User

) : BaseEntity() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null

    fun update(name: String, address: String, type: BuildingType) {
        this.name = name
        this.address = address
        this.type = type
    }
}

enum class BuildingType {
    APARTMENT, VILLA, OFFICE, SHOP, ETC
}
