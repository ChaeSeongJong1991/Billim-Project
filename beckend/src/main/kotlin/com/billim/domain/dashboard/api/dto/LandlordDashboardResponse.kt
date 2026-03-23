package com.billim.domain.dashboard.api.dto

data class LandlordDashboardResponse(
    val expiringContractCount: Long,
    val totalRooms: Long,
    val occupiedRooms: Long,
    val occupancyRate: Int,
    val unpaidCount: Long,
    val unpaidAmount: Long
)
