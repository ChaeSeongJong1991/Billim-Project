package com.billim.domain.user.application

import com.billim.domain.user.infra.UserRepository
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserDetailsServiceImpl(
    private val userRepository: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(email: String): UserDetails {
        val user = userRepository.findByEmail(email)
            ?: throw UsernameNotFoundException("사용자를 찾을 수 없습니다: $email")

        return org.springframework.security.core.userdetails.User(
            user.email,
            user.password ?: "", // 소셜 로그인 사용자는 비밀번호 없음
            listOf(SimpleGrantedAuthority("ROLE_${user.role}"))
        )
    }
}
