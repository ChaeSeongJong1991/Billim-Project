package com.billim.domain.maintenance.api

import com.billim.domain.maintenance.api.dto.*
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/maintenance-guides")
class PreventiveMaintenanceController {

    /**
     * GET /api/v1/maintenance-guides
     * 예방정비 가이드 목록
     */
    @GetMapping
    fun getMaintenanceGuides(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestParam(required = false) unitId: Long?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): ResponseEntity<MaintenanceGuideListResponse> {
        // 서비스 호출: maintenanceService.getGuideList(userDetails.username, unitId, page, pageSize)
        val response = MaintenanceGuideListResponse(
            content = emptyList(),
            totalElements = 0L,
            totalPages = 0,
            currentPage = page,
            pageSize = pageSize,
            hasNext = false
        )
        return ResponseEntity.ok(response)
    }

    /**
     * POST /api/v1/maintenance-guides
     * 예방정비 가이드 등록
     */
    @PostMapping
    fun createMaintenanceGuide(
        @AuthenticationPrincipal userDetails: UserDetails,
        @Valid @RequestBody request: MaintenanceGuideCreateRequest
    ): ResponseEntity<Long> {
        // 서비스 호출: maintenanceService.createGuide(userDetails.username, request)
        val guideId = 1L
        return ResponseEntity.status(HttpStatus.CREATED).body(guideId)
    }

    /**
     * GET /api/v1/maintenance-guides/{id}
     * 예방정비 가이드 상세
     */
    @GetMapping("/{id}")
    fun getMaintenanceGuide(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable id: Long
    ): ResponseEntity<MaintenanceGuideResponse> {
        // 서비스 호출: maintenanceService.getGuide(userDetails.username, id)
        val response = MaintenanceGuideResponse(
            id = id,
            title = "에어컨 필터",
            category = com.billim.domain.workorder.domain.WorkOrderCategory.ELECTRICAL,
            intervalMonths = 6,
            baseExecutionDate = java.time.LocalDate.now(),
            nextScheduledAt = java.time.LocalDate.now().plusMonths(6),
            isOverdue = false,
            affectedRoomCount = 0,
            createdAt = java.time.LocalDateTime.now(),
            updatedAt = java.time.LocalDateTime.now()
        )
        return ResponseEntity.ok(response)
    }

    /**
     * PUT /api/v1/maintenance-guides/{id}
     * 예방정비 가이드 수정
     */
    @PutMapping("/{id}")
    fun updateMaintenanceGuide(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable id: Long,
        @Valid @RequestBody request: MaintenanceGuideUpdateRequest
    ): ResponseEntity<Unit> {
        // 서비스 호출: maintenanceService.updateGuide(userDetails.username, id, request)
        return ResponseEntity.ok().build()
    }

    /**
     * DELETE /api/v1/maintenance-guides/{id}
     * 예방정비 가이드 삭제
     */
    @DeleteMapping("/{id}")
    fun deleteMaintenanceGuide(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable id: Long
    ): ResponseEntity<Unit> {
        // 서비스 호출: maintenanceService.deleteGuide(userDetails.username, id)
        return ResponseEntity.noContent().build()
    }
}
