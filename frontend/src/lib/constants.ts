export const WORK_ORDER_STATUS = {
  pending: '대기',
  in_progress: '진행 중',
  completed: '완료',
} as const

export const WORK_ORDER_PRIORITY = {
  low: '낮음',
  normal: '보통',
  high: '높음',
  urgent: '긴급',
} as const

export const WORK_ORDER_CATEGORY = {
  plumbing: '배관',
  electrical: '전기',
  cleaning: '청소',
  pest: '해충',
  structural: '구조',
  other: '기타',
} as const

export const VENDOR_STATUS = {
  active: '활성',
  inactive: '비활성',
  suspended: '일시중지',
} as const

export const MAINTENANCE_CATEGORY = {
  plumbing: '배관',
  electrical: '전기',
  cooling: '냉난방',
  safety: '안전',
  structural: '구조',
} as const

export const USER_ROLE = {
  admin: '관리자',
  tenant: '임차인',
  vendor: '협력업체',
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

export const API_ENDPOINTS = {
  WORK_ORDERS: '/api/work-orders',
  VENDORS: '/api/vendors',
  TENANTS: '/api/tenants',
  MAINTENANCE_GUIDES: '/api/maintenance-guides',
  AUTH: '/api/auth',
} as const
