package com.billim.domain.tenant.api

import com.billim.domain.tenant.api.dto.TenantCreateRequest
import com.billim.domain.tenant.api.dto.TenantResponse
import com.billim.domain.tenant.api.dto.TenantUpdateRequest
import com.billim.domain.tenant.application.TenantService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/tenants")
class TenantController(
    private val tenantService: TenantService
) {

    @PostMapping
    fun create(
        @AuthenticationPrincipal userDetails: UserDetails,
        @Valid @RequestBody request: TenantCreateRequest
    ): ResponseEntity<Long> {
        val tenantId = tenantService.create(userDetails.username, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(tenantId)
    }

    @GetMapping
    fun getMyTenants(
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<List<TenantResponse>> {
        val tenants = tenantService.getMyTenants(userDetails.username)
        return ResponseEntity.ok(tenants)
    }

    @GetMapping("/{tenantId}")
    fun getTenant(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable tenantId: Long
    ): ResponseEntity<TenantResponse> {
        val tenant = tenantService.getTenant(userDetails.username, tenantId)
        return ResponseEntity.ok(tenant)
    }

    @PutMapping("/{tenantId}")
    fun update(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable tenantId: Long,
        @Valid @RequestBody request: TenantUpdateRequest
    ): ResponseEntity<Unit> {
        tenantService.update(userDetails.username, tenantId, request)
        return ResponseEntity.ok().build()
    }

    @DeleteMapping("/{tenantId}")
    fun delete(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable tenantId: Long
    ): ResponseEntity<Unit> {
        tenantService.delete(userDetails.username, tenantId)
        return ResponseEntity.noContent().build()
    }
}
