package com.billim.domain.contract.application

import com.billim.domain.building.domain.Building
import com.billim.domain.building.domain.BuildingType
import com.billim.domain.building.domain.Room
import com.billim.domain.building.domain.RoomStatus
import com.billim.domain.building.domain.PropertyType
import com.billim.domain.building.infra.BuildingRepository
import com.billim.domain.building.infra.RoomRepository
import com.billim.domain.contract.api.dto.ContractRenewRequest
import com.billim.domain.contract.api.dto.RenewType
import com.billim.domain.contract.domain.Contract
import com.billim.domain.contract.domain.ContractType
import com.billim.domain.contract.domain.RenewalStatus
import com.billim.domain.contract.infra.ContractRepository
import com.billim.domain.user.domain.User
import com.billim.domain.user.infra.UserRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.Mockito.mock
import org.mockito.Mockito.verify
import org.mockito.junit.jupiter.MockitoExtension
import java.time.LocalDate
import java.util.Optional

@ExtendWith(MockitoExtension::class)
class ContractServiceTest {

    @Mock
    lateinit var contractRepository: ContractRepository

    @Mock
    lateinit var buildingRepository: BuildingRepository

    @Mock
    lateinit var roomRepository: RoomRepository

    @Mock
    lateinit var userRepository: UserRepository

    @InjectMocks
    lateinit var contractService: ContractService

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

    private fun createContract(
        building: Building,
        renewalStatus: RenewalStatus = RenewalStatus.ACTIVE,
        id: Long = 1L
    ): Contract {
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
            householdCount = 1,
            renewalStatus = renewalStatus
        )
        val idField = Contract::class.java.getDeclaredField("id")
        idField.isAccessible = true
        idField.set(contract, id)
        return contract
    }

    @Test
    fun `renew should create new contract and mark old as RENEWED`() {
        // Given
        val user = createUser()
        val building = createBuilding(user)
        val oldContract = createContract(building, RenewalStatus.ACTIVE, 1L)
        val request = ContractRenewRequest(
            renewType = RenewType.KEEP,
            newEndDate = LocalDate.of(2028, 12, 31)
        )

        `when`(userRepository.findByEmail(email)).thenReturn(user)
        `when`(contractRepository.findByIdWithLock(1L)).thenReturn(oldContract)

        val savedContract = createContract(building, RenewalStatus.ACTIVE, 2L)
        `when`(contractRepository.save(org.mockito.kotlin.any())).thenReturn(savedContract)

        // When
        val newContractId = contractService.renew(email, 1L, request)

        // Then
        assertEquals(2L, newContractId)
        assertEquals(RenewalStatus.RENEWED, oldContract.renewalStatus)
        verify(contractRepository).save(org.mockito.kotlin.any())
    }

    @Test
    fun `renew should throw when contract already renewed`() {
        // Given
        val user = createUser()
        val building = createBuilding(user)
        val oldContract = createContract(building, RenewalStatus.RENEWED, 1L)
        val request = ContractRenewRequest(
            renewType = RenewType.KEEP,
            newEndDate = LocalDate.of(2028, 12, 31)
        )

        `when`(userRepository.findByEmail(email)).thenReturn(user)
        `when`(contractRepository.findByIdWithLock(1L)).thenReturn(oldContract)

        // When & Then
        val exception = assertThrows(IllegalStateException::class.java) {
            contractService.renew(email, 1L, request)
        }
        assertEquals("이미 갱신된 계약입니다. 최신 계약을 갱신해주세요.", exception.message)
    }

    @Test
    fun `renew should throw when contract expired`() {
        // Given
        val user = createUser()
        val building = createBuilding(user)
        val oldContract = createContract(building, RenewalStatus.EXPIRED, 1L)
        val request = ContractRenewRequest(
            renewType = RenewType.KEEP,
            newEndDate = LocalDate.of(2028, 12, 31)
        )

        `when`(userRepository.findByEmail(email)).thenReturn(user)
        `when`(contractRepository.findByIdWithLock(1L)).thenReturn(oldContract)

        // When & Then
        val exception = assertThrows(IllegalStateException::class.java) {
            contractService.renew(email, 1L, request)
        }
        assertEquals("만료된 계약은 갱신할 수 없습니다.", exception.message)
    }

    @Test
    fun `terminate should mark contract as TERMINATED and room as VACANT`() {
        // Given
        val user = createUser()
        val building = createBuilding(user)
        val contract = createContract(building, RenewalStatus.ACTIVE, 1L)
        val room = Room(
            building = building,
            roomNumber = "101",
            propertyType = PropertyType.ONE_ROOM,
            floor = 1,
            status = RoomStatus.OCCUPIED
        )

        `when`(userRepository.findByEmail(email)).thenReturn(user)
        `when`(contractRepository.findByIdWithLock(1L)).thenReturn(contract)
        `when`(roomRepository.findByBuildingIdAndRoomNumber(1L, "101")).thenReturn(room)

        // When
        contractService.terminate(email, 1L)

        // Then
        assertEquals(RenewalStatus.TERMINATED, contract.renewalStatus)
        assertEquals(RoomStatus.VACANT, room.status)
    }
}
