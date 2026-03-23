package com.billim.domain.workorder.domain

/**
 * WorkOrder 우선순위 enum
 * HIGH: 높음 (긴급 수리)
 * MEDIUM: 중간 (일반적인 수리)
 * LOW: 낮음 (예방정비, 낮은 우선순위)
 */
enum class Priority {
    HIGH,
    MEDIUM,
    LOW
}
