# Billim Frontend 페이지 및 컴포넌트 구조 설계

**작성일**: 2026-03-15
**기준**: UI-PLAN.md의 "2. 페이지 구조" 섹션
**기술**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui

---

## 📋 목차

1. [전체 폴더 구조](#전체-폴더-구조)
2. [페이지별 파일 목록](#페이지별-파일-목록)
3. [공통 컴포넌트 목록](#공통-컴포넌트-목록)
4. [페이지별 컴포넌트 계층](#페이지별-컴포넌트-계층)
5. [구현 순서 및 우선순위](#구현-순서-및-우선순위)
6. [검증 체크리스트](#검증-체크리스트)

---

## 전체 폴더 구조

```
frontend/src/
├── app/
│   ├── layout.tsx                          # 루트 레이아웃
│   ├── page.tsx                            # 랜딩 페이지
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── tenant/                             # 임차인 영역
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   └── work-orders/
│   │       ├── page.tsx                    # 목록
│   │       ├── create/
│   │       │   ├── page.tsx
│   │       │   └── components/
│   │       │       ├── WorkOrderForm.tsx
│   │       │       ├── ImageUploadSection.tsx
│   │       │       └── FormActions.tsx
│   │       │
│   │       └── [id]/
│   │           ├── page.tsx
│   │           └── components/
│   │               ├── ProgressBar.tsx
│   │               ├── BasicInfoCard.tsx
│   │               ├── DescriptionCard.tsx
│   │               ├── ImageGallery.tsx
│   │               ├── ContractorCard.tsx
│   │               ├── TimelineLog.tsx
│   │               └── ActionButtons.tsx
│   │
│   ├── admin/                              # 관리자 영역
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       ├── KPICard.tsx
│   │   │       ├── CategoryChart.tsx
│   │   │       ├── RecentWorkOrderTable.tsx
│   │   │       └── TopContractorStats.tsx
│   │   │
│   │   └── maintenance/
│   │       ├── workorders/
│   │       │   ├── page.tsx                # 보드 뷰
│   │       │   ├── components/
│   │       │   │   ├── WorkOrderBoard.tsx
│   │       │   │   ├── WorkOrderColumn.tsx
│   │       │   │   ├── WorkOrderCardDraggable.tsx
│   │       │   │   ├── FilterBar.tsx
│   │       │   │   ├── ViewToggle.tsx
│   │       │   │   └── BulkActions.tsx
│   │       │   │
│   │       │   └── [id]/
│   │       │       ├── page.tsx
│   │       │       └── components/
│   │       │           ├── WorkOrderInfoCard.tsx
│   │       │           ├── ContractorAssignCard.tsx
│   │       │           ├── RecommendedContractors.tsx
│   │       │           ├── TimeMetrics.tsx
│   │       │           ├── AttachmentSection.tsx
│   │       │           ├── TimelineSection.tsx
│   │       │           └── AdminActions.tsx
│   │       │
│   │       ├── contractors/
│   │       │   ├── page.tsx
│   │       │   ├── components/
│   │       │   │   ├── ContractorSearch.tsx
│   │       │   │   ├── ContractorTable.tsx
│   │       │   │   ├── Pagination.tsx
│   │       │   │   └── ContractorHeader.tsx
│   │       │   │
│   │       │   └── [id]/
│   │       │       ├── page.tsx
│   │       │       └── components/
│   │       │           ├── ContractorForm.tsx
│   │       │           ├── PerformanceStats.tsx
│   │       │           ├── AssignedWorkOrders.tsx
│   │       │           └── DeleteButton.tsx
│   │       │
│   │       └── guides/
│   │           ├── page.tsx
│   │           ├── create/
│   │           │   ├── page.tsx
│   │           │   └── components/
│   │           │       ├── GuideForm.tsx
│   │           │       ├── DurationInput.tsx
│   │           │       ├── RoomCheckbox.tsx
│   │           │       └── FormActions.tsx
│   │           │
│   │           └── components/
│   │               ├── GuideHeader.tsx
│   │               ├── FilterBar.tsx
│   │               ├── SortDropdown.tsx
│   │               └── MaintenanceGuideCard.tsx
│   │
│   └── vendor/                             # 협력 업체 영역
│       ├── layout.tsx
│       └── work-orders/
│           ├── page.tsx
│           └── components/
│               ├── ContractorWorkOrderCard.tsx
│               ├── FilterBar.tsx
│               └── StatusChangeButton.tsx
│
├── components/
│   ├── ui/                                 # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   └── types.ts
│   │
│   ├── workorder/                          # 민원 관련 공통 컴포넌트
│   │   ├── StatusBadge.tsx
│   │   ├── PriorityBadge.tsx
│   │   ├── WorkOrderCard.tsx
│   │   ├── FilterBar.tsx
│   │   ├── SortDropdown.tsx
│   │   └── Timeline.tsx
│   │
│   ├── contractor/                         # 업체 관련 공통 컴포넌트
│   │   ├── ContractorInfoCard.tsx
│   │   ├── RatingDisplay.tsx
│   │   └── ContractorBadge.tsx
│   │
│   ├── dashboard/                          # 대시보드 공통 컴포넌트
│   │   ├── StatCard.tsx
│   │   ├── Chart.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── form/                               # 폼 관련 공통 컴포넌트
│   │   ├── FormInput.tsx
│   │   ├── FormSelect.tsx
│   │   ├── FormTextArea.tsx
│   │   ├── FormCheckbox.tsx
│   │   ├── FormRadioGroup.tsx
│   │   └── FormError.tsx
│   │
│   ├── upload/                             # 파일 업로드 관련
│   │   ├── ImageUpload.tsx
│   │   ├── ImagePreview.tsx
│   │   ├── DragDropZone.tsx
│   │   └── FilePreview.tsx
│   │
│   ├── layout/                             # 레이아웃 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Navigation.tsx
│   │   ├── PageHeader.tsx
│   │   └── Container.tsx
│   │
│   ├── common/                             # 기타 공통 컴포넌트
│   │   ├── Loading.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   ├── Modal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── EmptyState.tsx
│   │
│   └── landing/                            # 랜딩 페이지 컴포넌트
│       ├── Navbar.tsx
│       ├── HeroSection.tsx
│       ├── UnitManagementSection.tsx
│       ├── LedgerSection.tsx
│       ├── Footer.tsx
│       └── MenuIcon.tsx
│
├── hooks/                                  # Custom Hooks
│   ├── useBuildings.ts
│   ├── useRooms.ts
│   ├── useTenants.ts
│   ├── usePayments.ts
│   ├── useWorkOrders.ts                    # 새로 추가
│   ├── useContractors.ts                   # 새로 추가
│   ├── useMaintenanceGuides.ts             # 새로 추가
│   ├── useDragAndDrop.ts                   # 새로 추가
│   └── useForm.ts                          # 새로 추가
│
├── lib/
│   ├── axios.ts                            # Axios 인스턴스
│   ├── firebase.ts                         # Firebase 초기화
│   ├── utils.ts                            # 유틸리티 함수
│   ├── date.ts                             # 날짜 관련 함수
│   └── validation.ts                       # Zod 스키마
│
└── store/
    └── useAuthStore.ts                     # Zustand 스토어
```

---

## 페이지별 파일 목록

### 1. 임차인(Tenant) 페이지

| 경로 | 파일명 | 목적 | 필수 컴포넌트 |
|------|--------|------|--------------|
| `/tenant/dashboard` | `page.tsx` | 대시보드 | QuickStats, RecentWorkOrderCard, PrimaryButton |
| `/tenant/work-orders` | `page.tsx` | 민원 목록 | FilterBar, SortDropdown, WorkOrderListItem, InfiniteScroll |
| `/tenant/work-orders/create` | `page.tsx` | 민원 작성 | WorkOrderForm, ImageUploadSection, FormActions |
| `/tenant/work-orders/[id]` | `page.tsx` | 민원 상세 | ProgressBar, BasicInfoCard, ImageGallery, ContractorCard, TimelineLog, ActionButtons |

**컴포넌트 파일 수**: 8개 (페이지 4 + 컴포넌트 4)

---

### 2. 관리자(Admin) 페이지

#### 2.1 대시보드
| 경로 | 파일명 | 목적 | 필수 컴포넌트 |
|------|--------|------|--------------|
| `/admin/dashboard` | `page.tsx` | 대시보드 | KPICard (4개), CategoryChart, RecentWorkOrderTable, TopContractorStats |

**컴포넌트 파일 수**: 5개

#### 2.2 민원 관리
| 경로 | 파일명 | 목적 | 필수 컴포넌트 |
|------|--------|------|--------------|
| `/admin/maintenance/workorders` | `page.tsx` | 보드 뷰 | WorkOrderBoard, FilterBar, ViewToggle, WorkOrderCardDraggable, BulkActions |
| `/admin/maintenance/workorders/[id]` | `page.tsx` | 상세 뷰 | WorkOrderInfoCard, ContractorAssignCard, RecommendedContractors, TimeMetrics, AttachmentSection, TimelineSection, AdminActions |

**컴포넌트 파일 수**: 13개

#### 2.3 협력 업체 관리
| 경로 | 파일명 | 목적 | 필수 컴포넌트 |
|------|--------|------|--------------|
| `/admin/maintenance/contractors` | `page.tsx` | 목록 | ContractorSearch, ContractorTable, Pagination, ContractorHeader |
| `/admin/maintenance/contractors/[id]` | `page.tsx` | 상세 | ContractorForm, PerformanceStats, AssignedWorkOrders, DeleteButton |

**컴포넌트 파일 수**: 8개

#### 2.4 예방 정비 가이드
| 경로 | 파일명 | 목적 | 필수 컴포넌트 |
|------|--------|------|--------------|
| `/admin/maintenance/guides` | `page.tsx` | 목록 | GuideHeader, FilterBar, SortDropdown, MaintenanceGuideCard |
| `/admin/maintenance/guides/create` | `page.tsx` | 작성 | GuideForm, DurationInput, RoomCheckbox, FormActions |

**컴포넌트 파일 수**: 8개

**Admin 전체 컴포넌트 수**: 34개 (페이지 7 + 컴포넌트 27)

---

### 3. 협력 업체(Vendor) 페이지

| 경로 | 파일명 | 목적 | 필수 컴포넌트 |
|------|--------|------|--------------|
| `/vendor/work-orders` | `page.tsx` | 배정받은 민원 | ContractorWorkOrderCard, FilterBar, StatusChangeButton |

**컴포넌트 파일 수**: 4개 (페이지 1 + 컴포넌트 3)

---

## 공통 컴포넌트 목록

### UI 기초 컴포넌트 (shadcn/ui)
- `Button.tsx` - 기본 버튼
- `Input.tsx` - 텍스트 입력
- `TextArea.tsx` - 여러 줄 입력
- `Select.tsx` - 드롭다운
- `Card.tsx` - 카드 컨테이너
- `Badge.tsx` - 배지
- `Dialog.tsx` - 모달
- `Label.tsx` - 라벨
- `Separator.tsx` - 구분선
- `Checkbox.tsx` - 체크박스
- `RadioGroup.tsx` - 라디오 버튼

**UI 컴포넌트 수**: 11개

### 도메인 공통 컴포넌트

#### workorder/ (민원)
| 컴포넌트 | 목적 | Props |
|---------|------|-------|
| `StatusBadge.tsx` | 상태 배지 | status, size, variant |
| `PriorityBadge.tsx` | 우선순위 배지 | priority, size |
| `WorkOrderCard.tsx` | 민원 카드 | title, status, priority, contractor, date, onViewDetail |
| `FilterBar.tsx` | 필터 칩 | filters, onFilterChange |
| `SortDropdown.tsx` | 정렬 옵션 | sortBy, onSortChange, options |
| `Timeline.tsx` | 진행 타임라인 | logs, variant |

**workorder 컴포넌트 수**: 6개

#### contractor/ (업체)
| 컴포넌트 | 목적 | Props |
|---------|------|-------|
| `ContractorInfoCard.tsx` | 업체 정보 카드 | name, phone, email, rating, completedCount |
| `RatingDisplay.tsx` | 평점 표시 | rating, count |
| `ContractorBadge.tsx` | 업체 배지 | status, name |

**contractor 컴포넌트 수**: 3개

#### dashboard/ (대시보드)
| 컴포넌트 | 목적 | Props |
|---------|------|-------|
| `StatCard.tsx` | 통계 카드 | title, value, icon, trend |
| `Chart.tsx` | 차트 (Recharts 래퍼) | type, data, options |
| `EmptyState.tsx` | 데이터 없음 | icon, title, description |

**dashboard 컴포넌트 수**: 3개

#### form/ (폼)
| 컴포넌트 | 목적 | Props |
|---------|------|-------|
| `FormInput.tsx` | 텍스트 입력 | label, required, error, helperText |
| `FormSelect.tsx` | 드롭다운 | label, options, required, error |
| `FormTextArea.tsx` | 여러 줄 입력 | label, required, error, rows |
| `FormCheckbox.tsx` | 체크박스 | label, checked, onChange |
| `FormRadioGroup.tsx` | 라디오 그룹 | label, options, value, onChange |
| `FormError.tsx` | 에러 메시지 | message |

**form 컴포넌트 수**: 6개

#### upload/ (파일 업로드)
| 컴포넌트 | 목적 | Props |
|---------|------|-------|
| `ImageUpload.tsx` | 이미지 업로드 | maxFiles, onUpload, onError |
| `ImagePreview.tsx` | 이미지 미리보기 | images, onDelete, onDownload |
| `DragDropZone.tsx` | 드래그 드롭 영역 | onDrop, accept |
| `FilePreview.tsx` | 파일 미리보기 | file, onRemove |

**upload 컴포넌트 수**: 4개

#### layout/ (레이아웃)
| 컴포넌트 | 목적 | Props |
|---------|------|-------|
| `Header.tsx` | 헤더 | title, actions |
| `Sidebar.tsx` | 사이드바 | items, activeItem |
| `Navigation.tsx` | 네비게이션 | role |
| `PageHeader.tsx` | 페이지 헤더 | title, breadcrumbs, actions |
| `Container.tsx` | 컨테이너 | children, size |

**layout 컴포넌트 수**: 5개

#### common/ (기타)
| 컴포넌트 | 목적 | Props |
|---------|------|-------|
| `Loading.tsx` | 로딩 스피너 | size, text |
| `Skeleton.tsx` | 스켈레톤 | count, height, width |
| `Toast.tsx` | 토스트 알림 | message, type, duration |
| `Modal.tsx` | 모달 | isOpen, onClose, title, children |
| `ConfirmDialog.tsx` | 확인 다이얼로그 | isOpen, onConfirm, onCancel, message |
| `EmptyState.tsx` | 데이터 없음 | icon, title, description, action |

**common 컴포넌트 수**: 6개

### 공통 컴포넌트 총합
**총 44개 컴포넌트** (UI 11 + workorder 6 + contractor 3 + dashboard 3 + form 6 + upload 4 + layout 5 + common 6)

---

## Custom Hooks 목록

| Hook | 목적 | 반환값 |
|------|------|--------|
| `useWorkOrders()` | 민원 목록/상세 조회 | { workOrders, loading, error, refetch } |
| `useContractors()` | 업체 목록/상세 조회 | { contractors, loading, error } |
| `useMaintenanceGuides()` | 정비 가이드 조회 | { guides, loading, error } |
| `useDragAndDrop()` | 드래그 앤 드롭 | { isDragging, handleDragStart, handleDrop } |
| `useForm()` | 폼 상태 관리 | { formData, errors, handleChange, handleSubmit } |

**Custom Hooks 수**: 5개 (기존 4개 + 신규 5개)

---

## 페이지별 컴포넌트 계층

### Tenant Dashboard (`/tenant/dashboard`)
```
TenantDashboardPage
├── Header (건물명, 알림)
├── QuickStats (4칸)
│   ├── StatCard (진행중)
│   ├── StatCard (완료대기)
│   ├── StatCard (완료)
│   └── StatCard (작년대비)
├── RecentWorkOrderCard (x3)
└── Button (새 민원 접수)
```

### Tenant Work Order Create (`/tenant/work-orders/create`)
```
CreateWorkOrderPage
├── FormHeader (뒤로가기, 제목)
├── WorkOrderForm
│   ├── FormInput (제목)
│   ├── FormRadioGroup (카테고리)
│   ├── FormTextArea (설명)
│   ├── FormRadioGroup (우선순위)
│   └── ImageUploadSection
│       ├── DragDropZone
│       └── ImagePreview (x5)
└── FormActions (제출, 임시저장)
```

### Tenant Work Order Detail (`/tenant/work-orders/[id]`)
```
DetailPage
├── DetailHeader (뒤로가기, 제목)
├── ProgressBar (상태 진행률)
├── BasicInfoCard
├── DescriptionCard
├── ImageGallery
├── ContractorCard (with RatingDisplay)
├── TimelineLog
└── ActionButtons (질문, 취소)
```

### Admin Dashboard (`/admin/dashboard`)
```
AdminDashboardPage
├── AdminHeader
├── KPICard (x4)
│   ├── 진행중 민원
│   ├── 완료대기
│   ├── 평균 처리시간
│   └── 만족도
├── CategoryChart (Bar Chart)
├── RecentWorkOrderTable
├── TopContractorStats
└── Button Links (민원 관리, 업체 관리)
```

### Admin Work Order Board (`/admin/maintenance/workorders`)
```
WorkOrderBoardPage
├── FilterBar (건물, 호실, 상태)
├── ViewToggle (보드, 리스트, 캘린더)
├── WorkOrderBoard
│   ├── WorkOrderColumn (접수)
│   │   └── WorkOrderCardDraggable (x3)
│   ├── WorkOrderColumn (진행중)
│   │   └── WorkOrderCardDraggable (x5)
│   └── WorkOrderColumn (완료)
│       └── WorkOrderCardDraggable (x12)
└── BulkActions (일괄 작업, csv 다운로드)
```

### Admin Contractor List (`/admin/maintenance/contractors`)
```
ContractorListPage
├── ContractorHeader
├── ContractorSearch
├── FilterBar (활성, 비활성)
├── ContractorTable
│   └── TableRow (x많음)
└── Pagination
```

### Admin Maintenance Guides (`/admin/maintenance/guides`)
```
MaintenanceGuidesPage
├── GuideHeader
├── FilterBar (카테고리)
├── SortDropdown (교체주기)
└── MaintenanceGuideCard (x많음)
    ├── 항목명, 카테고리, 주기
    ├── 마지막/다음 시행일
    ├── 영향 호실 목록
    └── 수정/삭제/시행기록 버튼
```

---

## 구현 순서 및 우선순위

### Phase 1: 공통 기반 (1주)
**우선순위**: 🔴 필수

1. UI 컴포넌트 (Button, Input, Badge 등) - 이미 일부 존재
2. Form 관련 컴포넌트 (FormInput, FormSelect, FormTextArea)
3. Common 컴포넌트 (Loading, Skeleton, Toast, Modal)
4. Upload 컴포넌트 (ImageUpload, DragDropZone)

**산출물**: 15-20개 컴포넌트

---

### Phase 2: Tenant 페이지 (1.5주)
**우선순위**: 🔴 필수

1. `/tenant/dashboard` - 대시보드
2. `/tenant/work-orders` - 목록
3. `/tenant/work-orders/create` - 작성
4. `/tenant/work-orders/[id]` - 상세
5. workorder 공통 컴포넌트

**산출물**: 12개 페이지/컴포넌트

---

### Phase 3: Admin 페이지 (2주)
**우선순위**: 🔴 필수

1. `/admin/dashboard` - 대시보드
2. `/admin/maintenance/workorders` - 보드 뷰
3. `/admin/maintenance/workorders/[id]` - 상세
4. `/admin/maintenance/contractors` - 업체 목록
5. `/admin/maintenance/contractors/[id]` - 업체 상세
6. `/admin/maintenance/guides` - 정비 가이드
7. `/admin/maintenance/guides/create` - 가이드 작성

**산출물**: 27개 페이지/컴포넌트

---

### Phase 4: Vendor 페이지 (1주)
**우선순위**: 🟡 중간

1. `/vendor/work-orders` - 배정 민원

**산출물**: 4개 페이지/컴포넌트

---

### Phase 5: 레이아웃 & 최적화 (1주)
**우선순위**: 🟡 중간

1. Header, Sidebar, Navigation, PageHeader
2. 반응형 레이아웃 테스트
3. 접근성 검사
4. 성능 최적화

**산출물**: 5개 레이아웃 컴포넌트

---

## 파일 생성 체크리스트

### 페이지 파일 (합계: 17개)
- [ ] `/tenant/dashboard/page.tsx`
- [ ] `/tenant/work-orders/page.tsx`
- [ ] `/tenant/work-orders/create/page.tsx`
- [ ] `/tenant/work-orders/[id]/page.tsx`
- [ ] `/admin/dashboard/page.tsx`
- [ ] `/admin/maintenance/workorders/page.tsx`
- [ ] `/admin/maintenance/workorders/[id]/page.tsx`
- [ ] `/admin/maintenance/contractors/page.tsx`
- [ ] `/admin/maintenance/contractors/[id]/page.tsx`
- [ ] `/admin/maintenance/guides/page.tsx`
- [ ] `/admin/maintenance/guides/create/page.tsx`
- [ ] `/vendor/work-orders/page.tsx`
- [ ] `/tenant/layout.tsx`
- [ ] `/admin/layout.tsx` (이미 존재)
- [ ] `/vendor/layout.tsx`

### 페이지별 컴포넌트 (합계: 54개)
**Tenant 컴포넌트** (8개)
- [ ] `WorkOrderForm.tsx`
- [ ] `ImageUploadSection.tsx`
- [ ] `FormActions.tsx`
- [ ] `ProgressBar.tsx`
- [ ] `BasicInfoCard.tsx`
- [ ] `DescriptionCard.tsx`
- [ ] `ContractorCard.tsx` (domain용)
- [ ] `TimelineLog.tsx`

**Admin 컴포넌트** (34개)
- Dashboard: [ ] `KPICard.tsx`, [ ] `CategoryChart.tsx`, [ ] `RecentWorkOrderTable.tsx`, [ ] `TopContractorStats.tsx`
- Board: [ ] `WorkOrderBoard.tsx`, [ ] `WorkOrderColumn.tsx`, [ ] `WorkOrderCardDraggable.tsx`, [ ] `FilterBar.tsx`, [ ] `ViewToggle.tsx`, [ ] `BulkActions.tsx`
- Detail: [ ] `WorkOrderInfoCard.tsx`, [ ] `ContractorAssignCard.tsx`, [ ] `RecommendedContractors.tsx`, [ ] `TimeMetrics.tsx`, [ ] `AttachmentSection.tsx`, [ ] `TimelineSection.tsx`, [ ] `AdminActions.tsx`
- Contractor List: [ ] `ContractorSearch.tsx`, [ ] `ContractorTable.tsx`, [ ] `Pagination.tsx`, [ ] `ContractorHeader.tsx`
- Contractor Detail: [ ] `ContractorForm.tsx`, [ ] `PerformanceStats.tsx`, [ ] `AssignedWorkOrders.tsx`, [ ] `DeleteButton.tsx`
- Guide: [ ] `GuideHeader.tsx`, [ ] `SortDropdown.tsx`, [ ] `MaintenanceGuideCard.tsx`, [ ] `GuideForm.tsx`, [ ] `DurationInput.tsx`, [ ] `RoomCheckbox.tsx`

**Vendor 컴포넌트** (4개)
- [ ] `ContractorWorkOrderCard.tsx`
- [ ] `StatusChangeButton.tsx`

### 공통 컴포넌트 (합계: 44개)
**UI 컴포넌트** (11개) - 대부분 기존
**Domain 컴포넌트** (33개)
- [ ] workorder 6개
- [ ] contractor 3개
- [ ] dashboard 3개
- [ ] form 6개
- [ ] upload 4개
- [ ] layout 5개
- [ ] common 6개

### Custom Hooks (합계: 5개)
- [ ] `useWorkOrders.ts`
- [ ] `useContractors.ts`
- [ ] `useMaintenanceGuides.ts`
- [ ] `useDragAndDrop.ts`
- [ ] `useForm.ts`

---

## 검증 체크리스트

### 구조 검증
- [ ] 모든 페이지가 `app/` 디렉토리의 올바른 경로에 위치
- [ ] 각 페이지 폴더에 `page.tsx` 파일 존재
- [ ] 페이지별 컴포넌트가 `components/` 하위 폴더에 정리
- [ ] 공통 컴포넌트가 `components/{domain}/` 구조로 정리
- [ ] Custom Hooks가 `hooks/` 디렉토리에 위치

### 파일 명명 규칙
- [ ] 페이지 파일: `page.tsx` (소문자)
- [ ] 컴포넌트 파일: `PascalCase.tsx`
- [ ] Hook 파일: `useCamelCase.ts`
- [ ] 유틸리티 파일: `camelCase.ts`

### 컴포넌트 검증
- [ ] 모든 컴포넌트가 TypeScript로 작성
- [ ] Props 인터페이스 정의됨
- [ ] 이뮬러빌리티 원칙 적용 (스프레드 연산자 사용)
- [ ] 에러 핸들링 포함
- [ ] 입력 검증 포함 (zod)

### 의존성 검증
- [ ] 순환 참조 없음
- [ ] 페이지별 컴포넌트가 공통 컴포넌트 재사용
- [ ] Hook 의존성 배열 올바름
- [ ] 외부 라이브러리 임포트 최소화

### 성능 검증
- [ ] React.memo로 불필요한 리렌더 방지
- [ ] useCallback으로 함수 메모이제이션
- [ ] 큰 리스트는 virtualization 고려
- [ ] 이미지는 next/image 사용

### 접근성 검증
- [ ] 모든 버튼에 aria-label
- [ ] 폼 입력에 label 요소
- [ ] 색상만으로 정보 전달 금지
- [ ] 키보드 네비게이션 지원
- [ ] 포커스 상태 명확

---

## 요약

| 항목 | 개수 |
|------|------|
| **페이지 파일** | 17개 |
| **페이지별 컴포넌트** | 54개 |
| **공통 컴포넌트** | 44개 |
| **Custom Hooks** | 5개 |
| **총 파일 수** | 120개 |
| **예상 구현 기간** | 5-6주 |

---

## 노트

1. **레이아웃 재사용**: Admin과 Vendor 레이아웃은 공통 패턴 활용
2. **컴포넌트 분리**: 페이지별 컴포넌트는 그 페이지에서만 사용, 공통 컴포넌트 우선 재사용
3. **타입 안전성**: 모든 Props는 TypeScript 인터페이스로 정의
4. **API 통합**: Custom Hooks에서 Axios + React Query 사용
5. **상태 관리**: Zustand store 활용 (전역 상태는 최소화)
6. **폼 검증**: Zod 스키마로 런타임 검증
7. **이미지 처리**: next/image 사용, 최적화
8. **다크 모드**: Tailwind CSS 기본 설정으로 지원 가능

---

**작성자**: Claude Code
**버전**: 1.0
**최종 업데이트**: 2026-03-15
