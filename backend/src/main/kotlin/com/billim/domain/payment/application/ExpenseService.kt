package com.billim.domain.payment.application

import com.billim.domain.building.infra.BuildingRepository
import com.billim.domain.payment.domain.Expense
import com.billim.domain.payment.infra.ExpenseRepository
import com.billim.domain.payment.infra.PaymentRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

data class ExpenseResponse(
    val id: Long,
    val buildingId: Long,
    val buildingName: String,
    val expenseDate: LocalDate,
    val category: String,
    val amount: Long,
    val description: String?
)

data class ExpenseCreateRequest(
    val buildingId: Long,
    val expenseDate: LocalDate,
    val category: String,
    val amount: Long,
    val description: String?
)

data class ProfitabilityResponse(
    val year: Int,
    val month: Int,
    val revenue: Long,
    val expense: Long,
    val netProfit: Long,
    val margin: Double
)

@Service
@Transactional
class ExpenseService(
    private val expenseRepository: ExpenseRepository,
    private val buildingRepository: BuildingRepository,
    private val paymentRepository: PaymentRepository
) {
    fun createExpense(email: String, request: ExpenseCreateRequest): ExpenseResponse {
        val building = buildingRepository.findById(request.buildingId)
            .orElseThrow { IllegalArgumentException("Building not found") }
            
        if (building.user.email != email) {
            throw IllegalArgumentException("Unauthorized to access this building")
        }

        val expense = Expense(
            building = building,
            expenseDate = request.expenseDate,
            category = request.category,
            amount = request.amount,
            description = request.description
        )
        val saved = expenseRepository.save(expense)
        return ExpenseResponse(
            id = saved.id!!,
            buildingId = building.id!!,
            buildingName = building.name,
            expenseDate = saved.expenseDate,
            category = saved.category,
            amount = saved.amount,
            description = saved.description
        )
    }

    @Transactional(readOnly = true)
    fun getExpenses(email: String, year: Int, month: Int): List<ExpenseResponse> {
        val startDate = LocalDate.of(year, month, 1)
        val endDate = startDate.withDayOfMonth(startDate.lengthOfMonth())
        
        return expenseRepository.findByUserEmailAndExpenseDateBetween(email, startDate, endDate)
            .map {
                ExpenseResponse(
                    id = it.id!!,
                    buildingId = it.building.id!!,
                    buildingName = it.building.name,
                    expenseDate = it.expenseDate,
                    category = it.category,
                    amount = it.amount,
                    description = it.description
                )
            }
    }

    fun deleteExpense(email: String, expenseId: Long) {
        val expense = expenseRepository.findById(expenseId).orElseThrow { IllegalArgumentException("Expense not found") }
        if (expense.building.user.email != email) {
            throw IllegalArgumentException("Unauthorized")
        }
        expenseRepository.delete(expense)
    }

    @Transactional(readOnly = true)
    fun getProfitability(email: String, year: Int): List<ProfitabilityResponse> {
        val startDate = LocalDate.of(year, 1, 1)
        val endDate = LocalDate.of(year, 12, 31)

        val expenses = expenseRepository.findByUserEmailAndExpenseDateBetween(email, startDate, endDate)
        val expensesByMonth = expenses.groupBy { it.expenseDate.monthValue }
            .mapValues { entry -> entry.value.sumOf { it.amount } }

        val revenuesByMonth = paymentRepository.findMonthlyRevenueByUserEmailAndYear(email, year)
            // findMonthlyRevenueByUserEmailAndYear returns List<Array<Any>>, where index 0 is month, index 1 is sum
            .associate { (it[0] as Int) to (it[1] as Long) }

        return (1..12).map { month ->
            val rev = revenuesByMonth[month] ?: 0L
            val exp = expensesByMonth[month] ?: 0L
            val net = rev - exp
            val margin = if (rev > 0) String.format("%.2f", (net.toDouble() / rev.toDouble()) * 100).toDouble() else 0.0

            ProfitabilityResponse(year, month, rev, exp, net, margin)
        }
    }
}
