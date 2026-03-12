package com.billim.domain.building.api.dto

import com.billim.domain.building.domain.PropertyType
import com.billim.domain.building.domain.RoomStatus
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class RoomCreateRequest(
    @field:NotBlank(message = "호수는 필수입니다.")
    val roomNumber: String,

    val managementNumber: String? = null,

    @field:NotNull(message = "부동산 유형은 필수입니다.")
    val propertyType: PropertyType,

    @field:Min(value = 1, message = "층수는 1 이상이어야 합니다.")
    val floor: Int
)

data class RoomUpdateRequest(
    @field:NotBlank(message = "호수는 필수입니다.")
    val roomNumber: String,

    val managementNumber: String? = null,

    @field:NotNull(message = "부동산 유형은 필수입니다.")
    val propertyType: PropertyType,

    @field:Min(value = 1, message = "층수는 1 이상이어야 합니다.")
    val floor: Int
)

data class RoomStatusUpdateRequest(
    @field:NotNull(message = "상태값은 필수입니다.")
    val status: RoomStatus
)

data class RoomResponse(
    val id: Long,
    val roomNumber: String,
    val managementNumber: String?,
    val propertyType: PropertyType,
    val floor: Int,
    val status: RoomStatus,
    val buildingId: Long,
    val buildingName: String
)
