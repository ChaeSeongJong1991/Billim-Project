package com.billim.domain.contract.domain

import com.billim.domain.building.domain.Building
import com.billim.global.common.BaseEntity
import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "contracts")
class Contract(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    val building: Building, // 어느 건물에 대한 계약인지

    @Column(nullable = false)
    val roomNumber: String, // 호수 (예: 201호)

    @Column(nullable = false)
    val tenantName: String, // 세입자 성함

    @Column(nullable = false)
    val tenantPhone: String, // 세입자 연락처

    @Column(nullable = false)
    val deposit: Long, // 보증금 (단위: 원)

    @Column(nullable = false)
    val monthlyRent: Long, // 월세 (단위: 원)

    @Column(nullable = false)
    val rentDay: Int, // 월세 납부일 (1~31)

    @Column(nullable = false)
    val startDate: LocalDate, // 계약 시작일

    @Column(nullable = false)
    val endDate: LocalDate  // 계약 종료일

) : BaseEntity() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null

    // 비즈니스 로직: 계약 기간 유효성 검증
    init {
        require(endDate.isAfter(startDate)) { "계약 종료일은 시작일보다 뒤여야 합니다." }
        require(rentDay in 1..31) { "월세 납부일은 1일에서 31일 사이여야 합니다." }
    }
}
