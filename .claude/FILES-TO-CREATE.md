# Billim Frontend 구조 - 생성할 파일 목록

**작성일**: 2026-03-15
**총 파일 수**: 128개

---

## 페이지 파일 (17개)

### Tenant Pages (4개)
```
frontend/src/app/tenant/
├── layout.tsx                              # Tenant 레이아웃
├── dashboard/
│   └── page.tsx                            # 대시보드
└── work-orders/
    ├── page.tsx                            # 민원 목록
    ├── create/
    │   └── page.tsx                        # 민원 작성
    └── [id]/
        └── page.tsx                        # 민원 상세
```

### Admin Pages (7개)
```
frontend/src/app/admin/
├── layout.tsx                              # 관리자 레이아웃 (기존 확장)
├── dashboard/
│   └── page.tsx                            # 대시보드
└── maintenance/
    ├── workorders/
    │   ├── page.tsx                        # 보드 뷰
    │   └── [id]/
    │       └── page.tsx                    # 상세 뷰
    ├── contractors/
    │   ├── page.tsx                        # 목록
    │   └── [id]/
    │       └── page.tsx                    # 상세
    └── guides/
        ├── page.tsx                        # 목록
        └── create/
            └── page.tsx                    # 작성
```

### Vendor Pages (1개)
```
frontend/src/app/vendor/
├── layout.tsx                              # 협력업체 레이아웃
└── work-orders/
    └── page.tsx                            # 배정 민원
```

---

## 페이지별 컴포넌트 (54개)

### Tenant Components (8개)
```
frontend/src/app/tenant/work-orders/create/components/
├── WorkOrderForm.tsx
├── ImageUploadSection.tsx
└── FormActions.tsx

frontend/src/app/tenant/work-orders/[id]/components/
├── ProgressBar.tsx
├── BasicInfoCard.tsx
├── DescriptionCard.tsx
├── ContractorCard.tsx
├── TimelineLog.tsx
└── ActionButtons.tsx
```

### Admin Dashboard Components (4개)
```
frontend/src/app/admin/dashboard/components/
├── KPICard.tsx
├── CategoryChart.tsx
├── RecentWorkOrderTable.tsx
└── TopContractorStats.tsx
```

### Admin Work Orders (Board) Components (6개)
```
frontend/src/app/admin/maintenance/workorders/components/
├── WorkOrderBoard.tsx
├── WorkOrderColumn.tsx
├── WorkOrderCardDraggable.tsx
├── FilterBar.tsx
├── ViewToggle.tsx
└── BulkActions.tsx
```

### Admin Work Orders (Detail) Components (7개)
```
frontend/src/app/admin/maintenance/workorders/[id]/components/
├── WorkOrderInfoCard.tsx
├── ContractorAssignCard.tsx
├── RecommendedContractors.tsx
├── TimeMetrics.tsx
├── AttachmentSection.tsx
├── TimelineSection.tsx
└── AdminActions.tsx
```

### Admin Contractors List Components (4개)
```
frontend/src/app/admin/maintenance/contractors/components/
├── ContractorHeader.tsx
├── ContractorSearch.tsx
├── ContractorTable.tsx
└── Pagination.tsx
```

### Admin Contractors Detail Components (4개)
```
frontend/src/app/admin/maintenance/contractors/[id]/components/
├── ContractorForm.tsx
├── PerformanceStats.tsx
├── AssignedWorkOrders.tsx
└── DeleteButton.tsx
```

### Admin Guides List Components (4개)
```
frontend/src/app/admin/maintenance/guides/components/
├── GuideHeader.tsx
├── FilterBar.tsx
├── SortDropdown.tsx
└── MaintenanceGuideCard.tsx
```

### Admin Guides Create Components (4개)
```
frontend/src/app/admin/maintenance/guides/create/components/
├── GuideForm.tsx
├── DurationInput.tsx
├── RoomCheckbox.tsx
└── FormActions.tsx
```

### Vendor Components (4개)
```
frontend/src/app/vendor/work-orders/components/
├── ContractorWorkOrderCard.tsx
├── FilterBar.tsx
├── StatusChangeButton.tsx
└── [TBD - 1개]
```

---

## 공통 컴포넌트 (44개)

### UI 컴포넌트 (11개) - shadcn/ui
```
frontend/src/components/ui/
├── button.tsx                              # (기존)
├── input.tsx                               # (기존)
├── textarea.tsx
├── select.tsx
├── card.tsx                                # (기존)
├── badge.tsx                               # (기존)
├── dialog.tsx                              # (기존)
├── label.tsx                               # (기존)
├── checkbox.tsx
├── radio-group.tsx
├── separator.tsx                           # (기존)
└── types.ts                                # (기존)
```

### WorkOrder 컴포넌트 (6개)
```
frontend/src/components/workorder/
├── StatusBadge.tsx
├── PriorityBadge.tsx
├── WorkOrderCard.tsx
├── FilterBar.tsx
├── SortDropdown.tsx
└── Timeline.tsx
```

### Contractor 컴포넌트 (3개)
```
frontend/src/components/contractor/
├── ContractorInfoCard.tsx
├── RatingDisplay.tsx
└── ContractorBadge.tsx
```

### Dashboard 컴포넌트 (3개)
```
frontend/src/components/dashboard/
├── StatCard.tsx
├── Chart.tsx
└── EmptyState.tsx
```

### Form 컴포넌트 (6개)
```
frontend/src/components/form/
├── FormInput.tsx
├── FormSelect.tsx
├── FormTextArea.tsx
├── FormCheckbox.tsx
├── FormRadioGroup.tsx
└── FormError.tsx
```

### Upload 컴포넌트 (4개)
```
frontend/src/components/upload/
├── ImageUpload.tsx
├── ImagePreview.tsx
├── DragDropZone.tsx
└── FilePreview.tsx
```

### Layout 컴포넌트 (5개)
```
frontend/src/components/layout/
├── Header.tsx
├── Sidebar.tsx
├── Navigation.tsx
├── PageHeader.tsx
└── Container.tsx
```

### Common 컴포넌트 (6개)
```
frontend/src/components/common/
├── Loading.tsx
├── Skeleton.tsx
├── Toast.tsx
├── Modal.tsx
├── ConfirmDialog.tsx
└── EmptyState.tsx
```

### Landing 컴포넌트 (기존)
```
frontend/src/components/landing/
├── Navbar.tsx                              # (기존)
├── HeroSection.tsx                         # (기존)
├── UnitManagementSection.tsx               # (기존)
├── LedgerSection.tsx                       # (기존)
├── Footer.tsx                              # (기존)
└── MenuIcon.tsx                            # (기존)
```

---

## Custom Hooks (9개 총합)

### 기존 Hooks (4개)
```
frontend/src/hooks/
├── useBuildings.ts                         # (기존)
├── useRooms.ts                             # (기존)
├── useTenants.ts                           # (기존)
└── usePayments.ts                          # (기존)
```

### 신규 Hooks (5개)
```
frontend/src/hooks/
├── useWorkOrders.ts                        # 민원 데이터 페칭
├── useContractors.ts                       # 업체 데이터 페칭
├── useMaintenanceGuides.ts                 # 정비 가이드 데이터
├── useDragAndDrop.ts                       # 드래그 드롭 로직
└── useForm.ts                              # 폼 상태 관리
```

---

## 유틸리티 & 라이브러리 (5개)

### Lib 파일
```
frontend/src/lib/
├── axios.ts                                # (기존) Axios 인스턴스
├── firebase.ts                             # (기존) Firebase 초기화
├── utils.ts                                # (기존) 범용 유틸
├── date.ts                                 # 날짜 관련 함수
└── validation.ts                           # Zod 스키마
```

---

## 상태 관리 (1개)

```
frontend/src/store/
└── useAuthStore.ts                         # (기존) Zustand 스토어
```

---

## 요약 테이블

| 카테고리 | 신규 | 기존 | 합계 |
|---------|------|------|------|
| **페이지** | 12 | 5* | 17 |
| **페이지별 컴포넌트** | 54 | 0 | 54 |
| **공통 컴포넌트** | 33 | 11 | 44 |
| **Custom Hooks** | 5 | 4 | 9 |
| **Lib/Utils** | 2 | 3 | 5 |
| **상태 관리** | 0 | 1 | 1 |
| **합계** | **106** | **24** | **130** |

*기존 페이지: landing, login, buildings/[id], admin/dashboard (확장), admin 레이아웃

---

## 생성 우선순위

### Phase 1: Critical (1주)
**Status**: 필수 기반 작업

1. Form 컴포넌트 (6개)
2. Upload 컴포넌트 (4개)
3. Common 컴포넌트 (6개)
4. Badge/Status 컴포넌트 (2개)

**파일 수**: 18개

---

### Phase 2: Tenant (1.5주)
**Status**: 임차인 기능

1. `frontend/src/app/tenant/layout.tsx`
2. `frontend/src/app/tenant/dashboard/page.tsx`
3. `frontend/src/app/tenant/work-orders/page.tsx`
4. `frontend/src/app/tenant/work-orders/create/page.tsx` + 3 components
5. `frontend/src/app/tenant/work-orders/[id]/page.tsx` + 5 components
6. Hook: `useWorkOrders.ts`

**파일 수**: 12개

---

### Phase 3: Admin (2주)
**Status**: 관리자 기능

1. `frontend/src/app/admin/layout.tsx` (확장)
2. `frontend/src/app/admin/dashboard/page.tsx` + 4 components
3. `frontend/src/app/admin/maintenance/workorders/page.tsx` + 6 components
4. `frontend/src/app/admin/maintenance/workorders/[id]/page.tsx` + 7 components
5. `frontend/src/app/admin/maintenance/contractors/page.tsx` + 4 components
6. `frontend/src/app/admin/maintenance/contractors/[id]/page.tsx` + 4 components
7. `frontend/src/app/admin/maintenance/guides/page.tsx` + 4 components
8. `frontend/src/app/admin/maintenance/guides/create/page.tsx` + 4 components
9. Hooks: `useContractors.ts`, `useMaintenanceGuides.ts`

**파일 수**: 34개

---

### Phase 4: Vendor (1주)
**Status**: 협력업체 기능

1. `frontend/src/app/vendor/layout.tsx`
2. `frontend/src/app/vendor/work-orders/page.tsx` + 3 components
3. Hook: `useDragAndDrop.ts`, `useForm.ts`

**파일 수**: 6개

---

### Phase 5: Layout & Optimization (1주)
**Status**: 최적화

1. Layout 컴포넌트 (5개): Header, Sidebar, Navigation, PageHeader, Container
2. 추가 유틸: `date.ts`, `validation.ts`
3. 테스트 & 최적화

**파일 수**: 7개

---

## 체크리스트

### 페이지 파일
- [ ] Tenant layout.tsx
- [ ] Tenant dashboard/page.tsx
- [ ] Tenant work-orders/page.tsx
- [ ] Tenant work-orders/create/page.tsx
- [ ] Tenant work-orders/[id]/page.tsx
- [ ] Admin layout.tsx (확장)
- [ ] Admin dashboard/page.tsx
- [ ] Admin workorders/page.tsx
- [ ] Admin workorders/[id]/page.tsx
- [ ] Admin contractors/page.tsx
- [ ] Admin contractors/[id]/page.tsx
- [ ] Admin guides/page.tsx
- [ ] Admin guides/create/page.tsx
- [ ] Vendor layout.tsx
- [ ] Vendor work-orders/page.tsx

**소계**: 15개 페이지 파일

### 페이지별 컴포넌트
- [ ] Tenant: 8개
- [ ] Admin Dashboard: 4개
- [ ] Admin Board: 6개
- [ ] Admin Detail: 7개
- [ ] Admin Contractors: 8개
- [ ] Admin Guides: 8개
- [ ] Vendor: 4개

**소계**: 54개 페이지별 컴포넌트

### 공통 컴포넌트
- [ ] UI: 11개 (일부 기존)
- [ ] workorder: 6개
- [ ] contractor: 3개
- [ ] dashboard: 3개
- [ ] form: 6개
- [ ] upload: 4개
- [ ] layout: 5개
- [ ] common: 6개

**소계**: 44개 공통 컴포넌트

### Hooks & Utilities
- [ ] useWorkOrders.ts
- [ ] useContractors.ts
- [ ] useMaintenanceGuides.ts
- [ ] useDragAndDrop.ts
- [ ] useForm.ts
- [ ] date.ts
- [ ] validation.ts

**소계**: 7개 신규 파일

---

## 의존성 확인

### 필수 라이브러리
- `react@18+` - UI 라이브러리
- `next@16+` - 프레임워크
- `typescript` - 타입 안전성
- `tailwindcss@v4` - 스타일링
- `zustand` - 상태 관리
- `@tanstack/react-query` - 서버 상태
- `axios` - HTTP 클라이언트
- `zod` - 입력 검증
- `firebase-admin` - 푸시 알림
- `recharts` - 차트 (Admin Dashboard)

### 선택 라이브러리
- `@dnd-kit/core` - 드래그 앤 드롭 (Admin Board)
- `react-hot-toast` - 토스트 알림 (선택)
- `axios-mock-adapter` - 테스트 목킹 (선택)

---

## 완료 기준

- [ ] 모든 페이지 파일 생성 (17개)
- [ ] 모든 컴포넌트 파일 생성 (54개)
- [ ] 모든 공통 컴포넌트 생성 (44개)
- [ ] 모든 Custom Hooks 생성 (5개 신규)
- [ ] 모든 Hooks에 타입 정의
- [ ] 모든 Props에 TypeScript 인터페이스
- [ ] 접근성 검사 통과
- [ ] 반응형 레이아웃 테스트 완료
- [ ] 번들 크기 최적화 확인

---

**작성자**: Claude Code
**버전**: 1.0
**최종 업데이트**: 2026-03-15
**상태**: Ready for Implementation
