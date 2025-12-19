package com.billim.domain.building.api

import com.billim.domain.building.api.dto.BuildingCreateRequest
import com.billim.domain.building.api.dto.BuildingResponse
import com.billim.domain.building.api.dto.BuildingUpdateRequest
import com.billim.domain.building.application.BuildingService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/buildings")
class BuildingController(
    private val buildingService: BuildingService
) {

    @PostMapping
    fun create(
        @AuthenticationPrincipal userDetails: UserDetails,
        @Valid @RequestBody request: BuildingCreateRequest
    ): ResponseEntity<Long> {
        val buildingId = buildingService.create(userDetails.username, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(buildingId)
    }

    @GetMapping
    fun getMyBuildings(
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<List<BuildingResponse>> {
        val buildings = buildingService.getMyBuildings(userDetails.username)
        return ResponseEntity.ok(buildings)
    }

    @PutMapping("/{buildingId}")
    fun update(
        @PathVariable buildingId: Long,
        @AuthenticationPrincipal userDetails: UserDetails,
        @Valid @RequestBody request: BuildingUpdateRequest
    ): ResponseEntity<Unit> {
        buildingService.update(buildingId, userDetails.username, request)
        return ResponseEntity.ok().build()
    }

    @DeleteMapping("/{buildingId}")
    fun delete(
        @PathVariable buildingId: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Unit> {
        buildingService.delete(buildingId, userDetails.username)
        return ResponseEntity.noContent().build()
    }
}
