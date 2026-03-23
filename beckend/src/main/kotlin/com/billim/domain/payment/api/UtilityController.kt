package com.billim.domain.payment.api

import com.billim.domain.payment.application.UtilityService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

data class SplitUtilityRequest(
    val buildingId: Long,
    val year: Int,
    val month: Int,
    val type: String,
    val totalAmount: Long
)

@RestController
@RequestMapping("/api/v1/utilities")
class UtilityController(
    private val utilityService: UtilityService
) {
    @PostMapping("/split")
    fun splitUtilityBill(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestBody request: SplitUtilityRequest
    ): ResponseEntity<Void> {
        utilityService.splitUtilityBill(
            email = userDetails.username,
            buildingId = request.buildingId,
            year = request.year,
            month = request.month,
            type = request.type,
            totalAmount = request.totalAmount
        )
        return ResponseEntity.ok().build()
    }
}
