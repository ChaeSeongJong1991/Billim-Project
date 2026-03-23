package com.billim.domain.payment.domain

import com.billim.domain.building.domain.Building
import com.billim.global.common.BaseEntity
import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(
    name = "expenses",
    indexes = [Index(name = "idx_building_expense_date", columnList = "building_id, expense_date")]
)
class Expense(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    val building: Building,

    @Column(name = "expense_date", nullable = false)
    val expenseDate: LocalDate,

    @Column(name = "category", nullable = false)
    val category: String, // REPAIR, TAX, INTEREST, INSURANCE, UTILITY, MAINTENANCE, ETC

    @Column(name = "amount", nullable = false)
    val amount: Long,

    @Column(name = "description", columnDefinition = "TEXT")
    val description: String? = null,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
) : BaseEntity()
