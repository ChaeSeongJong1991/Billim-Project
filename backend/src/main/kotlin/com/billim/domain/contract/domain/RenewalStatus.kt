package com.billim.domain.contract.domain

enum class RenewalStatus {
    ACTIVE,      // 현재 활성 계약
    RENEWED,     // 갱신으로 대체됨 (새 계약이 생성됨)
    EXPIRED,     // 만료 후 종료
    TERMINATED   // 중도 해지
}
