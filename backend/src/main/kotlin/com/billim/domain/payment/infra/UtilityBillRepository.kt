package com.billim.domain.payment.infra

import com.billim.domain.payment.domain.UtilityBill
import org.springframework.data.jpa.repository.JpaRepository

interface UtilityBillRepository : JpaRepository<UtilityBill, Long> {
}
