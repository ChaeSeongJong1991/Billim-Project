package com.billim.domain.payment.domain

import com.billim.domain.contract.domain.Contract
import com.billim.global.common.BaseEntity
import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(
    name = "payments",
    indexes = [Index(name = "idx_contract_id", columnList = "contract_id")],
    uniqueConstraints = [UniqueConstraint(columnNames = ["contract_id", "billing_year", "billing_month"])]
)
class Payment(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    val contract: Contract,

    @Column(name = "billing_year", nullable = false)
    val billingYear: Int,

    @Column(name = "billing_month", nullable = false)
    val billingMonth: Int,

    @Column(name = "billed_amount", nullable = false)
    val billedAmount: Long, // 청구액 (계약 시점의 monthlyRent)

    @Column(name = "paid_amount", nullable = false)
    var paidAmount: Long = 0,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: PaymentStatus = PaymentStatus.UNPAID,

    @Column(name = "payment_date")
    var paymentDate: LocalDate? = null,

    @Column(name = "payment_method")
    var paymentMethod: String? = null,

    @Column(columnDefinition = "TEXT")
    var memo: String? = null,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
) : BaseEntity() {

    fun collect(paidAmount: Long, paymentMethod: String?, memo: String?) {
        this.paidAmount = paidAmount
        this.paymentDate = LocalDate.now()
        this.paymentMethod = paymentMethod
        this.memo = memo
        this.status = when {
            paidAmount >= this.billedAmount -> PaymentStatus.PAID
            paidAmount > 0 -> PaymentStatus.PARTIAL
            else -> PaymentStatus.UNPAID
        }
    }
}

enum class PaymentStatus {
    UNPAID, PARTIAL, PAID
}
