# Billim Frontend 컴포넌트 계층도

**작성일**: 2026-03-15
**기준**: UI-PLAN.md의 "2. 페이지 구조" 섹션

---

## 📑 목차

1. [전체 컴포넌트 계층 구조](#전체-컴포넌트-계층-구조)
2. [페이지별 세부 계층도](#페이지별-세부-계층도)
3. [공통 컴포넌트 의존성](#공통-컴포넌트-의존성)
4. [Props 인터페이스 정의](#props-인터페이스-정의)

---

## 전체 컴포넌트 계층 구조

```
app/
├── RootLayout
│   ├── AuthProvider
│   ├── ThemeProvider
│   ├── QueryClientProvider
│   └── ToastProvider
│
├── LandingPage
│   ├── Navbar
│   ├── HeroSection
│   ├── UnitManagementSection
│   ├── LedgerSection
│   └── Footer
│
├── LoginPage
│   └── LoginForm
│
├── TenantLayout
│   ├── TenantHeader
│   ├── TenantSidebar
│   └── [TenantPages]
│
├── AdminLayout
│   ├── AdminHeader
│   ├── AdminSidebar
│   └── [AdminPages]
│
└── VendorLayout
    ├── VendorHeader
    ├── VendorSidebar
    └── [VendorPages]
```

---

## 페이지별 세부 계층도

### Tenant 영역

#### 1. Tenant Dashboard (`/tenant/dashboard`)

```
TenantDashboardPage
│
├── PageHeader
│   ├── Title: "내 민원들"
│   └── NotificationButton
│
├── QuickStatsSection
│   ├── StatCard (진행중)
│   │   ├── Icon
│   │   ├── Title
│   │   ├── Value
│   │   └── Trend
│   │
│   ├── StatCard (완료대기)
│   ├── StatCard (완료)
│   └── StatCard (작년대비)
│
├── RecentWorkOrdersSection
│   ├── SectionHeader
│   ├── RecentWorkOrderCard
│   │   ├── Badge (Status)
│   │   ├── Title
│   │   ├── Building/Unit Info
│   │   ├── Days Elapsed
│   │   └── ViewDetailButton
│   │
│   ├── RecentWorkOrderCard
│   └── RecentWorkOrderCard
│
└── CTASection
    └── PrimaryButton (새 민원 접수)
```

**사용 컴포넌트 (8개)**:
- StatCard ✓ (공통: dashboard)
- PageHeader ✓ (공통: layout)
- Badge ✓ (공통: ui)
- Button ✓ (공통: ui)

---

#### 2. Tenant Work Orders List (`/tenant/work-orders`)

```
TenantWorkOrderListPage
│
├── PageHeader
│   ├── Title: "내 민원들"
│   └── FilterButton
│
├── FilterBar
│   ├── FilterChip (전체)
│   ├── FilterChip (접수)
│   ├── FilterChip (진행중)
│   └── FilterChip (완료)
│
├── SortBar
│   └── SortDropdown
│       ├── 최신순
│       ├── 우선순위
│       └── 상태순
│
├── WorkOrderList
│   ├── WorkOrderListItem
│   │   ├── Title
│   │   ├── PriorityBadge
│   │   ├── StatusBadge
│   │   ├── ContractorName
│   │   ├── SubmittedDate
│   │   └── ViewDetailButton
│   │
│   ├── WorkOrderListItem
│   └── WorkOrderListItem
│
└── InfiniteScrollTrigger
    └── LoadingIndicator
```

**사용 컴포넌트 (10개)**:
- FilterBar ✓ (공통: workorder)
- SortDropdown ✓ (공통: workorder)
- StatusBadge ✓ (공통: workorder)
- PriorityBadge ✓ (공통: workorder)
- Button ✓ (공통: ui)
- Skeleton ✓ (공통: common)

---

#### 3. Tenant Work Order Create (`/tenant/work-orders/create`)

```
CreateWorkOrderPage
│
├── FormHeader
│   ├── BackButton
│   └── Title: "새 민원 접수"
│
├── WorkOrderForm
│   ├── FormSection (제목)
│   │   ├── FormLabel
│   │   ├── FormInput
│   │   │   ├── Placeholder
│   │   │   └── RequiredIndicator
│   │   └── FormError
│   │
│   ├── FormSection (카테고리)
│   │   ├── FormLabel
│   │   ├── FormRadioGroup
│   │   │   ├── RadioOption (누수)
│   │   │   ├── RadioOption (가전)
│   │   │   ├── RadioOption (전기)
│   │   │   ├── RadioOption (배관)
│   │   │   └── RadioOption (기타)
│   │   └── FormError
│   │
│   ├── FormSection (설명)
│   │   ├── FormLabel
│   │   ├── FormTextArea
│   │   │   ├── Placeholder
│   │   │   └── CharacterCount
│   │   └── FormError
│   │
│   ├── FormSection (우선순위)
│   │   ├── FormLabel
│   │   ├── FormRadioGroup
│   │   │   ├── RadioOption (낮음)
│   │   │   ├── RadioOption (중간)
│   │   │   └── RadioOption (높음)
│   │   └── FormError
│   │
│   └── FormSection (이미지)
│       ├── FormLabel
│       ├── DragDropZone
│       │   ├── Icon
│       │   └── Text
│       ├── ImagePreviewGrid
│       │   ├── ImagePreviewCard
│       │   │   ├── Image
│       │   │   └── DeleteButton
│       │   ├── ImagePreviewCard
│       │   └── ImagePreviewCard
│       └── FormError
│
└── FormActions
    ├── SubmitButton (제출)
    ├── DraftButton (임시 저장)
    └── CancelButton
```

**사용 컴포넌트 (17개)**:
- FormInput ✓ (공통: form)
- FormTextArea ✓ (공통: form)
- FormRadioGroup ✓ (공통: form)
- FormError ✓ (공통: form)
- FormLabel ✓ (공통: ui)
- DragDropZone ✓ (공통: upload)
- ImagePreview ✓ (공통: upload)
- Button ✓ (공통: ui)
- Toast ✓ (공통: common)

---

#### 4. Tenant Work Order Detail (`/tenant/work-orders/[id]`)

```
DetailPage
│
├── DetailHeader
│   ├── BackButton
│   └── Title: "화장실 누수 (ID#1)"
│
├── ProgressSection
│   └── ProgressBar
│       ├── Stage (접수)
│       │   └── StatusIcon
│       ├── Arrow
│       ├── Stage (진행중)
│       │   └── StatusIcon
│       ├── Arrow
│       ├── Stage (완료)
│       │   └── StatusIcon
│       └── ProgressText: "66%"
│
├── BasicInfoCard
│   ├── InfoRow
│   │   ├── Label: "우선순위"
│   │   └── PriorityBadge
│   ├── InfoRow
│   │   ├── Label: "접수일"
│   │   └── DateTime
│   ├── InfoRow
│   │   ├── Label: "카테고리"
│   │   └── CategoryBadge
│   └── InfoRow
│       ├── Label: "상태"
│       └── StatusBadge
│
├── DescriptionCard
│   ├── Title
│   └── Description Text
│
├── ImageGallerySection
│   ├── MainImage (enlarged)
│   │   ├── ZoomControls
│   │   └── DragControls
│   └── ThumbnailGrid
│       ├── Thumbnail (1)
│       ├── Thumbnail (2)
│       └── Thumbnail (3)
│
├── ContractorCard
│   ├── ContractorName
│   ├── Phone
│   │   ├── PhoneIcon
│   │   └── CopyButton
│   ├── Email
│   │   ├── EmailIcon
│   │   └── CopyButton
│   ├── RatingDisplay
│   │   ├── Stars
│   │   ├── Score
│   │   └── ReviewCount
│   └── VisitContractorButton
│
├── TimelineSection
│   └── Timeline
│       ├── TimelineItem (가장 최근)
│       │   ├── DateTime
│       │   ├── Icon
│       │   ├── EventText
│       │   └── AuthorName
│       ├── TimelineItem
│       ├── TimelineItem
│       └── TimelineItem (가장 이전)
│
└── ActionButtons
    ├── AskQuestionButton
    └── RequestCancellationButton
```

**사용 컴포넌트 (18개)**:
- ProgressBar ✓ (페이지별)
- BasicInfoCard ✓ (페이지별)
- DescriptionCard ✓ (페이지별)
- ImageGallery ✓ (페이지별 + 공통에서도)
- ContractorCard ✓ (페이지별)
- ContractorInfoCard ✓ (공통: contractor)
- RatingDisplay ✓ (공통: contractor)
- StatusBadge ✓ (공통: workorder)
- PriorityBadge ✓ (공통: workorder)
- Timeline ✓ (공통: workorder)
- Button ✓ (공통: ui)
- Badge ✓ (공통: ui)

---

### Admin 영역

#### 1. Admin Dashboard (`/admin/dashboard`)

```
AdminDashboardPage
│
├── AdminHeader
│   ├── Breadcrumb (관리자 > 대시보드)
│   └── NotificationButton
│
├── KPISection
│   ├── KPICard (진행중)
│   │   ├── Icon
│   │   ├── Title
│   │   ├── Value (12)
│   │   └── Trend
│   ├── KPICard (완료대기)
│   ├── KPICard (평균처리시간)
│   └── KPICard (만족도)
│
├── CategoryChartSection
│   ├── Title
│   └── Chart (Bar Chart)
│       ├── YAxis
│       ├── XAxis
│       ├── Bar (누수)
│       ├── Bar (가전)
│       ├── Bar (배관)
│       ├── Bar (전기)
│       └── Bar (기타)
│
├── RecentWorkOrderTableSection
│   ├── Title
│   └── Table
│       ├── TableHeader
│       │   ├── Column (건물)
│       │   ├── Column (호실)
│       │   ├── Column (제목)
│       │   ├── Column (상태)
│       │   ├── Column (업체)
│       │   └── Column (일자)
│       └── TableRows
│           ├── Row (1)
│           ├── Row (2)
│           └── Row (5)
│
├── TopContractorStatsSection
│   ├── Title
│   ├── StatCard (1위)
│   │   ├── CompanyName
│   │   ├── CompletedCount
│   │   └── Rating
│   ├── StatCard (2위)
│   └── StatCard (3위)
│
└── CTAButtons
    ├── WorkOrderManagementButton
    └── ContractorManagementButton
```

**사용 컴포넌트 (15개)**:
- KPICard ✓ (페이지별)
- CategoryChart ✓ (페이지별 - Recharts 래퍼)
- RecentWorkOrderTable ✓ (페이지별)
- TopContractorStats ✓ (페이지별)
- StatCard ✓ (공통: dashboard)
- Button ✓ (공통: ui)
- Chart ✓ (공통: dashboard)

---

#### 2. Admin Work Order Board (`/admin/maintenance/workorders`)

```
WorkOrderBoardPage
│
├── Header
│   ├── Title: "민원 관리"
│   └── Controls
│       ├── BuildingFilter
│       ├── UnitFilter
│       └── StatusFilter
│
├── ViewToggle
│   ├── BoardViewButton (선택됨)
│   ├── ListViewButton
│   └── CalendarViewButton
│
├── WorkOrderBoard (Kanban)
│   ├── WorkOrderColumn (접수 - 3개)
│   │   ├── ColumnHeader
│   │   │   ├── Title: "접수"
│   │   │   └── Count: "(3)"
│   │   ├── WorkOrderCardDraggable
│   │   │   ├── Title
│   │   │   ├── PriorityBadge
│   │   │   ├── StatusBadge
│   │   │   ├── UnitInfo
│   │   │   ├── ContractorInfo
│   │   │   └── DragHandle
│   │   ├── WorkOrderCardDraggable
│   │   └── WorkOrderCardDraggable
│   │
│   ├── WorkOrderColumn (진행중 - 5개)
│   │   ├── ColumnHeader
│   │   └── [카드들]
│   │
│   └── WorkOrderColumn (완료 - 12개)
│       ├── ColumnHeader
│       └── [카드들]
│
└── BulkActions
    ├── SelectAllCheckbox
    ├── BulkStatusChangeButton
    └── ExportCSVButton
```

**사용 컴포넌트 (12개)**:
- WorkOrderBoard ✓ (페이지별)
- WorkOrderColumn ✓ (페이지별)
- WorkOrderCardDraggable ✓ (페이지별)
- FilterBar ✓ (공통: workorder)
- ViewToggle ✓ (페이지별)
- BulkActions ✓ (페이지별)
- StatusBadge ✓ (공통: workorder)
- PriorityBadge ✓ (공통: workorder)
- Checkbox ✓ (공통: ui)

---

#### 3. Admin Work Order Detail (`/admin/maintenance/workorders/[id]`)

```
AdminWorkOrderDetailPage
│
├── DetailHeader
│   ├── BackButton
│   └── Title: "민원 #1 상세보기"
│
├── WorkOrderInfoCard
│   ├── InfoRow (건물)
│   ├── InfoRow (호실)
│   ├── InfoRow (제목)
│   └── StatusDropdown
│       ├── StatusOption (접수)
│       ├── StatusOption (진행중)
│       └── StatusOption (완료)
│
├── ContractorAssignCard
│   ├── Label: "현재 배정"
│   ├── CurrentContractorInfo
│   │   ├── Name
│   │   └── AssignedDate
│   ├── ChangeContractorButton
│   └── UnassignButton
│
├── RecommendedContractorsSection
│   ├── Title
│   ├── ContractorOption (1)
│   │   ├── Name
│   │   ├── Rating
│   │   ├── CompletedCount
│   │   └── SelectButton
│   ├── ContractorOption (2)
│   └── ContractorOption (3)
│
├── TimeMetricsCard
│   ├── MetricRow (접수→배정)
│   │   ├── Label
│   │   └── Duration
│   ├── MetricRow (배정→완료)
│   │   ├── Label
│   │   └── Duration (진행중)
│   └── MetricRow (총 소요)
│       ├── Label
│       └── Duration
│
├── AttachmentSection
│   ├── Title
│   └── ImageGrid
│       ├── Image (1)
│       ├── Image (2)
│       └── DownloadAllButton
│
├── TimelineSection
│   └── Timeline
│       ├── TimelineItem
│       ├── TimelineItem
│       └── TimelineItem
│
└── AdminActions
    ├── ResendNotificationButton
    └── CancelButton
```

**사용 컴포넌트 (15개)**:
- WorkOrderInfoCard ✓ (페이지별)
- ContractorAssignCard ✓ (페이지별)
- RecommendedContractors ✓ (페이지별)
- TimeMetrics ✓ (페이지별)
- AttachmentSection ✓ (페이지별)
- TimelineSection ✓ (페이지별)
- AdminActions ✓ (페이지별)
- Select ✓ (공통: ui)
- Timeline ✓ (공통: workorder)
- ContractorInfoCard ✓ (공통: contractor)
- Button ✓ (공통: ui)

---

#### 4. Admin Contractors List (`/admin/maintenance/contractors`)

```
ContractorListPage
│
├── ContractorHeader
│   ├── Title: "협력 업체 관리"
│   └── AddNewContractorButton
│
├── ContractorSearch
│   ├── SearchInput
│   └── FilterChips
│       ├── FilterChip (전체)
│       ├── FilterChip (활성)
│       └── FilterChip (비활성)
│
├── ContractorTable
│   ├── TableHeader
│   │   ├── Column (번호)
│   │   ├── Column (업체명)
│   │   ├── Column (연락처)
│   │   ├── Column (카테고리)
│   │   ├── Column (활성)
│   │   ├── Column (평점)
│   │   ├── Column (완료건수)
│   │   └── Column (액션)
│   └── TableRows
│       ├── Row (1)
│       │   ├── Cell (번호)
│       │   ├── Cell (업체명)
│       │   ├── Cell (연락처)
│       │   ├── Cell (카테고리)
│       │   ├── Cell (상태 배지)
│       │   ├── Cell (평점)
│       │   ├── Cell (건수)
│       │   └── Cell (상세보기 링크)
│       ├── Row (2)
│       └── Row (3)
│
└── Pagination
    ├── PrevButton
    ├── PageNumber (1)
    ├── PageNumber (2)
    └── NextButton
```

**사용 컴포넌트 (10개)**:
- ContractorHeader ✓ (페이지별)
- ContractorSearch ✓ (페이지별)
- ContractorTable ✓ (페이지별)
- Pagination ✓ (페이지별)
- Input ✓ (공통: ui)
- Badge ✓ (공통: ui)
- Button ✓ (공통: ui)
- RatingDisplay ✓ (공통: contractor)

---

#### 5. Admin Contractor Detail (`/admin/maintenance/contractors/[id]`)

```
ContractorDetailPage
│
├── DetailHeader
│   ├── BackButton
│   └── Title: "한수도 수리소 상세"
│
├── ContractorForm (수정 모드)
│   ├── FormSection (기본 정보)
│   │   ├── FormInput (업체명)
│   │   ├── FormInput (연락처)
│   │   ├── FormInput (이메일)
│   │   ├── FormCheckbox (활성 여부)
│   │   ├── FormInput (담당자명)
│   │   └── FormCheckboxGroup (전문 카테고리)
│   │       ├── Checkbox (배관)
│   │       ├── Checkbox (누수)
│   │       ├── Checkbox (전기)
│   │       └── Checkbox (가전)
│   └── FormActions
│       ├── SaveButton
│       └── CancelButton
│
├── PerformanceStats
│   ├── StatCard (총 완료)
│   │   ├── Icon
│   │   ├── Label
│   │   └── Value
│   ├── StatCard (평균 점수)
│   ├── StatCard (평균 처리시간)
│   └── StatCard (최근 3개월)
│
├── AssignedWorkOrdersSection
│   ├── Title
│   ├── StatusBar
│   │   ├── ProgressBar (진행중 3)
│   │   └── ProgressBar (완료대기 2)
│   └── WorkOrderCards
│       ├── WorkOrderCard (1)
│       ├── WorkOrderCard (2)
│       └── ViewAllButton
│
└── DangerZone
    └── DeleteButton
```

**사용 컴포넌트 (14개)**:
- ContractorForm ✓ (페이지별)
- PerformanceStats ✓ (페이지별)
- AssignedWorkOrders ✓ (페이지별)
- DeleteButton ✓ (페이지별)
- FormInput ✓ (공통: form)
- FormCheckbox ✓ (공통: form)
- FormCheckboxGroup ✓ (공통: form)
- StatCard ✓ (공통: dashboard)
- Button ✓ (공통: ui)
- ConfirmDialog ✓ (공통: common)

---

#### 6. Admin Maintenance Guides (`/admin/maintenance/guides`)

```
MaintenanceGuidesPage
│
├── GuideHeader
│   ├── Title: "예방 정비 가이드"
│   └── AddGuideButton
│
├── FilterBar
│   ├── FilterChip (전체)
│   ├── FilterChip (누수)
│   ├── FilterChip (가전)
│   ├── FilterChip (배관)
│   └── FilterChip (전기)
│
├── SortDropdown
│   ├── Option (교체주기)
│   ├── Option (다음 예정일)
│   └── Option (이름순)
│
├── MaintenanceGuideCard (x많음)
│   ├── Header
│   │   ├── ItemName
│   │   └── Category Badge
│   ├── MetadataRow
│   │   ├── Label: "교체 주기"
│   │   └── Value: "2년 (24개월)"
│   ├── DateRow
│   │   ├── LastExecution: "2024-03-15"
│   │   └── NextScheduled: "2026-03-15 ⚠️"
│   ├── AffectedRoomsSection
│   │   ├── Title: "영향 호실 (5개)"
│   │   ├── RoomItem (201호)
│   │   │   ├── RoomNumber
│   │   │   └── LastExecutionDate
│   │   ├── RoomItem (202호)
│   │   ├── RoomItem (301호)
│   │   ├── RoomItem (302호)
│   │   └── RoomItem (401호)
│   └── ActionButtons
│       ├── EditButton
│       ├── DeleteButton
│       └── RecordExecutionButton
│
└── [다음 페이지로]
```

**사용 컴포넌트 (11개)**:
- GuideHeader ✓ (페이지별)
- FilterBar ✓ (공통: workorder / 또는 페이지별)
- SortDropdown ✓ (공통: workorder / 또는 페이지별)
- MaintenanceGuideCard ✓ (페이지별)
- Badge ✓ (공통: ui)
- Button ✓ (공통: ui)
- ConfirmDialog ✓ (공통: common)

---

#### 7. Admin Maintenance Guides Create (`/admin/maintenance/guides/create`)

```
CreateGuideFormPage
│
├── FormHeader
│   ├── BackButton
│   └── Title: "새 예방 정비 가이드"
│
├── GuideForm
│   ├── FormSection (항목명)
│   │   ├── FormLabel
│   │   ├── FormInput
│   │   └── FormError
│   │
│   ├── FormSection (카테고리)
│   │   ├── FormLabel
│   │   ├── FormSelect
│   │   │   ├── Option (누수)
│   │   │   ├── Option (가전)
│   │   │   ├── Option (배관)
│   │   │   └── Option (전기)
│   │   └── FormError
│   │
│   ├── FormSection (교체 주기)
│   │   ├── FormLabel
│   │   ├── DurationInput
│   │   │   ├── NumberInput (6)
│   │   │   └── UnitSelect (개월)
│   │   └── FormError
│   │
│   ├── FormSection (설명)
│   │   ├── FormLabel
│   │   ├── FormTextArea
│   │   └── FormError
│   │
│   ├── FormSection (기준 시행일)
│   │   ├── FormLabel
│   │   ├── DatePicker
│   │   └── FormError
│   │
│   ├── FormSection (영향 호실)
│   │   ├── FormLabel
│   │   ├── FormCheckbox (전체 호실)
│   │   ├── FormCheckbox (특정 호실만)
│   │   └── RoomCheckboxGrid
│   │       ├── RoomCheckbox (201호)
│   │       ├── RoomCheckbox (202호)
│   │       ├── RoomCheckbox (204호)
│   │       ├── RoomCheckbox (205호)
│   │       ├── RoomCheckbox (301호)
│   │       ├── RoomCheckbox (302호)
│   │       └── [...]
│   │
│   └── FormError
│
└── FormActions
    ├── SaveButton
    ├── DraftButton
    └── CancelButton
```

**사용 컴포넌트 (13개)**:
- GuideForm ✓ (페이지별)
- DurationInput ✓ (페이지별)
- RoomCheckbox ✓ (페이지별)
- FormActions ✓ (페이지별)
- FormInput ✓ (공통: form)
- FormSelect ✓ (공통: form)
- FormTextArea ✓ (공통: form)
- FormCheckbox ✓ (공통: form)
- FormError ✓ (공통: form)
- DatePicker ✓ (공통: ui)
- Button ✓ (공통: ui)

---

### Vendor 영역

#### 1. Vendor Work Orders (`/vendor/work-orders`)

```
VendorWorkOrderListPage
│
├── Header
│   ├── Title: "내 배정 민원들"
│   └── Badge (신규: 2)
│
├── FilterBar
│   ├── FilterChip (전체)
│   ├── FilterChip (신규)
│   ├── FilterChip (진행중)
│   └── FilterChip (완료)
│
├── SortDropdown
│   ├── Option (최신순)
│   ├── Option (우선순위)
│   └── Option (건물순)
│
├── ContractorWorkOrderCard (x많음)
│   ├── Badge (신규 또는 상태)
│   ├── Title
│   ├── BuildingAndUnit
│   │   ├── BuildingName
│   │   └── UnitAndTenant
│   ├── SubmittedDate
│   ├── PriorityBadge
│   └── ActionButtons
│       ├── StatusChangeButton
│       │   └── Dropdown (진행중, 완료)
│       ├── PhotoUploadButton
│       └── ViewDetailButton
│
└── InfiniteScrollTrigger
    └── LoadingIndicator
```

**사용 컴포넌트 (8개)**:
- ContractorWorkOrderCard ✓ (페이지별)
- FilterBar ✓ (공통: workorder)
- SortDropdown ✓ (공통: workorder)
- StatusChangeButton ✓ (페이지별)
- StatusBadge ✓ (공통: workorder)
- PriorityBadge ✓ (공통: workorder)
- Button ✓ (공통: ui)
- Badge ✓ (공통: ui)

---

## 공통 컴포넌트 의존성

### 의존성 그래프

```
shadcn/ui (Base)
│
├── Button
├── Input
├── Select
├── Card
├── Badge
├── Dialog
├── Label
├── Checkbox
├── RadioGroup
└── Separator

      ↓ (의존)

Domain Components
│
├── form/
│   ├── FormInput         (← Input, Label, FormError)
│   ├── FormSelect        (← Select, Label, FormError)
│   ├── FormTextArea      (← Input, Label, FormError)
│   ├── FormCheckbox      (← Checkbox, Label, FormError)
│   ├── FormRadioGroup    (← RadioGroup, Label, FormError)
│   └── FormError
│
├── workorder/
│   ├── StatusBadge       (← Badge)
│   ├── PriorityBadge     (← Badge)
│   ├── WorkOrderCard     (← Card, Badge, Button)
│   ├── Timeline          (← Card)
│   ├── FilterBar         (← Button)
│   └── SortDropdown      (← Select)
│
├── upload/
│   ├── ImageUpload       (← Button)
│   ├── ImagePreview      (← Button)
│   ├── DragDropZone      (← Button)
│   └── FilePreview
│
├── contractor/
│   ├── ContractorInfoCard (← Card, Badge)
│   ├── RatingDisplay       (← Badge)
│   └── ContractorBadge     (← Badge)
│
├── dashboard/
│   ├── StatCard     (← Card)
│   ├── Chart        (← Recharts)
│   └── EmptyState   (← Button)
│
├── layout/
│   ├── Header       (← Button)
│   ├── Sidebar      (← Button)
│   ├── Navigation   (← Button)
│   ├── PageHeader   (← Button)
│   └── Container
│
└── common/
    ├── Loading        (← Spinner)
    ├── Skeleton       (← Card)
    ├── Toast          (← Button)
    ├── Modal          (← Dialog)
    ├── ConfirmDialog  (← Dialog, Button)
    └── EmptyState     (← Button)
```

---

## Props 인터페이스 정의

### 공통 Props 패턴

```typescript
// 기본 컴포넌트 Props
interface BaseComponentProps {
  className?: string
  children: React.ReactNode
}

// 폼 입력 Props
interface FormInputProps {
  label: string
  required?: boolean
  error?: string
  helperText?: string
  placeholder?: string
  disabled?: boolean
  value: string
  onChange: (value: string) => void
}

// 상태 배지 Props
interface StatusBadgeProps {
  status: "NEW" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "solid"
}

// 우선순위 배지 Props
interface PriorityBadgeProps {
  priority: "LOW" | "MEDIUM" | "HIGH"
  size?: "sm" | "md" | "lg"
}

// 카드 Props (일반)
interface CardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

// 버튼 Props
interface ButtonProps {
  variant: "primary" | "secondary" | "danger" | "ghost"
  size: "sm" | "md" | "lg"
  disabled?: boolean
  loading?: boolean
  onClick: () => void
  children: React.ReactNode
}

// 테이블 Props
interface TableProps {
  columns: ColumnDef[]
  data: any[]
  isLoading?: boolean
  onRowClick?: (row: any) => void
}

// 필터 Props
interface FilterBarProps {
  filters: FilterOption[]
  selectedFilter: string
  onFilterChange: (filter: string) => void
}

// 정렬 Props
interface SortDropdownProps {
  options: SortOption[]
  selectedSort: string
  onSortChange: (sort: string) => void
}

// 통계 카드 Props
interface StatCardProps {
  title: string
  value: number | string
  icon?: React.ReactNode
  trend?: number
  trendLabel?: string
  format?: "number" | "currency" | "percentage"
}

// 타임라인 Props
interface TimelineProps {
  logs: TimelineLog[]
  variant?: "vertical" | "horizontal"
}

// 이미지 갤러리 Props
interface ImageGalleryProps {
  images: string[]
  editable?: boolean
  onDelete?: (index: number) => void
  onDownload?: (url: string) => void
}

// 드래그드롭 Props
interface DragDropZoneProps {
  onDrop: (files: File[]) => void
  accept?: string[]
  maxFiles?: number
  maxSize?: number
}
```

---

## 컴포넌트 재사용 분석

| 공통 컴포넌트 | 사용 페이지 | 사용 횟수 |
|-------------|----------|---------|
| Button | 모든 페이지 | 50+ |
| Badge | Tenant(3), Admin(8), Vendor(1) | 12+ |
| FormInput | Tenant(1), Admin(2) | 15+ |
| StatusBadge | Tenant(2), Admin(3), Vendor(1) | 6+ |
| PriorityBadge | Tenant(2), Admin(3), Vendor(1) | 6+ |
| Card | Tenant(3), Admin(8), Vendor(1) | 12+ |
| Timeline | Tenant(1), Admin(2) | 3 |
| StatCard | Admin(5) | 5 |
| Chart | Admin(1) | 1 |
| ContractorInfoCard | Tenant(1), Admin(3) | 4 |

**결론**: Button, Badge, Card, FormInput은 매우 높은 재사용률을 보이므로 특히 철저한 QA 필요.

---

**작성자**: Claude Code
**버전**: 1.0
**최종 업데이트**: 2026-03-15
