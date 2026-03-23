package com.billim.domain.contract.application

import com.billim.domain.building.infra.BuildingRepository
import com.billim.domain.contract.api.dto.ContractCreateRequest
import com.billim.domain.contract.api.dto.ContractResponse
import com.billim.domain.contract.api.dto.ContractUpdateRequest
import com.billim.domain.contract.domain.Contract
import com.billim.domain.contract.infra.ContractRepository
import com.billim.domain.user.infra.UserRepository
import com.billim.global.exception.EntityNotFoundException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class ContractService(
    private val contractRepository: ContractRepository,
    private val buildingRepository: BuildingRepository,
    private val userRepository: UserRepository
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @Transactional
    fun create(email: String, request: ContractCreateRequest): Long {
        logger.info("Creating contract for building: {}, room: {}", request.buildingId, request.roomNumber)
        val user = userRepository.findByEmail(email)
            ?: throw IllegalArgumentException("사용자를 찾을 수 없습니다.")
        val building = buildingRepository.findById(request.buildingId)
            .orElseThrow { EntityNotFoundException(request.buildingId, "건물을 찾을 수 없습니다.") }
        if (building.user.id != user.id) {
            throw IllegalStateException("본인 소유의 건물에만 계약을 등록할 수 있습니다.")
        }
        val contract = Contract(
            building = building,
            roomNumber = request.roomNumber,
            contractType = request.contractType,
            tenantName = request.tenantName,
            tenantPhone = request.tenantPhone,
            deposit = request.deposit,
            monthlyRent = request.monthlyRent,
            maintenanceFee = request.maintenanceFee,
            rentDay = request.rentDay,
            startDate = request.startDate,
            endDate = request.endDate,
            householdCount = request.householdCount,
            memo = request.memo
        )
        return contractRepository.save(contract).id!!
    }

    fun getContractsByBuilding(email: String, buildingId: Long): List<ContractResponse> {
        val user = userRepository.findByEmail(email)!!
        val building = buildingRepository.findById(buildingId)
            .orElseThrow { EntityNotFoundException(buildingId, "건물을 찾을 수 없습니다.") }
        if (building.user.id != user.id) {
            throw IllegalStateException("본인 소유 건물의 계약만 조회할 수 있습니다.")
        }
        return contractRepository.findAllByBuildingId(buildingId).map { it.toResponse() }
    }

    fun getContractByRoom(email: String, buildingId: Long, roomNumber: String): ContractResponse {
        val user = userRepository.findByEmail(email)!!
        val building = buildingRepository.findById(buildingId)
            .orElseThrow { EntityNotFoundException(buildingId, "건물을 찾을 수 없습니다.") }
        if (building.user.id != user.id) {
            throw IllegalStateException("본인 소유 건물의 계약만 조회할 수 있습니다.")
        }
        val contract = contractRepository.findAllByBuildingIdAndRoomNumber(buildingId, roomNumber)
            .maxByOrNull { it.startDate }
            ?: throw EntityNotFoundException(0, "해당 호실의 계약을 찾을 수 없습니다.")
        return contract.toResponse()
    }

    @Transactional
    fun update(email: String, contractId: Long, request: ContractUpdateRequest) {
        val user = userRepository.findByEmail(email)!!
        val contract = contractRepository.findById(contractId)
            .orElseThrow { EntityNotFoundException(contractId, "계약을 찾을 수 없습니다.") }
        if (contract.building.user.id != user.id) {
            throw IllegalStateException("본인 소유 건물의 계약만 수정할 수 있습니다.")
        }
        contract.update(
            contractType = request.contractType,
            tenantName = request.tenantName,
            tenantPhone = request.tenantPhone,
            deposit = request.deposit,
            monthlyRent = request.monthlyRent,
            maintenanceFee = request.maintenanceFee,
            rentDay = request.rentDay,
            startDate = request.startDate,
            endDate = request.endDate,
            householdCount = request.householdCount,
            memo = request.memo
        )
    }

    private fun Contract.toResponse() = ContractResponse(
        id = this.id!!,
        buildingName = this.building.name,
        roomNumber = this.roomNumber,
        contractType = this.contractType,
        tenantName = this.tenantName,
        tenantPhone = this.tenantPhone,
        deposit = this.deposit,
        monthlyRent = this.monthlyRent,
        maintenanceFee = this.maintenanceFee,
        rentDay = this.rentDay,
        startDate = this.startDate,
        endDate = this.endDate,
        householdCount = this.householdCount,
        memo = this.memo
    )
}
