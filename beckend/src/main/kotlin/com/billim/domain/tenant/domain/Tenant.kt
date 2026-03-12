package com.billim.domain.tenant.domain

import com.billim.domain.user.domain.User
import com.billim.global.common.BaseEntity
import jakarta.persistence.*

@Entity
@Table(
    name = "tenants",
    indexes = [Index(name = "idx_landlord_id", columnList = "landlord_id")]
)
class Tenant(
    @Column(nullable = false)
    var name: String,

    @Column(name = "phone_number", nullable = false)
    var phoneNumber: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id", nullable = false)
    val landlord: User,

    // 세입자가 앱에 가입 시 연동되는 User ID (선택)
    @Column(name = "user_id", nullable = true)
    var userId: Long? = null,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
) : BaseEntity() {

    fun update(name: String, phoneNumber: String) {
        this.name = name
        this.phoneNumber = phoneNumber
    }
}
