package com.billim.domain.building.api.dto

import com.billim.domain.building.domain.BuildingType
import jakarta.validation.constraints.NotBlank

data class BuildingCreateRequest(
    @field:NotBlank(message = "건물 이름은 필수입니다.")
    val name: String,

    @field:NotBlank(message = "주소는 필수입니다.")
    val address: String,

    val type: BuildingType = BuildingType.VILLA // 기본값 설정
)

data class BuildingUpdateRequest(
    @field:NotBlank(message = "건물 이름은 필수입니다.")
    val name: String,

    @field:NotBlank(message = "주소는 필수입니다.")
    val address: String,

    val type: BuildingType
)

data class BuildingResponse(
    val id: Long,
    val name: String,
    val address: String,
    val type: BuildingType
)
