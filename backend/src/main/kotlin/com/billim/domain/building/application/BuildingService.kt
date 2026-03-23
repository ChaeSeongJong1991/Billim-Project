package com.billim.domain.building.application

import com.billim.domain.building.api.dto.BuildingCreateRequest
import com.billim.domain.building.api.dto.BuildingResponse
import com.billim.domain.building.api.dto.BuildingUpdateRequest
import com.billim.domain.building.domain.Building
import com.billim.domain.building.infra.BuildingRepository
import com.billim.domain.user.infra.UserRepository
import com.billim.global.exception.EntityNotFoundException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class BuildingService(
    private val buildingRepository: BuildingRepository,
    private val userRepository: UserRepository // User 조회를 위해 필요
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @Transactional
    fun create(email: String, request: BuildingCreateRequest): Long {
        logger.info("Creating building: {} at {}", request.name, request.address)
        // 1. 현재 로그인한 사용자 찾기 (없으면 에러)
        val user = userRepository.findByEmail(email)
            ?: throw IllegalArgumentException("사용자를 찾을 수 없습니다.")

        // 2. 건물 생성 및 연결
        val building = Building(
            name = request.name,
            address = request.address,
            type = request.type,
            user = user // 연관관계 설정
        )

        return buildingRepository.save(building).id!!
    }

    fun getMyBuildings(email: String): List<BuildingResponse> {
        return buildingRepository.findAllByUserEmail(email)
            .map { BuildingResponse(it.id!!, it.name, it.address, it.type) }
    }

    @Transactional
    fun update(buildingId: Long, email: String, request: BuildingUpdateRequest) {
        val building = buildingRepository.findById(buildingId)
            .orElseThrow { EntityNotFoundException(buildingId, "건물을 찾을 수 없습니다.") }

        if (building.user.email != email) {
            throw IllegalStateException("본인의 건물만 수정할 수 있습니다.")
        }

        building.update(request.name, request.address, request.type)
    }

    @Transactional
    fun delete(buildingId: Long, email: String) {
        val building = buildingRepository.findById(buildingId)
            .orElseThrow { EntityNotFoundException(buildingId, "건물을 찾을 수 없습니다.") }

        if (building.user.email != email) {
            throw IllegalStateException("본인의 건물만 삭제할 수 있습니다.")
        }

        buildingRepository.delete(building)
    }
}
