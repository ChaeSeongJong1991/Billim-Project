package com.billim.domain.payment.api

import com.billim.domain.payment.application.ExpenseCreateRequest
import com.billim.domain.payment.application.ExpenseResponse
import com.billim.domain.payment.application.ExpenseService
import com.billim.domain.payment.application.ProfitabilityResponse
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/expenses")
class ExpenseController(
    private val expenseService: ExpenseService
) {
    @PostMapping
    fun createExpense(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestBody request: ExpenseCreateRequest
    ): ResponseEntity<ExpenseResponse> {
        val response = expenseService.createExpense(userDetails.username, request)
        return ResponseEntity.ok(response)
    }

    @GetMapping
    fun getExpenses(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestParam year: Int,
        @RequestParam month: Int
    ): ResponseEntity<List<ExpenseResponse>> {
        val response = expenseService.getExpenses(userDetails.username, year, month)
        return ResponseEntity.ok(response)
    }

    @DeleteMapping("/{id}")
    fun deleteExpense(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable id: Long
    ): ResponseEntity<Void> {
        expenseService.deleteExpense(userDetails.username, id)
        return ResponseEntity.ok().build()
    }

    @GetMapping("/profitability")
    fun getProfitability(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestParam year: Int
    ): ResponseEntity<List<ProfitabilityResponse>> {
        val response = expenseService.getProfitability(userDetails.username, year)
        return ResponseEntity.ok(response)
    }
}
