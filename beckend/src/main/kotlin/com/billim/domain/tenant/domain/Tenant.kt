package com.billim.domain.tenant.domain

import jakarta.persistence.*

@Entity
@Table(name = "tenants", indexes = [Index(name = "idx_user_id", columnList = "user_id")])
class Tenant(
    @Column(nullable = false)
    var name: String,

    @Column(name = "phone_number", nullable = false)
    var phoneNumber: String,

    @Column(name = "user_id", nullable = true)
    var userId: Long? = null, // References User.id

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
)
