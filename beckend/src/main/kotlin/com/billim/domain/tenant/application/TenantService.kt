package com.billim.domain.tenant.application

import com.billim.domain.tenant.api.dto.TenantCreateRequest
import com.billim.domain.tenant.api.dto.TenantResponse
import com.billim.domain.tenant.api.dto.TenantUpdateRequest
import com.billim.domain.tenant.domain.Tenant
import com.billim.domain.tenant.infra.TenantRepository
import com.billim.domain.user.infra.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class TenantService(
    private val tenantRepository: TenantRepository,
    private val userRepository: UserRepository
) {

    @Transactional
    fun create(email: String, request: TenantCreateRequest): Long {
        val landlord = userRepository.findByEmail(email)
            ?: throw IllegalArgumentException("사용자를 찾을 수 없습니다.")

        if (tenantRepository.existsByLandlordEmailAndPhoneNumber(email, request.phoneNumber)) {
            throw IllegalArgumentException("이미 등록된 휴대폰 번호입니다: ${request.phoneNumber}")
        }

        val tenant = Tenant(
            name = request.name,
            phoneNumber = request.phoneNumber,
            landlord = landlord
        )

        return tenantRepository.save(tenant).id!!
    }

    fun getMyTenants(email: String): List<TenantResponse> {
        return tenantRepository.findAllByLandlordEmail(email)
            .map { it.toResponse() }
    }

    fun getTenant(email: String, tenantId: Long): TenantResponse {
        val tenant = getVerifiedTenant(email, tenantId)
        return tenant.toResponse()
    }

    @Transactional
    fun update(email: String, tenantId: Long, request: TenantUpdateRequest) {
        val tenant = getVerifiedTenant(email, tenantId)

        if (tenant.phoneNumber != request.phoneNumber &&
            tenantRepository.existsByLandlordEmailAndPhoneNumber(email, request.phoneNumber)
        ) {
            throw IllegalArgumentException("이미 등록된 휴대폰 번호입니다: ${request.phoneNumber}")
        }

        tenant.update(request.name, request.phoneNumber)
    }

    @Transactional
    fun delete(email: String, tenantId: Long) {
        val tenant = getVerifiedTenant(email, tenantId)
        tenantRepository.delete(tenant)
    }

    private fun getVerifiedTenant(email: String, tenantId: Long): Tenant {
        val tenant = tenantRepository.findById(tenantId)
            .orElseThrow { IllegalArgumentException("세입자를 찾을 수 없습니다.") }

        if (tenant.landlord.email != email) {
            throw IllegalStateException("본인이 등록한 세입자만 조회/수정/삭제할 수 있습니다.")
        }

        return tenant
    }

    private fun Tenant.toResponse() = TenantResponse(
        id = this.id!!,
        name = this.name,
        phoneNumber = this.phoneNumber,
        isAppUser = this.userId != null
    )
}
