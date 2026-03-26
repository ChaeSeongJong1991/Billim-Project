package com.billim.domain.payment.application

import com.billim.domain.building.domain.Building
import com.billim.domain.building.domain.BuildingType
import com.billim.domain.building.infra.BuildingRepository
import com.billim.domain.contract.domain.Contract
import com.billim.domain.contract.domain.ContractType
import com.billim.domain.payment.domain.Payment
import com.billim.domain.payment.infra.PaymentRepository
import com.billim.domain.payment.infra.UtilityBillRepository
import com.billim.domain.user.domain.User
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import java.time.LocalDate
import java.util.Optional

@ExtendWith(MockitoExtension::class)
class UtilityServiceTest {

    @Mock
    lateinit var buildingRepository: BuildingRepository

    @Mock
    lateinit var paymentRepository: PaymentRepository

    @Mock
    lateinit var utilityBillRepository: UtilityBillRepository

    @InjectMocks
    lateinit var utilityService: UtilityService

    private val email = "owner@example.com"

    private fun createUser(id: Long = 1L): User {
        val user = User(email = email, name = "Owner")
        val idField = User::class.java.getDeclaredField("id")
        idField.isAccessible = true
        idField.set(user, id)
        return user
    }

    private fun createBuilding(user: User, id: Long = 1L): Building {
        val building = Building(
            name = "Test Building",
            address = "Seoul",
            type = BuildingType.APARTMENT,
            user = user
        )
        val idField = Building::class.java.getDeclaredField("id")
        idField.isAccessible = true
        idField.set(building, id)
        return building
    }

    private fun createContract(building: Building, roomNumber: String, id: Long): Contract {
        val contract = Contract(
            building = building,
            roomNumber = roomNumber,
            contractType = ContractType.MONTHLY_POST,
            tenantName = "Tenant $roomNumber",
            tenantPhone = "010-0000-0000",
            deposit = 10_000_000,
            monthlyRent = 500_000,
            maintenanceFee = 0,
            rentDay = 25,
            startDate = LocalDate.of(2025, 1, 1),
            endDate = LocalDate.of(2026, 12, 31),
            householdCount = 1
        )
        val idField = Contract::class.java.getDeclaredField("id")
        idField.isAccessible = true
        idField.set(contract, id)
        return contract
    }

    private fun createPayment(contract: Contract, id: Long): Payment {
        val payment = Payment(
            contract = contract,
            billingYear = 2026,
            billingMonth = 3,
            billedAmount = 500_000
        )
        val idField = Payment::class.java.getDeclaredField("id")
        idField.isAccessible = true
        idField.set(payment, id)
        return payment
    }

    @Test
    fun `splitUtilityBill should distribute evenly with remainder to first room`() {
        // Given: 3 rooms, totalAmount=100_000 -> 33_333 each, first gets +1 remainder
        val user = createUser()
        val building = createBuilding(user)
        val contract1 = createContract(building, "101", 1L)
        val contract2 = createContract(building, "102", 2L)
        val contract3 = createContract(building, "103", 3L)

        val payment1 = createPayment(contract1, 1L)
        val payment2 = createPayment(contract2, 2L)
        val payment3 = createPayment(contract3, 3L)

        `when`(buildingRepository.findById(1L)).thenReturn(Optional.of(building))
        `when`(paymentRepository.findByBuildingAndYearMonth(1L, 2026, 3))
            .thenReturn(listOf(payment1, payment2, payment3))
        `when`(utilityBillRepository.save(org.mockito.kotlin.any())).thenAnswer { it.arguments[0] }
        `when`(paymentRepository.save(org.mockito.kotlin.any())).thenAnswer { it.arguments[0] }

        // When
        utilityService.splitUtilityBill(email, 1L, 2026, 3, "ELECTRICITY", 100_000)

        // Then: 100_000 / 3 = 33_333 remainder 1
        assertEquals(33_334, payment1.utilityAmount) // first room gets remainder
        assertEquals(33_333, payment2.utilityAmount)
        assertEquals(33_333, payment3.utilityAmount)
    }

    @Test
    fun `splitUtilityBill should handle single room`() {
        // Given: 1 room, totalAmount=100_000 -> all to one room
        val user = createUser()
        val building = createBuilding(user)
        val contract = createContract(building, "101", 1L)
        val payment = createPayment(contract, 1L)

        `when`(buildingRepository.findById(1L)).thenReturn(Optional.of(building))
        `when`(paymentRepository.findByBuildingAndYearMonth(1L, 2026, 3))
            .thenReturn(listOf(payment))
        `when`(utilityBillRepository.save(org.mockito.kotlin.any())).thenAnswer { it.arguments[0] }
        `when`(paymentRepository.save(org.mockito.kotlin.any())).thenAnswer { it.arguments[0] }

        // When
        utilityService.splitUtilityBill(email, 1L, 2026, 3, "WATER", 100_000)

        // Then
        assertEquals(100_000, payment.utilityAmount)
    }

    @Test
    fun `splitUtilityBill should handle zero amount`() {
        // Given: 2 rooms, totalAmount=0
        val user = createUser()
        val building = createBuilding(user)
        val contract1 = createContract(building, "101", 1L)
        val contract2 = createContract(building, "102", 2L)
        val payment1 = createPayment(contract1, 1L)
        val payment2 = createPayment(contract2, 2L)

        `when`(buildingRepository.findById(1L)).thenReturn(Optional.of(building))
        `when`(paymentRepository.findByBuildingAndYearMonth(1L, 2026, 3))
            .thenReturn(listOf(payment1, payment2))
        `when`(utilityBillRepository.save(org.mockito.kotlin.any())).thenAnswer { it.arguments[0] }
        `when`(paymentRepository.save(org.mockito.kotlin.any())).thenAnswer { it.arguments[0] }

        // When
        utilityService.splitUtilityBill(email, 1L, 2026, 3, "GAS", 0)

        // Then
        assertEquals(0, payment1.utilityAmount)
        assertEquals(0, payment2.utilityAmount)
    }
}
