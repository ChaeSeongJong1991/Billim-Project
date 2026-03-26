package com.billim.domain.payment.application

import com.billim.domain.building.domain.Building
import com.billim.domain.building.domain.BuildingType
import com.billim.domain.building.infra.BuildingRepository
import com.billim.domain.contract.domain.Contract
import com.billim.domain.contract.domain.ContractType
import com.billim.domain.contract.infra.ContractRepository
import com.billim.domain.payment.api.dto.PaymentCollectRequest
import com.billim.domain.payment.api.dto.PaymentCreateRequest
import com.billim.domain.payment.domain.Payment
import com.billim.domain.payment.domain.PaymentStatus
import com.billim.domain.payment.infra.PaymentRepository
import com.billim.domain.user.domain.User
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.Optional

@ExtendWith(MockitoExtension::class)
class PaymentServiceTest {

    @Mock
    lateinit var paymentRepository: PaymentRepository

    @Mock
    lateinit var contractRepository: ContractRepository

    @Mock
    lateinit var buildingRepository: BuildingRepository

    @InjectMocks
    lateinit var paymentService: PaymentService

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

    private fun createContract(building: Building, id: Long = 1L): Contract {
        val contract = Contract(
            building = building,
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
        idField.set(contract, id)
        return contract
    }

    private fun createPayment(contract: Contract, id: Long = 1L, paidAmount: Long = 0, utilityAmount: Long = 0): Payment {
        val payment = Payment(
            contract = contract,
            billingYear = 2026,
            billingMonth = 3,
            billedAmount = 500_000,
            paidAmount = paidAmount,
            utilityAmount = utilityAmount
        )
        val idField = Payment::class.java.getDeclaredField("id")
        idField.isAccessible = true
        idField.set(payment, id)
        return payment
    }

    @Test
    fun `collect should change status from UNPAID to PAID when full amount`() {
        // Given
        val user = createUser()
        val building = createBuilding(user)
        val contract = createContract(building)
        val payment = createPayment(contract)

        `when`(paymentRepository.findById(1L)).thenReturn(Optional.of(payment))

        val request = PaymentCollectRequest(paidAmount = 500_000, paymentMethod = "TRANSFER")

        // When
        paymentService.collect(email, 1L, request)

        // Then
        assertEquals(PaymentStatus.PAID, payment.status)
        assertEquals(500_000, payment.paidAmount)
        assertNotNull(payment.paymentDate)
    }

    @Test
    fun `collect should change status to PARTIAL when partial amount`() {
        // Given
        val user = createUser()
        val building = createBuilding(user)
        val contract = createContract(building)
        val payment = createPayment(contract)

        `when`(paymentRepository.findById(1L)).thenReturn(Optional.of(payment))

        val request = PaymentCollectRequest(paidAmount = 300_000, paymentMethod = "CASH")

        // When
        paymentService.collect(email, 1L, request)

        // Then
        assertEquals(PaymentStatus.PARTIAL, payment.status)
        assertEquals(300_000, payment.paidAmount)
    }

    @Test
    fun `collect should recalculate status including utility amount`() {
        // Given: billedAmount=500_000, utilityAmount=100_000 -> total=600_000
        val user = createUser()
        val building = createBuilding(user)
        val contract = createContract(building)
        val payment = createPayment(contract, utilityAmount = 100_000)

        `when`(paymentRepository.findById(1L)).thenReturn(Optional.of(payment))

        // Paying 500_000 when total is 600_000 -> PARTIAL
        val request = PaymentCollectRequest(paidAmount = 500_000, paymentMethod = "TRANSFER")

        // When
        paymentService.collect(email, 1L, request)

        // Then
        assertEquals(PaymentStatus.PARTIAL, payment.status)
        assertEquals(500_000, payment.paidAmount)
    }

    @Test
    fun `createPayment should throw on duplicate billing period`() {
        // Given
        val user = createUser()
        val building = createBuilding(user)
        val contract = createContract(building)

        `when`(contractRepository.findById(1L)).thenReturn(Optional.of(contract))
        `when`(paymentRepository.existsByContractIdAndBillingYearAndBillingMonth(1L, 2026, 3))
            .thenReturn(true)

        val request = PaymentCreateRequest(contractId = 1L, billingYear = 2026, billingMonth = 3)

        // When & Then
        val exception = assertThrows(IllegalArgumentException::class.java) {
            paymentService.create(email, request)
        }
        assertTrue(exception.message!!.contains("이미 존재합니다"))
    }

    @Test
    fun `generateShareLink should create UUID token with 30-day expiry`() {
        // Given
        val user = createUser()
        val building = createBuilding(user)
        val contract = createContract(building)
        val payment = createPayment(contract)

        `when`(paymentRepository.findById(1L)).thenReturn(Optional.of(payment))

        // When
        val response = paymentService.generateShareLink(email, 1L, "https://billim.com")

        // Then
        assertNotNull(payment.shareToken)
        assertNotNull(payment.shareTokenExpiry)
        assertEquals(36, payment.shareToken!!.length) // UUID format
        assertTrue(payment.shareTokenExpiry!!.isAfter(LocalDateTime.now().plusDays(29)))
        assertTrue(payment.shareTokenExpiry!!.isBefore(LocalDateTime.now().plusDays(31)))
        assertTrue(response.shareUrl.startsWith("https://billim.com/invoice/"))
    }

    @Test
    fun `getPublicPayment should throw when token expired`() {
        // Given
        val user = createUser()
        val building = createBuilding(user)
        val contract = createContract(building)
        val payment = createPayment(contract)

        // Manually set an expired token
        payment.generateShareToken()
        val expiryField = Payment::class.java.getDeclaredField("shareTokenExpiry")
        expiryField.isAccessible = true
        expiryField.set(payment, LocalDateTime.now().minusDays(1))

        `when`(paymentRepository.findByShareToken(payment.shareToken!!)).thenReturn(payment)

        // When & Then
        val exception = assertThrows(IllegalArgumentException::class.java) {
            paymentService.getPublicPayment(payment.shareToken!!)
        }
        assertEquals("공유 링크가 만료되었습니다.", exception.message)
    }
}
