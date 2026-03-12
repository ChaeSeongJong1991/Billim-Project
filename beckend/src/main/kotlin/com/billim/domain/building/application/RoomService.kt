package com.billim.domain.building.application

import com.billim.domain.building.api.dto.RoomCreateRequest
import com.billim.domain.building.api.dto.RoomResponse
import com.billim.domain.building.api.dto.RoomStatusUpdateRequest
import com.billim.domain.building.api.dto.RoomUpdateRequest
import com.billim.domain.building.domain.Room
import com.billim.domain.building.infra.BuildingRepository
import com.billim.domain.building.infra.RoomRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class RoomService(
    private val roomRepository: RoomRepository,
    private val buildingRepository: BuildingRepository
) {

    @Transactional
    fun create(email: String, buildingId: Long, request: RoomCreateRequest): Long {
        val building = buildingRepository.findById(buildingId)
            .orElseThrow { IllegalArgumentException("건물을 찾을 수 없습니다.") }

        if (building.user.email != email) {
            throw IllegalStateException("본인의 건물에만 호실을 추가할 수 있습니다.")
        }

        if (roomRepository.existsByBuildingIdAndRoomNumber(buildingId, request.roomNumber)) {
            throw IllegalArgumentException("이미 존재하는 호수입니다: ${request.roomNumber}")
        }

        val room = Room(
            building = building,
            roomNumber = request.roomNumber,
            managementNumber = request.managementNumber,
            propertyType = request.propertyType,
            floor = request.floor
        )

        return roomRepository.save(room).id!!
    }

    fun getRoomsByBuilding(email: String, buildingId: Long): List<RoomResponse> {
        val building = buildingRepository.findById(buildingId)
            .orElseThrow { IllegalArgumentException("건물을 찾을 수 없습니다.") }

        if (building.user.email != email) {
            throw IllegalStateException("본인의 건물만 조회할 수 있습니다.")
        }

        return roomRepository.findAllByBuildingId(buildingId).map { it.toResponse() }
    }

    @Transactional
    fun update(email: String, buildingId: Long, roomId: Long, request: RoomUpdateRequest) {
        val room = getVerifiedRoom(email, buildingId, roomId)

        if (room.roomNumber != request.roomNumber &&
            roomRepository.existsByBuildingIdAndRoomNumber(buildingId, request.roomNumber)
        ) {
            throw IllegalArgumentException("이미 존재하는 호수입니다: ${request.roomNumber}")
        }

        room.update(request.roomNumber, request.managementNumber, request.propertyType, request.floor)
    }

    @Transactional
    fun updateStatus(email: String, buildingId: Long, roomId: Long, request: RoomStatusUpdateRequest) {
        val room = getVerifiedRoom(email, buildingId, roomId)
        room.updateStatus(request.status)
    }

    @Transactional
    fun delete(email: String, buildingId: Long, roomId: Long) {
        val room = getVerifiedRoom(email, buildingId, roomId)
        roomRepository.delete(room)
    }

    private fun getVerifiedRoom(email: String, buildingId: Long, roomId: Long): Room {
        val building = buildingRepository.findById(buildingId)
            .orElseThrow { IllegalArgumentException("건물을 찾을 수 없습니다.") }

        if (building.user.email != email) {
            throw IllegalStateException("본인의 건물만 수정할 수 있습니다.")
        }

        val room = roomRepository.findById(roomId)
            .orElseThrow { IllegalArgumentException("호실을 찾을 수 없습니다.") }

        if (room.building.id != buildingId) {
            throw IllegalStateException("해당 건물의 호실이 아닙니다.")
        }

        return room
    }

    private fun Room.toResponse() = RoomResponse(
        id = this.id!!,
        roomNumber = this.roomNumber,
        managementNumber = this.managementNumber,
        propertyType = this.propertyType,
        floor = this.floor,
        status = this.status,
        buildingId = this.building.id!!,
        buildingName = this.building.name
    )
}
