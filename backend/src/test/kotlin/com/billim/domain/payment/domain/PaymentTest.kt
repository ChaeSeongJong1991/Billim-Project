package com.billim.domain.payment.domain

import com.billim.domain.building.domain.Building
import com.billim.domain.building.domain.BuildingType
import com.billim.domain.contract.domain.Contract
import com.billim.domain.contract.domain.ContractType
import com.billim.domain.user.domain.User
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import java.time.LocalDate

class PaymentTest {

    private fun createUser(): User {
        val user = User(email = "owner@example.com", name = "Owner")
        val idField = User::class.java.getDeclaredField("id")
        idField.isAccessible = true
        idField.set(user, 1L)
        return user
    }

    private fun createBuilding(): Building {
        val building = Building(
            name = "Test Building",
            address = "Seoul",
            type = BuildingType.APARTMENT,
            user = createUser()
        )
        val idField = Building::class.java.getDeclaredField("id")
        idField.isAccessible = true
        idField.set(building, 1L)
        return building
    }

    private fun createContract(): Contract {
        val contract = Contract(
            building = createBuilding(),
            roomNumber = "101",
            contractType = ContractType.MONTHLY_POST,
            tenantName = "Tenant",
            tenantPhone = "010-1234-5678",
            deposit = 10_000_000,
            monthlyRent = 500_000,
            maintenanceFee = 50_000,
            rentDay = 25,
            startDate = LocalDate.of(2025, 1, 1),
            endDate = LocalDate.of(2026, 12, 31),
            householdCount = 1
        )
        val idField = Contract::class.java.getDeclaredField("id")
        idField.isAccessible = true
        idField.set(contract, 1L)
        return contract
    }

    private fun createPayment(
        billedAmount: Long = 500_000,
        paidAmount: Long = 0,
        utilityAmount: Long = 0
    ): Payment {
        return Payment(
            contract = createContract(),
            billingYear = 2026,
            billingMonth = 3,
            billedAmount = billedAmount,
            paidAmount = paidAmount,
            utilityAmount = utilityAmount
        )
    }

    @Test
    fun `collect should set paymentDate from parameter`() {
        // Given
        val payment = createPayment()
        val paymentDate = LocalDate.of(2026, 3, 15)

        // When
        payment.collect(500_000, "TRANSFER", "Full payment", paymentDate)

        // Then
        assertEquals(paymentDate, payment.paymentDate)
        assertEquals(500_000, payment.paidAmount)
        assertEquals("TRANSFER", payment.paymentMethod)
        assertEquals("Full payment", payment.memo)
        assertEquals(PaymentStatus.PAID, payment.status)
    }

    @Test
    fun `addUtilityCharge should recalculate status`() {
        // Given: billedAmount=500_000, paidAmount=0, utilityAmount=0 -> UNPAID
        val payment = createPayment()
        assertEquals(PaymentStatus.UNPAID, payment.status)

        // When: add utility charge
        payment.addUtilityCharge(100_000)

        // Then: still UNPAID (paidAmount=0)
        assertEquals(PaymentStatus.UNPAID, payment.status)
        assertEquals(100_000, payment.utilityAmount)
    }

    @Test
    fun `addUtilityCharge after PAID should revert to PARTIAL if threshold exceeded`() {
        // Given: billedAmount=500_000, paid 500_000 -> PAID
        val payment = createPayment(paidAmount = 500_000)
        payment.collect(500_000, "TRANSFER", null, LocalDate.of(2026, 3, 15))
        assertEquals(PaymentStatus.PAID, payment.status)

        // When: add utility charge of 100_000 -> total required = 600_000, paid = 500_000
        payment.addUtilityCharge(100_000)

        // Then: status reverts to PARTIAL because 500_000 < (500_000 + 100_000)
        assertEquals(PaymentStatus.PARTIAL, payment.status)
        assertEquals(100_000, payment.utilityAmount)
        assertEquals(500_000, payment.paidAmount)
    }
}
