# WorkOrder Domain Architecture

## 도메인 구조

```
backend/src/main/kotlin/com/billim/domain/workorder/
├── domain/                          # 도메인 로직
│   ├── WorkOrderEnums.kt           # 상태, 우선순위, 카테고리, 이벤트 타입
│   ├── WorkOrder.kt                # 민원 기본 정보
│   ├── WorkOrderImage.kt           # 첨부 사진
│   ├── WorkOrderTimeline.kt        # 상태 변경 이력
│   ├── WorkOrderCategory.kt        # 카테고리 마스터
│   ├── VendorAssignment.kt         # 업체 배정 기록
│   └── PreventiveMaintenanceGuide.kt # 예방 정비 가이드
├── infra/                          # Repository (데이터 접근)
│   ├── WorkOrderRepository.kt
│   ├── WorkOrderImageRepository.kt
│   ├── WorkOrderTimelineRepository.kt
│   ├── WorkOrderCategoryRepository.kt
│   ├── VendorAssignmentRepository.kt
│   └── PreventiveMaintenanceGuideRepository.kt
├── api/
│   └── dto/
│       └── WorkOrderDtos.kt        # Request/Response DTO
├── application/                    # Service 계획 (향후)
└── DOMAIN_DESIGN.md               # 상세 설계 문서
```

---

## Entity 계층도

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  BaseEntity                                           │
│  ├─ createdAt: LocalDateTime                         │
│  └─ updatedAt: LocalDateTime                         │
│                                                        │
└────────────────────────────────────────────────────────┘
         ▲
         │ (상속)
         │
    ┌────┴────────────────────────────────────────────┐
    │                                                  │
    │  WorkOrder (민원)                               │
    │  ├─ id: Long                                    │
    │  ├─ room: Room (FK)                             │
    │  ├─ tenant: Tenant (FK)                         │
    │  ├─ title: String                               │
    │  ├─ description: String                         │
    │  ├─ category: WorkOrderCategory (enum)          │
    │  ├─ status: WorkOrderStatus (enum)              │
    │  ├─ priority: WorkOrderPriority (enum)          │
    │  ├─ assignedVendor: User? (FK)                  │
    │  ├─ imageCount: Int                             │
    │  ├─ completedAt: LocalDateTime?                 │
    │  ├─ cancelledAt: LocalDateTime?                 │
    │  └─ cancelReason: String?                       │
    │                                                  │
    └────────────────┬─────────────────────────────────┘
                     │
         ┌───────────┼───────────────┬─────────────────┐
         │           │               │                 │
         │           │               │                 │
         ▼           ▼               ▼                 ▼
    ┌────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐
    │ Image  │  │Timeline  │  │ Vendor   │  │ (References)   │
    │        │  │          │  │ Assign   │  │                │
    │ (1:N)  │  │  (1:N)   │  │ (1:N)    │  │ - Room         │
    │        │  │          │  │          │  │ - Tenant       │
    └────────┘  └──────────┘  └──────────┘  │ - User         │
                                             └────────────────┘
```

---

## 데이터 흐름 (시나리오별)

### 1️⃣ 임차인 민원 접수

```
임차인이 앱에서 "새 민원 접수"
    ↓
WorkOrderCreateRequest 제출
    ├─ roomId
    ├─ title: "화장실 누수"
    ├─ description: "물이 계속..."
    ├─ category: LEAKAGE
    ├─ priority: HIGH
    └─ images: [url1, url2]
    ↓
WorkOrder 생성 (status = NEW)
    ↓
WorkOrderImage 생성 (N개, displayOrder로 정렬)
    ↓
WorkOrderTimeline.created() 기록
    └─ eventType: CREATED
    └─ actor: 임차인 User
    └─ actorType: TENANT
    ↓
✅ 임차인 대시보드에 "접수됨" 표시
```

### 2️⃣ 관리자 업체 배정

```
관리자가 민원 상세 페이지 열기
    ↓
"업체 배정" 클릭 → 추천 업체 목록 표시
    ├─ 한수도 수리소: 4.8점
    ├─ 배관 전문가: 4.6점
    └─ ...
    ↓
업체 선택 (User ID: vendor_id)
    ↓
WorkOrder.assignVendor(vendor)
    ├─ assignedVendor = vendor
    └─ status = IN_PROGRESS
    ↓
VendorAssignment 기록 생성
    ├─ assignedAt = NOW()
    ├─ unassignedAt = NULL (활성)
    └─ notes = "긴급 처리 부탁드립니다"
    ↓
WorkOrderTimeline.vendorAssigned() 기록
    ├─ eventType: VENDOR_ASSIGNED
    ├─ actor: 관리자 User
    ├─ actorType: ADMIN
    └─ metadata: {"vendor":"한수도 수리소"}
    ↓
✅ 임차인과 업체에 푸시 알림
```

### 3️⃣ 상태 변경 (진행중 → 완료)

```
업체가 작업 완료
    ↓
관리자가 상태 변경 버튼 클릭
    └─ NEW → IN_PROGRESS → COMPLETED
    ↓
WorkOrder.updateStatus(COMPLETED)
    ├─ status = COMPLETED
    ├─ completedAt = NOW()
    └─ (자동 계산)
    ↓
WorkOrderTimeline.statusChanged() 기록
    ├─ eventType: STATUS_CHANGED
    ├─ actor: 관리자 User
    ├─ metadata: {"old":"IN_PROGRESS","new":"COMPLETED"}
    ↓
✅ 타임라인에 "완료됨" 표시
```

### 4️⃣ 진행 현황 조회

```
임차인이 "내 민원들" 페이지 열기
    ↓
WorkOrderRepository.findByTenantIdOrderByCreatedAtDesc()
    └─ List<WorkOrder> 반환
    ↓
각 민원에 대해:
    ├─ WorkOrderTimeline 조회
    │  └─ findByWorkOrderIdOrderByCreatedAtDesc()
    │     └─ 모든 이벤트 시간순으로
    ├─ WorkOrderImage 조회
    │  └─ findByWorkOrderIdOrderByDisplayOrder()
    │     └─ 사진들 순서대로
    └─ VendorAssignment 조회
       └─ findCurrentAssignment()
          └─ 현재 배정 업체
    ↓
✅ 진행 상황 카드 표시 (상태, 업체, 사진, 타임라인)
```

### 5️⃣ 예방 정비 관리

```
예방 정비 가이드 추가
    ├─ title: "냉매 충전"
    ├─ category: APPLIANCE
    ├─ intervalMonths: 24
    └─ nextMaintenanceDate: 2026-03-15
    ↓
관리자 대시보드에서:
    ├─ findOverdueGuides()
    │  └─ nextMaintenanceDate <= TODAY
    │  └─ 빨강색 경고 표시
    └─ findDueWithinDays(7)
       └─ nextMaintenanceDate <= TODAY + 7일
       └─ 주황색 경고 표시
    ↓
"지금 시행 기록하기" 클릭
    ↓
recordMaintenance() 호출
    ├─ lastMaintenanceDate = TODAY
    ├─ nextMaintenanceDate = TODAY + 24개월 (자동 계산)
    └─ 호실 목록 업데이트
    ↓
✅ 다음 예정일 자동 계산, 경고 초기화
```

---

## 데이터베이스 스키마 (논리도)

```
┌─────────────────────────────────────────────────────────────────┐
│                        work_orders                              │
├─────────────────────────────────────────────────────────────────┤
│ id (PK)       │ room_id (FK)  │ tenant_id (FK)                   │
│ title         │ description   │ category (enum)                  │
│ status (enum) │ priority      │ assigned_vendor_id (FK, NULL)    │
│ image_count   │ completed_at  │ cancelled_at                     │
│ cancel_reason │ created_at    │ updated_at                       │
├─────────────────────────────────────────────────────────────────┤
│ INDEX: room_id, tenant_id, status, created_at                   │
│ FOREIGN KEY: rooms, tenants, users                              │
└─────────────────────────────────────────────────────────────────┘
            │
    ┌───────┴────────┬──────────────┬──────────────────┐
    │                │              │                  │
    ▼                ▼              ▼                  ▼
┌─────────────┐ ┌────────────┐ ┌────────────┐  ┌──────────────┐
│   Images    │ │ Timelines  │ │ Assignments│  │ References   │
├─────────────┤ ├────────────┤ ├────────────┤  ├──────────────┤
│ id          │ │ id         │ │ id         │  │ Room         │
│ work_order_ │ │ work_order_│ │ work_order_│  │ Tenant       │
│ id (FK)     │ │ id (FK)    │ │ id (FK)    │  │ User         │
│ image_url   │ │ event_type │ │ vendor_id  │  │              │
│ display_    │ │ actor_id   │ │ assigned_  │  │ ┌──────────┐ │
│ order       │ │ (FK)       │ │ at         │  │ │ Category │ │
│ created_at  │ │ description│ │ notes      │  │ │ ┌──────┐ │ │
│             │ │ metadata   │ │ created_at │  │ │ │Enum  │ │ │
│             │ │ created_at │ │            │  │ │ └──────┘ │ │
└─────────────┘ └────────────┘ └────────────┘  │ └──────────┘ │
                                               └──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│          preventive_maintenance_guides                          │
├─────────────────────────────────────────────────────────────────┤
│ id (PK)  │ title             │ category (enum)                   │
│ interval_│ last_maintenance_ │ next_maintenance_date             │
│ months   │ date              │ created_by_id (FK)                │
│ is_active│ created_at        │ updated_at                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Entity 관계 요약

| Entity | 관계 대상 | 종류 | 설명 |
|--------|---------|------|------|
| WorkOrder | Room | N:1 | 각 호실은 여러 민원을 가짐 |
| WorkOrder | Tenant | N:1 | 각 임차인은 여러 민원을 제출 |
| WorkOrder | User (Vendor) | N:1 | 여러 민원이 같은 업체에 배정될 수 있음 |
| WorkOrderImage | WorkOrder | N:1 | 각 민원은 최대 5개 사진 (Cascade Delete) |
| WorkOrderTimeline | WorkOrder | N:1 | 각 민원의 모든 변경 기록 (Cascade Delete) |
| WorkOrderTimeline | User | N:1 | 누가 변경했는지 추적 |
| VendorAssignment | WorkOrder | N:1 | 배정 이력 기록 (Cascade Delete) |
| VendorAssignment | User | N:1 | 어떤 업체에 배정됐는지 |
| PreventiveMaintenanceGuide | User | N:1 | 누가 가이드를 만들었는지 |

---

## 주요 쿼리 패턴

### 임차인 대시보드
```sql
-- 임차인의 최근 민원 조회
SELECT * FROM work_orders
WHERE tenant_id = ?
ORDER BY created_at DESC LIMIT 10;
```

### 관리자 대시보드
```sql
-- 상태별 민원 수
SELECT status, COUNT(*)
FROM work_orders
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY status;

-- 카테고리별 분포
SELECT category, COUNT(*)
FROM work_orders
GROUP BY category;
```

### 업체 목록
```sql
-- 업체의 진행중 민원
SELECT * FROM work_orders
WHERE assigned_vendor_id = ?
AND status = 'IN_PROGRESS';
```

### 예방 정비
```sql
-- 오버드 정비 항목
SELECT * FROM preventive_maintenance_guides
WHERE is_active = true
AND next_maintenance_date <= CURRENT_DATE
ORDER BY next_maintenance_date ASC;
```

---

## 설계 특징

### 1️⃣ Immutability
- 엔티티는 setter가 없음
- 상태 변경은 전용 메서드(`updateStatus()`, `assignVendor()` 등)를 통해서만 가능
- 변경 이력은 WorkOrderTimeline에 자동 기록

### 2️⃣ Event Sourcing 패턴
- WorkOrderTimeline은 모든 변경 기록
- "누가" "언제" "무엇을" 변경했는지 완전히 추적 가능
- UI의 타임라인 표시에 직접 사용

### 3️⃣ Cascade Delete
- WorkOrderImage, WorkOrderTimeline, VendorAssignment는 WorkOrder 삭제 시 자동 삭제
- 데이터 일관성 유지

### 4️⃣ Index 최적화
```
- idx_room_id, idx_tenant_id, idx_status: 단일 컬럼 조회
- idx_room_status, idx_tenant_created, idx_status_created: 복합 인덱스
- 자주 함께 조회되는 필드 조합으로 성능 최적화
```

### 5️⃣ Enum 활용
- WorkOrderStatus, WorkOrderPriority, WorkOrderCategory, WorkOrderTimelineEventType
- 값의 범위를 DB 레벨에서도 제약
- 타입 안정성 강화

---

## 마이그레이션 전략

**파일**: `backend/src/main/resources/db/migration/V004__Create_WorkOrder_Domain.sql`

1. 6개 테이블 순차 생성
2. Foreign Key 및 Index 정의
3. 기본 카테고리 5개 자동 삽입
4. 복합 인덱스로 성능 최적화

**Flyway를 통한 자동 적용** (Spring Boot 기동 시)

---

## 향후 확장 포인트

1. **WorkOrderComment**: 댓글/메모 기능
2. **WorkOrderRating**: 임차인의 업체 평가
3. **MaintenanceLog**: 예방 정비 실행 기록
4. **WorkOrderAttachment**: 파일 첨부 (사진 외)
5. **VendorSpecialty**: 업체 전문 분야 다대다

---

## 참고 문서

- `DOMAIN_DESIGN.md`: 상세한 설계 및 비즈니스 로직
- `/UI-PLAN.md`: UI/UX 기획서
- `WorkOrderDtos.kt`: Request/Response 구조
