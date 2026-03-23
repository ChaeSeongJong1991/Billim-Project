package com.billim.domain.payment.infra

import com.billim.domain.payment.domain.Expense
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDate

interface ExpenseRepository : JpaRepository<Expense, Long> {
    fun findByBuildingIdAndExpenseDateBetweenOrderByExpenseDateDesc(
        buildingId: Long, 
        startDate: LocalDate, 
        endDate: LocalDate
    ): List<Expense>

    @Query("""
        SELECT e FROM Expense e
        JOIN e.building b
        WHERE b.user.email = :email
          AND e.expenseDate BETWEEN :startDate AND :endDate
        ORDER BY e.expenseDate DESC
    """)
    fun findByUserEmailAndExpenseDateBetween(
        email: String,
        startDate: LocalDate,
        endDate: LocalDate
    ): List<Expense>
}
