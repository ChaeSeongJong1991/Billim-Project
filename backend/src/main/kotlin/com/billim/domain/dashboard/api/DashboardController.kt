package com.billim.domain.dashboard.api

import com.billim.domain.common.api.dto.AdminDashboardResponse
import com.billim.domain.common.api.dto.TenantDashboardResponse
import com.billim.domain.dashboard.api.dto.LandlordDashboardResponse
import com.billim.domain.dashboard.application.LandlordDashboardService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/dashboard")
class DashboardController(
    private val landlordDashboardService: LandlordDashboardService
) {

    /**
     * GET /api/v1/dashboard/landlord
     * 임대인(관리자) 대시보드 - 호실 현황, 계약 만료, 미납 요약
     */
    @GetMapping("/landlord")
    fun getLandlordDashboard(
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<LandlordDashboardResponse> {
        val response = landlordDashboardService.getDashboard(userDetails.username)
        return ResponseEntity.ok(response)
    }

    /**
     * GET /api/v1/dashboard/calendar
     * 캘린더 대시보드 데이터 조회
     */
    @GetMapping("/calendar")
    fun getDashboardCalendar(
        @org.springframework.web.bind.annotation.RequestParam year: Int,
        @org.springframework.web.bind.annotation.RequestParam month: Int,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<com.billim.domain.dashboard.api.dto.DashboardCalendarResponse> {
        val response = landlordDashboardService.getCalendarData(userDetails.username, year, month)
        return ResponseEntity.ok(response)
    }

    /**
     * GET /api/v1/dashboard/tenant
     * 임차인 대시보드
     */
    @GetMapping("/tenant")
    fun getTenantDashboard(
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<TenantDashboardResponse> {
        // 서비스 호출: dashboardService.getTenantDashboard(userDetails.username)
        val response = TenantDashboardResponse(
            stats = com.billim.domain.common.api.dto.DashboardStats(
                receivedCount = 5,
                inProgressCount = 3,
                completedCount = 12
            ),
            recentWorkOrders = emptyList()
        )
        return ResponseEntity.ok(response)
    }

    /**
     * GET /api/v1/dashboard/admin
     * 관리자 대시보드
     */
    @GetMapping("/admin")
    fun getAdminDashboard(
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<AdminDashboardResponse> {
        // 서비스 호출: dashboardService.getAdminDashboard(userDetails.username)
        val response = AdminDashboardResponse(
            kpi = com.billim.domain.common.api.dto.DashboardKPI(
                completionRate = 85.5,
                avgCompletionDays = 3.2,
                totalWorkOrders = 150,
                thisMonthCompleted = 45
            ),
            statusDistribution = mapOf(
                "RECEIVED" to 20,
                "IN_PROGRESS" to 15,
                "COMPLETED" to 115
            ),
            categoryDistribution = mapOf(
                "PLUMBING" to 50,
                "ELECTRICAL" to 45,
                "STRUCTURAL" to 55
            ),
            recentWorkOrders = emptyList()
        )
        return ResponseEntity.ok(response)
    }
}
