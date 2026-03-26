package com.billim.domain.dashboard.application

import com.billim.domain.building.infra.BuildingRepository
import com.billim.domain.building.infra.RoomRepository
import com.billim.domain.contract.domain.RenewalStatus
import com.billim.domain.contract.infra.ContractRepository
import com.billim.domain.dashboard.api.dto.LandlordDashboardResponse
import com.billim.domain.payment.infra.PaymentRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
@Transactional(readOnly = true)
class LandlordDashboardService(
    private val buildingRepository: BuildingRepository,
    private val roomRepository: RoomRepository,
    private val contractRepository: ContractRepository,
    private val paymentRepository: PaymentRepository
) {

    fun getDashboard(email: String): LandlordDashboardResponse {
        val buildingIds = buildingRepository.findAllByUserEmail(email).map { it.id!! }

        if (buildingIds.isEmpty()) {
            return LandlordDashboardResponse(
                expiringContractCount = 0,
                totalRooms = 0,
                occupiedRooms = 0,
                occupancyRate = 0,
                unpaidCount = 0,
                unpaidAmount = 0
            )
        }

        val today = LocalDate.now()
        val limitDate = today.plusDays(30)

        val roomCounts = roomRepository.countTotalAndOccupiedByBuildingIdIn(buildingIds)
        val totalRooms = roomCounts[0]
        val occupiedRooms = roomCounts[1]
        val occupancyRate = if (totalRooms > 0) ((occupiedRooms.toDouble() / totalRooms) * 100).toInt() else 0

        val expiringContractCount = contractRepository.countExpiringByUserEmail(
            email, today, limitDate, RenewalStatus.ACTIVE
        )

        val unpaidCounts = paymentRepository.countAndSumUnpaidByUserEmail(email)
        val unpaidCount = unpaidCounts[0]
        val unpaidAmount = unpaidCounts[1]

        return LandlordDashboardResponse(
            expiringContractCount = expiringContractCount,
            totalRooms = totalRooms,
            occupiedRooms = occupiedRooms,
            occupancyRate = occupancyRate,
            unpaidCount = unpaidCount,
            unpaidAmount = unpaidAmount
        )
    }

    fun getCalendarData(email: String, year: Int, month: Int): com.billim.domain.dashboard.api.dto.DashboardCalendarResponse {
        val payments = paymentRepository.findByUserEmailAndYearMonth(email, year, month)
        val today = LocalDate.now()
        val yearMonth = java.time.YearMonth.of(year, month)

        val dailyStatuses = payments.groupBy { payment ->
            val rentDay = kotlin.math.min(payment.contract.rentDay, yearMonth.lengthOfMonth())
            LocalDate.of(year, month, rentDay)
        }.map { (date, dailyPayments) ->
            val expectedAmount = dailyPayments.sumOf { it.billedAmount }
            val paidAmount = dailyPayments.sumOf { it.paidAmount }
            
            val status = when {
                paidAmount >= expectedAmount -> "PAID"
                date.isBefore(today) -> "OVERDUE"
                else -> "WAITING"
            }
            
            com.billim.domain.dashboard.api.dto.DailyPaymentStatus(
                date = date,
                expectedAmount = expectedAmount,
                paidAmount = paidAmount,
                status = status
            )
        }.sortedBy { it.date }

        return com.billim.domain.dashboard.api.dto.DashboardCalendarResponse(
            year = year,
            month = month,
            dailyStatuses = dailyStatuses
        )
    }
}
