package com.billim.domain.contract.domain

import com.billim.domain.building.domain.Building
import com.billim.global.common.BaseEntity
import jakarta.persistence.*
import java.time.LocalDate

/*
 * Contract 갱신 상태 머신:
 *
 *   ACTIVE ──[갱신]──→ RENEWED  (새 Contract 생성, parentContractId = this.id)
 *   ACTIVE ──[만료]──→ EXPIRED  (endDate 경과)
 *   ACTIVE ──[해지]──→ TERMINATED
 *
 *   갱신 체인: Contract(id=1) ←─ parentContractId ─── Contract(id=2) ←─ Contract(id=3) ...
 */

@Entity
@Table(
    name = "contracts",
    uniqueConstraints = [UniqueConstraint(name = "uq_parent_contract_id", columnNames = ["parent_contract_id"])]
)
class Contract(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    val building: Building,

    @Column(nullable = false)
    val roomNumber: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var contractType: ContractType,

    @Column(nullable = false)
    var tenantName: String,

    @Column(nullable = false)
    var tenantPhone: String,

    @Column(nullable = false)
    var deposit: Long,

    @Column(nullable = false)
    var monthlyRent: Long,

    @Column(nullable = false)
    var maintenanceFee: Long = 0,

    @Column(nullable = false)
    var rentDay: Int,

    @Column(nullable = false)
    var startDate: LocalDate,

    @Column(nullable = false)
    var endDate: LocalDate,

    @Column(nullable = false)
    var householdCount: Int = 1,

    @Column(length = 500)
    var memo: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var renewalStatus: RenewalStatus = RenewalStatus.ACTIVE,

    @Column(nullable = true)
    var parentContractId: Long? = null

) : BaseEntity() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null

    init {
        require(endDate.isAfter(startDate)) { "계약 종료일은 시작일보다 뒤여야 합니다." }
        require(rentDay in 1..31) { "월세 납부일은 1일에서 31일 사이여야 합니다." }
    }

    fun markAsRenewed() {
        this.renewalStatus = RenewalStatus.RENEWED
    }

    fun terminate() {
        this.renewalStatus = RenewalStatus.TERMINATED
    }

    fun update(
        contractType: ContractType,
        tenantName: String,
        tenantPhone: String,
        deposit: Long,
        monthlyRent: Long,
        maintenanceFee: Long,
        rentDay: Int,
        startDate: LocalDate,
        endDate: LocalDate,
        householdCount: Int,
        memo: String?
    ) {
        require(endDate.isAfter(startDate)) { "계약 종료일은 시작일보다 뒤여야 합니다." }
        this.contractType = contractType
        this.tenantName = tenantName
        this.tenantPhone = tenantPhone
        this.deposit = deposit
        this.monthlyRent = monthlyRent
        this.maintenanceFee = maintenanceFee
        this.rentDay = rentDay
        this.startDate = startDate
        this.endDate = endDate
        this.householdCount = householdCount
        this.memo = memo
    }
}
