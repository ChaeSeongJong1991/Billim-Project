package com.billim.domain.building.infra

import com.billim.domain.building.domain.Room
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface RoomRepository : JpaRepository<Room, Long> {
    fun findAllByBuildingId(buildingId: Long): List<Room>
    fun existsByBuildingIdAndRoomNumber(buildingId: Long, roomNumber: String): Boolean
    fun findByBuildingIdAndRoomNumber(buildingId: Long, roomNumber: String): Room?
    fun countByBuildingIdIn(buildingIds: List<Long>): Long
    fun countByBuildingIdInAndStatus(buildingIds: List<Long>, status: com.billim.domain.building.domain.RoomStatus): Long

    // 대시보드용: 총 호실 수 + 입주 호실 수를 단일 쿼리로 조회
    @Query("""
        SELECT COUNT(r), COUNT(CASE WHEN r.status = 'OCCUPIED' THEN 1 END)
        FROM Room r
        WHERE r.building.id IN :buildingIds
    """)
    fun countTotalAndOccupiedByBuildingIdIn(buildingIds: List<Long>): Array<Long>
}
