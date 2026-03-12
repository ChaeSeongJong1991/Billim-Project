package com.billim.domain.tenant.infra

import com.billim.domain.tenant.domain.Tenant
import org.springframework.data.jpa.repository.JpaRepository

interface TenantRepository : JpaRepository<Tenant, Long> {
    fun findAllByLandlordEmail(email: String): List<Tenant>
    fun existsByLandlordEmailAndPhoneNumber(email: String, phoneNumber: String): Boolean
}
