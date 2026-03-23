package com.billim.domain.payment.application

import com.billim.domain.building.infra.BuildingRepository
import com.billim.domain.payment.domain.UtilityBill
import com.billim.domain.payment.infra.PaymentRepository
import com.billim.domain.payment.infra.UtilityBillRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UtilityService(
    private val buildingRepository: BuildingRepository,
    private val paymentRepository: PaymentRepository,
    private val utilityBillRepository: UtilityBillRepository
) {
    fun splitUtilityBill(email: String, buildingId: Long, year: Int, month: Int, type: String, totalAmount: Long) {
        val building = buildingRepository.findById(buildingId)
            .orElseThrow { IllegalArgumentException("Building not found") }
            
        if (building.user.email != email) {
            throw IllegalArgumentException("Unauthorized to access this building")
        }

        val payments = paymentRepository.findByBuildingAndYearMonth(buildingId, year, month)
        if (payments.isEmpty()) {
            throw IllegalArgumentException("해당 월에 배분할 청구 내역(활성 계약)이 없습니다.")
        }

        val roomCount = payments.size
        val perRoomAmount = totalAmount / roomCount
        val remainder = totalAmount % roomCount

        val utilityBill = UtilityBill(
            building = building,
            billingYear = year,
            billingMonth = month,
            type = type,
            totalAmount = totalAmount,
            roomCount = roomCount,
            perRoomAmount = perRoomAmount
        )
        utilityBillRepository.save(utilityBill)

        // 배분 적용 (첫 번째 결제건에 남은 자투리 금액 부여 처리)
        payments.forEachIndexed { index, payment ->
            val charge = if (index == 0) perRoomAmount + remainder else perRoomAmount
            payment.addUtilityCharge(charge)
            paymentRepository.save(payment)
        }
    }
}
