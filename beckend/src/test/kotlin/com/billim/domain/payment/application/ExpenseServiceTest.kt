package com.billim.domain.payment.application

import com.billim.domain.building.domain.Building
import com.billim.domain.building.infra.BuildingRepository
import com.billim.domain.payment.domain.Expense
import com.billim.domain.payment.infra.ExpenseRepository
import com.billim.domain.payment.infra.PaymentRepository
import com.billim.domain.user.domain.Role
import com.billim.domain.user.domain.User
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import java.time.LocalDate

@ExtendWith(MockitoExtension::class)
class ExpenseServiceTest {

    @Mock
    lateinit var expenseRepository: ExpenseRepository

    @Mock
    lateinit var buildingRepository: BuildingRepository

    @Mock
    lateinit var paymentRepository: PaymentRepository

    @InjectMocks
    lateinit var expenseService: ExpenseService

    @Test
    fun `getProfitability should calculate net profit and margin correctly`() {
        // Given
        val email = "test@example.com"
        val year = 2026
        
        val building = org.mockito.Mockito.mock(Building::class.java)
        
        // Mock expenses for January
        val expenses = listOf(
            Expense(building, LocalDate.of(year, 1, 15), "REPAIR", 50000),
            Expense(building, LocalDate.of(year, 1, 20), "TAX", 20000) // Total 70000
        )
        
        `when`(expenseRepository.findByUserEmailAndExpenseDateBetween(
            email, LocalDate.of(year, 1, 1), LocalDate.of(year, 12, 31)
        )).thenReturn(expenses)

        // Mock revenue for January: Month 1, amount 200000
        val revenueRecord = arrayOf<Any>(1, 200000L)
        `when`(paymentRepository.findMonthlyRevenueByUserEmailAndYear(email, year))
            .thenReturn(listOf(revenueRecord))

        // When
        val result = expenseService.getProfitability(email, year)

        // Then
        assertEquals(12, result.size)
        // January checks
        val jan = result[0]
        assertEquals(1, jan.month)
        assertEquals(200000L, jan.revenue)
        assertEquals(70000L, jan.expense)
        assertEquals(130000L, jan.netProfit) // 200000 - 70000 = 130000
        assertEquals(65.0, jan.margin) // 130000 / 200000 * 100 = 65.0
        
        // February checks (empty)
        val feb = result[1]
        assertEquals(2, feb.month)
        assertEquals(0L, feb.revenue)
        assertEquals(0L, feb.expense)
        assertEquals(0L, feb.netProfit)
        assertEquals(0.0, feb.margin)
    }
}
