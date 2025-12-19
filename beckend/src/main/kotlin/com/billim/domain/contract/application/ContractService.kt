package com.billim.domain.contract.application

import com.billim.domain.building.infra.BuildingRepository
import com.billim.domain.contract.api.dto.ContractCreateRequest
import com.billim.domain.contract.api.dto.ContractResponse
import com.billim.domain.contract.domain.Contract
import com.billim.domain.contract.infra.ContractRepository
import com.billim.domain.user.infra.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class ContractService(
    private val contractRepository: ContractRepository,
    private val buildingRepository: BuildingRepository,
    private val userRepository: UserRepository
) {

    @Transactional
    fun create(email: String, request: ContractCreateRequest): Long {
        // 1. 사용자 조회
        val user = userRepository.findByEmail(email)
            ?: throw IllegalArgumentException("사용자를 찾을 수 없습니다.")

        // 2. 건물 조회
        val building = buildingRepository.findById(request.buildingId)
            .orElseThrow { IllegalArgumentException("건물을 찾을 수 없습니다.") }

        // 3. [보안 핵심] 본인 소유의 건물이 맞는지 검증
        if (building.user.id != user.id) {
            throw IllegalStateException("본인 소유의 건물에만 계약을 등록할 수 있습니다.")
        }

        // 4. 계약 생성
        val contract = Contract(
            building = building,
            roomNumber = request.roomNumber,
            tenantName = request.tenantName,
            tenantPhone = request.tenantPhone,
            deposit = request.deposit,
            monthlyRent = request.monthlyRent,
            rentDay = request.rentDay,
            startDate = request.startDate,
            endDate = request.endDate
        )

        return contractRepository.save(contract).id!!
    }

    // 특정 건물의 계약 목록 조회
    fun getContractsByBuilding(email: String, buildingId: Long): List<ContractResponse> {
        val user = userRepository.findByEmail(email)!!
        val building = buildingRepository.findById(buildingId)
            .orElseThrow { IllegalArgumentException("건물을 찾을 수 없습니다.") }

        // 소유주 확인
        if (building.user.id != user.id) {
            throw IllegalStateException("본인 소유 건물의 계약만 조회할 수 있습니다.")
        }

        return contractRepository.findAllByBuildingId(buildingId)
            .map {
                ContractResponse(
                    id = it.id!!,
                    buildingName = it.building.name,
                    roomNumber = it.roomNumber,
                    tenantName = it.tenantName,
                    monthlyRent = it.monthlyRent,
                    rentDay = it.rentDay,
                    startDate = it.startDate,
                    endDate = it.endDate
                )
            }
    }
}
