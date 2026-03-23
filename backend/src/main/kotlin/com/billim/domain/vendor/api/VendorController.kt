package com.billim.domain.vendor.api

import com.billim.domain.vendor.api.dto.*
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/vendors")
class VendorController {

    /**
     * GET /api/v1/vendors
     * 협력업체 목록
     */
    @GetMapping
    fun getVendors(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestParam(required = false) category: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): ResponseEntity<VendorListResponse> {
        // 서비스 호출: vendorService.getList(userDetails.username, category, page, pageSize)
        val response = VendorListResponse(
            vendors = emptyList(),
            totalCount = 0
        )
        return ResponseEntity.ok(response)
    }

    /**
     * POST /api/v1/vendors
     * 협력업체 등록
     */
    @PostMapping
    fun createVendor(
        @AuthenticationPrincipal userDetails: UserDetails,
        @Valid @RequestBody request: CreateVendorRequest
    ): ResponseEntity<Long> {
        // 서비스 호출: vendorService.create(userDetails.username, request)
        val vendorId = 1L
        return ResponseEntity.status(HttpStatus.CREATED).body(vendorId)
    }

    /**
     * GET /api/v1/vendors/{id}
     * 협력업체 상세
     */
    @GetMapping("/{id}")
    fun getVendor(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable id: Long
    ): ResponseEntity<VendorDetailResponse> {
        // 서비스 호출: vendorService.getDetail(userDetails.username, id)
        val response = VendorDetailResponse(
            id = id,
            name = "협력업체명",
            email = "vendor@example.com",
            phone = "010-1234-5678",
            address = "서울시 강남구",
            category = "PLUMBING",
            description = "협력업체 설명",
            isActive = true
        )
        return ResponseEntity.ok(response)
    }

    /**
     * PUT /api/v1/vendors/{id}
     * 협력업체 수정
     */
    @PutMapping("/{id}")
    fun updateVendor(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateVendorRequest
    ): ResponseEntity<Unit> {
        // 서비스 호출: vendorService.update(userDetails.username, id, request)
        return ResponseEntity.ok().build()
    }

    /**
     * DELETE /api/v1/vendors/{id}
     * 협력업체 삭제
     */
    @DeleteMapping("/{id}")
    fun deleteVendor(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable id: Long
    ): ResponseEntity<Unit> {
        // 서비스 호출: vendorService.delete(userDetails.username, id)
        return ResponseEntity.noContent().build()
    }

    /**
     * GET /api/v1/vendors/{id}/performance
     * 협력업체 성과통계
     */
    @GetMapping("/{id}/performance")
    fun getVendorPerformance(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable id: Long
    ): ResponseEntity<VendorPerformanceResponse> {
        // 서비스 호출: vendorService.getPerformance(userDetails.username, id)
        val response = VendorPerformanceResponse(
            id = id,
            name = "협력업체명",
            totalCompletedWork = 50,
            avgCompletionDays = 3.5,
            rating = 4.8
        )
        return ResponseEntity.ok(response)
    }

    /**
     * POST /api/v1/work-orders/{id}/assign
     * 민원 배정
     */
    @PostMapping("/{id}/assign")
    fun assignWorkOrder(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable id: Long,
        @Valid @RequestBody request: AssignWorkOrderRequest
    ): ResponseEntity<Unit> {
        // 서비스 호출: vendorService.assignWorkOrder(userDetails.username, id, request)
        return ResponseEntity.ok().build()
    }
}
