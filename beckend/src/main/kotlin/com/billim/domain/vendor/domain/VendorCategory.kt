package com.billim.domain.vendor.domain

import com.billim.domain.workorder.domain.WorkOrderCategory
import com.billim.global.common.BaseEntity
import jakarta.persistence.*

@Entity
@Table(
    name = "vendor_categories",
    uniqueConstraints = [UniqueConstraint(columnNames = ["vendor_id", "category"])]
)
class VendorCategory(

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    val vendor: Vendor,

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 50)
    val category: WorkOrderCategory

) : BaseEntity() {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0
}
