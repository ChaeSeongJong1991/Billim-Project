package com.billim.domain.contract.application

import com.billim.domain.building.domain.RoomStatus
import com.billim.domain.building.infra.BuildingRepository
import com.billim.domain.building.infra.RoomRepository
import com.billim.domain.contract.api.dto.ContractCreateRequest
import com.billim.domain.contract.api.dto.ContractRenewRequest
import com.billim.domain.contract.api.dto.ContractResponse
import com.billim.domain.contract.api.dto.ContractUpdateRequest
import com.billim.domain.contract.api.dto.ExpiringContractResponse
import com.billim.domain.contract.api.dto.RenewType
import com.billim.domain.contract.domain.Contract
import com.billim.domain.contract.domain.RenewalStatus
import com.billim.domain.contract.infra.ContractRepository
import com.billim.domain.user.infra.UserRepository
import com.billim.global.exception.EntityNotFoundException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.temporal.ChronoUnit

@Service
@Transactional(readOnly = true)
class ContractService(
    private val contractRepository: ContractRepository,
    private val buildingRepository: BuildingRepository,
    private val roomRepository: RoomRepository,
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
        val saved = contractRepository.save(contract)

        roomRepository.findByBuildingIdAndRoomNumber(building.id!!, request.roomNumber)
            ?.updateStatus(RoomStatus.OCCUPIED)
            ?: logger.warn("호실을 찾을 수 없어 상태 변경 생략: buildingId={}, roomNumber={}", building.id, request.roomNumber)

        return saved.id!!
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

    fun getExpiringContracts(email: String, days: Long = 30): List<ExpiringContractResponse> {
        val user = userRepository.findByEmail(email)
            ?: throw IllegalArgumentException("사용자를 찾을 수 없습니다.")
        val today = LocalDate.now()
        val limitDate = today.plusDays(days)
        return contractRepository.findExpiringContracts(today, limitDate)
            .filter { it.building.user.id == user.id }
            .map { it.toExpiringResponse(today) }
    }

    @Transactional
    fun renew(email: String, contractId: Long, request: ContractRenewRequest): Long {
        val user = userRepository.findByEmail(email)
            ?: throw IllegalArgumentException("사용자를 찾을 수 없습니다.")
        val oldContract = contractRepository.findById(contractId)
            .orElseThrow { EntityNotFoundException(contractId, "계약을 찾을 수 없습니다.") }
        if (oldContract.building.user.id != user.id) {
            throw IllegalStateException("본인 소유 건물의 계약만 갱신할 수 있습니다.")
        }
        if (oldContract.renewalStatus == RenewalStatus.RENEWED) {
            throw IllegalStateException("이미 갱신된 계약입니다. 최신 계약을 갱신해주세요.")
        }
        if (oldContract.renewalStatus == RenewalStatus.EXPIRED) {
            throw IllegalStateException("만료된 계약은 갱신할 수 없습니다.")
        }
        if (oldContract.renewalStatus == RenewalStatus.TERMINATED) {
            throw IllegalStateException("해지된 계약은 갱신할 수 없습니다.")
        }

        val newStartDate = request.newStartDate ?: oldContract.endDate.plusDays(1)
        require(request.newEndDate.isAfter(newStartDate)) { "새 종료일은 시작일보다 뒤여야 합니다." }

        val newContract = Contract(
            building = oldContract.building,
            roomNumber = oldContract.roomNumber,
            contractType = oldContract.contractType,
            tenantName = oldContract.tenantName,
            tenantPhone = oldContract.tenantPhone,
            deposit = if (request.renewType == RenewType.MODIFY) request.deposit ?: oldContract.deposit else oldContract.deposit,
            monthlyRent = if (request.renewType == RenewType.MODIFY) request.monthlyRent ?: oldContract.monthlyRent else oldContract.monthlyRent,
            maintenanceFee = if (request.renewType == RenewType.MODIFY) request.maintenanceFee ?: oldContract.maintenanceFee else oldContract.maintenanceFee,
            rentDay = if (request.renewType == RenewType.MODIFY) request.rentDay ?: oldContract.rentDay else oldContract.rentDay,
            startDate = newStartDate,
            endDate = request.newEndDate,
            householdCount = oldContract.householdCount,
            memo = request.memo ?: oldContract.memo,
            renewalStatus = RenewalStatus.ACTIVE,
            parentContractId = oldContract.id
        )

        oldContract.markAsRenewed()
        val saved = contractRepository.save(newContract)
        logger.info("계약 갱신 완료: 기존 contractId={}, 신규 contractId={}", contractId, saved.id)
        return saved.id!!
    }

    @Transactional
    fun terminate(email: String, contractId: Long) {
        val user = userRepository.findByEmail(email)
            ?: throw IllegalArgumentException("사용자를 찾을 수 없습니다.")
        val contract = contractRepository.findById(contractId)
            .orElseThrow { EntityNotFoundException(contractId, "계약을 찾을 수 없습니다.") }
        if (contract.building.user.id != user.id) {
            throw IllegalStateException("본인 소유 건물의 계약만 종료할 수 있습니다.")
        }
        if (contract.renewalStatus == RenewalStatus.EXPIRED) {
            throw IllegalStateException("만료된 계약은 해지 처리할 수 없습니다.")
        }
        if (contract.renewalStatus == RenewalStatus.TERMINATED) {
            throw IllegalStateException("이미 종료된 계약입니다.")
        }
        contract.terminate()
        logger.info("계약 종료 처리: contractId={}", contractId)

        roomRepository.findByBuildingIdAndRoomNumber(contract.building.id!!, contract.roomNumber)
            ?.updateStatus(RoomStatus.VACANT)
            ?: logger.warn("호실을 찾을 수 없어 상태 변경 생략: buildingId={}, roomNumber={}", contract.building.id, contract.roomNumber)
    }

    private fun Contract.toResponse() = ContractResponse(
        id = this.id!!,
        buildingId = this.building.id!!,
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
        memo = this.memo,
        renewalStatus = this.renewalStatus,
        parentContractId = this.parentContractId
    )

    private fun Contract.toExpiringResponse(today: LocalDate) = ExpiringContractResponse(
        id = this.id!!,
        buildingId = this.building.id!!,
        buildingName = this.building.name,
        roomNumber = this.roomNumber,
        tenantName = this.tenantName,
        tenantPhone = this.tenantPhone,
        monthlyRent = this.monthlyRent,
        deposit = this.deposit,
        startDate = this.startDate,
        endDate = this.endDate,
        daysLeft = ChronoUnit.DAYS.between(today, this.endDate),
        contractType = this.contractType,
        renewalStatus = this.renewalStatus
    )
}
