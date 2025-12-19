package com.billim.domain.user.infra

import com.billim.domain.user.domain.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<User, Long> {
    fun existsByEmail(email: String): Boolean // 중복 가입 체크용
    fun findByEmail(email: String): User?     // 로그인 시 조회용
}
