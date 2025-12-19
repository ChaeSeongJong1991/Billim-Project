package com.billim.domain.user.domain

import com.billim.global.common.BaseEntity
import jakarta.persistence.*

@Entity
@Table(name = "users")
class User(
    @Column(nullable = false, unique = true)
    val email: String,

    @Column(nullable = false)
    var password: String,

    @Column(nullable = false)
    var name: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val role: Role = Role.USER,

    @Enumerated(EnumType.STRING)
    val provider: AuthProvider? = null,
    val providerId: String? = null

) : BaseEntity() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
}

enum class Role { USER, ADMIN }
enum class AuthProvider { GOOGLE, KAKAO, NAVER, LOCAL }
