package com.billim.domain.workorder.api

import com.billim.domain.workorder.api.dto.*
import com.billim.domain.workorder.domain.Priority
import com.billim.domain.workorder.domain.WorkOrderCategory
import com.billim.domain.workorder.domain.WorkOrderStatus
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/work-orders")
class WorkOrderController {

    /**
     * POST /api/v1/work-orders
     * 민원 접수
     */
    @PostMapping
    fun createWorkOrder(
        @AuthenticationPrincipal userDetails: UserDetails,
        @Valid @RequestBody request: CreateWorkOrderRequest
    ): ResponseEntity<Long> {
        // 서비스 호출: workOrderService.create(userDetails.username, request)
        val workOrderId = 1L
        return ResponseEntity.status(HttpStatus.CREATED).body(workOrderId)
    }

    /**
     * GET /api/v1/work-orders
     * 민원 목록 (필터/정렬)
     */
    @GetMapping
    fun getWorkOrders(
        @AuthenticationPrincipal userDetails: UserDetails,
        @Valid @RequestBody(required = false) filter: WorkOrderFilterRequest?
    ): ResponseEntity<WorkOrderListResponse> {
        // 서비스 호출: workOrderService.getList(userDetails.username, filter)
        val response = WorkOrderListResponse(
            workOrders = emptyList(),
            totalCount = 0,
            pageNumber = filter?.pageNumber ?: 1,
            pageSize = filter?.pageSize ?: 10
        )
        return ResponseEntity.ok(response)
    }

    /**
     * GET /api/v1/work-orders/{id}
     * 민원 상세
     */
    @GetMapping("/{id}")
    fun getWorkOrderDetail(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable id: Long
    ): ResponseEntity<WorkOrderDetailResponse> {
        // 서비스 호출: workOrderService.getDetail(userDetails.username, id)
        val response = WorkOrderDetailResponse(
            id = id,
            title = "민원 제목",
            description = "민원 설명",
            status = WorkOrderStatus.RECEIVED,
            priority = Priority.HIGH,
            category = WorkOrderCategory.PLUMBING,
            tenantId = 1L,
            buildingId = 1L,
            unitId = 1L
        )
        return ResponseEntity.ok(response)
    }

    /**
     * PUT /api/v1/work-orders/{id}/status
     * 상태 변경
     */
    @PutMapping("/{id}/status")
    fun updateWorkOrderStatus(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateWorkOrderStatusRequest
    ): ResponseEntity<Unit> {
        // 서비스 호출: workOrderService.updateStatus(userDetails.username, id, request)
        return ResponseEntity.ok().build()
    }

    /**
     * PUT /api/v1/work-orders/{id}
     * 민원 수정
     */
    @PutMapping("/{id}")
    fun updateWorkOrder(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateWorkOrderRequest
    ): ResponseEntity<Unit> {
        // 서비스 호출: workOrderService.update(userDetails.username, id, request)
        return ResponseEntity.ok().build()
    }

    /**
     * DELETE /api/v1/work-orders/{id}
     * 민원 삭제
     */
    @DeleteMapping("/{id}")
    fun deleteWorkOrder(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable id: Long
    ): ResponseEntity<Unit> {
        // 서비스 호출: workOrderService.delete(userDetails.username, id)
        return ResponseEntity.noContent().build()
    }

    /**
     * GET /api/v1/work-orders/{id}/timeline
     * 타임라인 조회
     */
    @GetMapping("/{id}/timeline")
    fun getWorkOrderTimeline(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable id: Long
    ): ResponseEntity<List<WorkOrderTimelineResponse>> {
        // 서비스 호출: workOrderService.getTimeline(userDetails.username, id)
        val timeline = emptyList<WorkOrderTimelineResponse>()
        return ResponseEntity.ok(timeline)
    }
}
