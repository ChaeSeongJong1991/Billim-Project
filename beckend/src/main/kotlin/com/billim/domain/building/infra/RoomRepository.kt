package com.billim.domain.building.infra

import com.billim.domain.building.domain.Room
import org.springframework.data.jpa.repository.JpaRepository

interface RoomRepository : JpaRepository<Room, Long> {
    fun findAllByBuildingId(buildingId: Long): List<Room>
    fun existsByBuildingIdAndRoomNumber(buildingId: Long, roomNumber: String): Boolean
}
