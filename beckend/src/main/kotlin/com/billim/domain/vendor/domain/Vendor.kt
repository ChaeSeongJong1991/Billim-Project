package com.billim.domain.vendor.domain

import com.billim.global.common.BaseEntity
import jakarta.persistence.*

@Entity
@Table(name = "vendors")
class Vendor(

    @Column(nullable = false)
    val name: String,

    @Column(nullable = false, unique = true)
    val email: String,

    @Column(nullable = false)
    val phone: String,

    @Column(nullable = false)
    val businessNumber: String = "",

    @Column(nullable = false)
    val isActive: Boolean = true,

    @OneToMany(mappedBy = "vendor", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val categories: MutableList<VendorCategory> = mutableListOf()

) : BaseEntity() {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0
}
