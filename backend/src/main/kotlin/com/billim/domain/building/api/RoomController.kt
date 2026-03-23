package com.billim.domain.building.api

import com.billim.domain.building.api.dto.RoomCreateRequest
import com.billim.domain.building.api.dto.RoomResponse
import com.billim.domain.building.api.dto.RoomStatusUpdateRequest
import com.billim.domain.building.api.dto.RoomUpdateRequest
import com.billim.domain.building.application.RoomService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/buildings/{buildingId}/rooms")
class RoomController(
    private val roomService: RoomService
) {

    @PostMapping
    fun create(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable buildingId: Long,
        @Valid @RequestBody request: RoomCreateRequest
    ): ResponseEntity<Long> {
        val roomId = roomService.create(userDetails.username, buildingId, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(roomId)
    }

    @GetMapping
    fun getRooms(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable buildingId: Long
    ): ResponseEntity<List<RoomResponse>> {
        val rooms = roomService.getRoomsByBuilding(userDetails.username, buildingId)
        return ResponseEntity.ok(rooms)
    }

    @PutMapping("/{roomId}")
    fun update(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable buildingId: Long,
        @PathVariable roomId: Long,
        @Valid @RequestBody request: RoomUpdateRequest
    ): ResponseEntity<Unit> {
        roomService.update(userDetails.username, buildingId, roomId, request)
        return ResponseEntity.ok().build()
    }

    @PatchMapping("/{roomId}/status")
    fun updateStatus(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable buildingId: Long,
        @PathVariable roomId: Long,
        @Valid @RequestBody request: RoomStatusUpdateRequest
    ): ResponseEntity<Unit> {
        roomService.updateStatus(userDetails.username, buildingId, roomId, request)
        return ResponseEntity.ok().build()
    }

    @DeleteMapping("/{roomId}")
    fun delete(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable buildingId: Long,
        @PathVariable roomId: Long
    ): ResponseEntity<Unit> {
        roomService.delete(userDetails.username, buildingId, roomId)
        return ResponseEntity.noContent().build()
    }
}
