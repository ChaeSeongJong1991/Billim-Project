# Billim Frontend 구조 설계 - 실행 요약

**작성일**: 2026-03-15
**기준**: UI-PLAN.md (페이지 구조 섹션)
**담당**: Claude Code

---

## 📊 프로젝트 규모

### 생성될 파일 수

| 카테고리 | 개수 | 비고 |
|---------|------|------|
| **페이지** | 17개 | Next.js page.tsx |
| **페이지별 컴포넌트** | 54개 | 페이지 내부에서만 사용 |
| **공통 컴포넌트** | 44개 | 여러 페이지에서 재사용 |
| **Custom Hooks** | 5개 | 신규 (기존 4개 + 신규 5개) |
| **유틸리티/Lib** | 5개 | 기존 일부 확장 |
| **레이아웃** | 3개 | Tenant, Admin, Vendor |
| **총합** | **128개 파일** | |

---

## 🏗️ 폴더 구조

```
frontend/src/
├── app/
│   ├── tenant/           [임차인]    4 pages + 8 components
│   ├── admin/            [관리자]    7 pages + 34 components
│   └── vendor/           [협력업체]  1 page + 4 components
│
├── components/
│   ├── ui/               [shadcn]    11 components
│   ├── workorder/        [민원]      6 components
│   ├── contractor/       [업체]      3 components
│   ├── dashboard/        [대시보드]  3 components
│   ├── form/             [폼]        6 components
│   ├── upload/           [업로드]    4 components
│   ├── layout/           [레이아웃]  5 components
│   └── common/           [기타]      6 components
│
├── hooks/                [Hooks]     9 total (4 existing + 5 new)
├── lib/                  [유틸]      5 files
└── store/                [상태]      1 file
```

---

## 📄 페이지 구조 (Next.js App Router)

### Tenant (임차인) - 4개 페이지

```
/tenant/dashboard           ← TenantDashboardPage
/tenant/work-orders         ← WorkOrderListPage
/tenant/work-orders/create  ← CreateWorkOrderPage
/tenant/work-orders/[id]    ← DetailPage
```

**목적**: 임차인이 자신의 민원 상태를 추적하고 새로운 요청을 제출

---

### Admin (관리자) - 7개 페이지

```
/admin/dashboard                           ← DashboardPage
/admin/maintenance/workorders              ← KanbanBoardPage
/admin/maintenance/workorders/[id]         ← DetailPage
/admin/maintenance/contractors             ← ContractorListPage
/admin/maintenance/contractors/[id]        ← ContractorDetailPage
/admin/maintenance/guides                  ← GuidesPage
/admin/maintenance/guides/create           ← CreateGuidePage
```

**목적**: 관리자가 모든 민원과 업체를 중앙집중식으로 관리

---

### Vendor (협력업체) - 1개 페이지

```
/vendor/work-orders  ← WorkOrderListPage
```

**목적**: 협력업체가 배정받은 민원을 관리하고 상태 업데이트

---

## 🧩 컴포넌트 분류

### 공통 컴포넌트 (44개)

#### UI 기초 (11개)
shadcn/ui 래퍼: Button, Input, Select, Card, Badge, Dialog, Label, Checkbox, RadioGroup, Separator, DatePicker

#### 도메인별 (33개)
- **workorder** (6): StatusBadge, PriorityBadge, WorkOrderCard, FilterBar, SortDropdown, Timeline
- **contractor** (3): ContractorInfoCard, RatingDisplay, ContractorBadge
- **dashboard** (3): StatCard, Chart, EmptyState
- **form** (6): FormInput, FormSelect, FormTextArea, FormCheckbox, FormRadioGroup, FormError
- **upload** (4): ImageUpload, ImagePreview, DragDropZone, FilePreview
- **layout** (5): Header, Sidebar, Navigation, PageHeader, Container
- **common** (6): Loading, Skeleton, Toast, Modal, ConfirmDialog, EmptyState

### 페이지별 컴포넌트 (54개)

#### Tenant (8개)
WorkOrderForm, ImageUploadSection, FormActions, ProgressBar, BasicInfoCard, DescriptionCard, ContractorCard (domain), TimelineLog

#### Admin (34개)
- Dashboard (4): KPICard, CategoryChart, RecentWorkOrderTable, TopContractorStats
- Board (6): WorkOrderBoard, WorkOrderColumn, WorkOrderCardDraggable, FilterBar, ViewToggle, BulkActions
- Detail (7): WorkOrderInfoCard, ContractorAssignCard, RecommendedContractors, TimeMetrics, AttachmentSection, TimelineSection, AdminActions
- Contractor (8): ContractorSearch, ContractorTable, Pagination, ContractorHeader, ContractorForm, PerformanceStats, AssignedWorkOrders, DeleteButton
- Guide (9): GuideHeader, SortDropdown, MaintenanceGuideCard, GuideForm, DurationInput, RoomCheckbox, FilterBar (guide), FormActions (guide), (x2 more TBD)

#### Vendor (4개)
ContractorWorkOrderCard, FilterBar, StatusChangeButton, (1 more TBD)

---

## 🎯 구현 로드맵

### Phase 1: 공통 기반 (1주)
**우선순위**: 🔴 필수

1. Form 컴포넌트 (FormInput, Select, TextArea, Checkbox, RadioGroup)
2. Upload 컴포넌트 (ImageUpload, DragDropZone, ImagePreview)
3. Common 컴포넌트 (Loading, Skeleton, Toast, Modal, ConfirmDialog)
4. Badge/Status 컴포넌트 (StatusBadge, PriorityBadge)

**산출물**: 18-20개 공통 컴포넌트

---

### Phase 2: Tenant 페이지 (1.5주)
**우선순위**: 🔴 필수

1. Layout & Header
2. `/tenant/dashboard`
3. `/tenant/work-orders` (목록)
4. `/tenant/work-orders/create` (폼)
5. `/tenant/work-orders/[id]` (상세)

**산출물**: 4개 페이지 + 8개 컴포넌트

---

### Phase 3: Admin 페이지 (2주)
**우선순위**: 🔴 필수

1. Layout & Header (기존 확장)
2. `/admin/dashboard`
3. `/admin/maintenance/workorders` (보드 뷰)
4. `/admin/maintenance/workorders/[id]`
5. `/admin/maintenance/contractors` (목록)
6. `/admin/maintenance/contractors/[id]`
7. `/admin/maintenance/guides` (목록)
8. `/admin/maintenance/guides/create`

**산출물**: 7개 페이지 + 34개 컴포넌트

---

### Phase 4: Vendor 페이지 (1주)
**우선순위**: 🟡 중간

1. Layout & Header
2. `/vendor/work-orders`

**산출물**: 1개 페이지 + 4개 컴포넌트

---

### Phase 5: 최적화 & QA (1주)
**우선순위**: 🟡 중간

1. 레이아웃 컴포넌트 완성 (Header, Sidebar, Navigation)
2. 반응형 레이아웃 테스트 (mobile 375px, tablet 768px, desktop 1024px+)
3. 접근성 검사 (a11y - axe DevTools)
4. 성능 최적화 (번들, 이미지, 메모이제이션)

**산출물**: 5개 레이아웃 컴포넌트 + 테스트 보고서

---

## 📅 일정 추정

| Phase | 작업 | 소요 시간 |
|-------|------|---------|
| 1 | 공통 기반 | 1주 (40시간) |
| 2 | Tenant | 1.5주 (60시간) |
| 3 | Admin | 2주 (80시간) |
| 4 | Vendor | 1주 (40시간) |
| 5 | 최적화 | 1주 (40시간) |
| **Total** | | **6.5주 (260시간)** |

**팀 규모**: 1명 개발자 기준
**동시 작업 가능**: Phase 1 완료 후 Phase 2, 3 병렬 진행 가능 (2명 팀 가정)

---

## 🔑 핵심 설계 원칙

### 1. Domain-Driven Structure
- 각 도메인 (tenant, admin, vendor)별 독립적 폴더
- 도메인별 layout.tsx로 UI 일관성 유지
- 도메인 간 컴포넌트 간섭 최소화

### 2. Reusable Components
- 공통 컴포넌트는 `components/` 중앙 집중 관리
- 페이지별 컴포넌트는 `app/page/components/` 하위에 위치
- 3회 이상 재사용 시 공통 컴포넌트로 승격

### 3. Type Safety
- 모든 Props는 TypeScript 인터페이스로 정의
- Zod로 런타임 검증 (폼 입력, API 응답)
- `types.ts` 파일로 도메인별 타입 관리

### 4. Immutability & State Management
- React 불변성 원칙 준수 (spread operator)
- Zustand로 전역 상태 (auth, notifications)
- React Query로 서버 상태 관리

### 5. Performance
- React.memo로 불필요한 리렌더 방지
- useCallback으로 함수 메모이제이션
- next/image로 이미지 최적화
- 코드 스플리팅 및 lazy loading

### 6. Accessibility
- 색상만으로 정보 전달 금지 (아이콘 함께)
- 모든 폼에 label 요소
- 버튼에 aria-label
- 키보드 네비게이션 지원
- 포커스 상태 명확 (2px blue outline)

### 7. Responsive Design
- Tailwind CSS 기반 mobile-first
- Breakpoints: sm(640), md(768), lg(1024), xl(1280)
- 모든 컴포넌트 반응형 테스트 (375px, 768px, 1024px)

---

## 🔗 컴포넌트 의존성 최소화

```
❌ 나쁜 예 (순환 의존성)
WorkOrderCard → Timeline → WorkOrderCard

✅ 좋은 예 (단방향)
WorkOrderCard → Timeline (Timeline은 독립적)
WorkOrderCard → StatusBadge (StatusBadge는 공통)
```

**규칙**:
- 페이지 컴포넌트 → 공통 컴포넌트 (OK)
- 공통 컴포넌트 → 페이지 컴포넌트 (NG)
- 페이지 컴포넌트 → 다른 페이지 컴포넌트 (NG)

---

## 📝 파일 명명 규칙

| 유형 | 패턴 | 예시 |
|------|------|------|
| 페이지 | `page.tsx` | `app/tenant/dashboard/page.tsx` |
| 레이아웃 | `layout.tsx` | `app/tenant/layout.tsx` |
| 컴포넌트 | `PascalCase.tsx` | `WorkOrderCard.tsx` |
| Hook | `useCamelCase.ts` | `useWorkOrders.ts` |
| 유틸 | `camelCase.ts` | `validation.ts` |
| 타입 | `types.ts` 또는 `FileName.types.ts` | `workorder.types.ts` |

---

## ✅ 검증 체크리스트

### 폴더 구조
- [ ] 모든 페이지가 `app/` 하위의 올바른 경로에 위치
- [ ] 각 페이지별 컴포넌트가 `components/` 하위에 정리
- [ ] 공통 컴포넌트가 `components/{domain}/` 구조로 정리
- [ ] Custom Hooks가 `hooks/` 디렉토리에 위치
- [ ] 유틸 파일이 `lib/` 디렉토리에 위치

### 파일 품질
- [ ] 모든 컴포넌트가 TypeScript로 작성
- [ ] Props 인터페이스 정의됨
- [ ] 이뮬러빌리티 원칙 적용 (spread operator)
- [ ] 에러 핸들링 포함
- [ ] 입력 검증 포함 (zod)
- [ ] JSDoc 주석 포함

### 성능
- [ ] React.memo 적용 (필요시)
- [ ] useCallback 적용 (필요시)
- [ ] next/image 사용
- [ ] 번들 크기 최적화

### 접근성
- [ ] 모든 버튼에 aria-label
- [ ] 폼 입력에 label 요소
- [ ] 색상 + 아이콘 (중복 표시)
- [ ] 키보드 네비게이션 지원
- [ ] 포커스 상태 명확
- [ ] prefers-reduced-motion 고려

### 테스트
- [ ] 각 컴포넌트 단위 테스트 (선택)
- [ ] 반응형 레이아웃 테스트
- [ ] 브라우저 호환성 테스트
- [ ] 접근성 스캔 (axe DevTools)

---

## 📚 문서 참고

| 문서 | 내용 |
|------|------|
| `UI-PLAN.md` | 디자인 시스템, 페이지 레이아웃, 컴포넌트 명세 |
| `FRONTEND-STRUCTURE.md` | 전체 폴더 구조, 파일 목록, 구현 순서 |
| `FOLDER-TREE.txt` | 시각적 폴더 트리 구조 |
| `COMPONENT-HIERARCHY.md` | 페이지별 컴포넌트 계층도, Props 정의 |
| `IMPLEMENTATION-SUMMARY.md` | 이 문서 - 실행 요약 |

---

## 🚀 실행 명령

```bash
# 1. Frontend 디렉토리로 이동
cd frontend

# 2. 의존성 설치 (이미 설치되어 있다면 스킵)
npm install

# 3. 개발 서버 시작
npm run dev

# 4. 빌드
npm run build

# 5. 린팅
npm run lint

# 6. 타입 체크
npm run type-check
```

---

## 💡 주의사항

### 피해야 할 패턴

1. **Prop Drilling**: 깊은 중첩에서 props 전달
   - 해결: Context API 또는 Zustand 사용

2. **Large Components**: 800줄 이상의 파일
   - 해결: 작은 단위로 분할

3. **Deep Nesting**: 4단계 이상의 중첩
   - 해결: 컴포넌트 추출

4. **Mutation**: 직접 객체/배열 수정
   - 해결: spread operator 사용

5. **Hardcoded Values**: 상수값 하드코딩
   - 해결: 상수 파일 또는 환경변수

### 권장 패턴

1. **Small, Focused Components**: 단일 책임 원칙
2. **Immutable State Updates**: ...spread 문법
3. **Type Safety**: TypeScript + Zod
4. **Error Handling**: try-catch + 사용자 친화적 메시지
5. **Performance**: React.memo, useCallback, useMemo

---

## 📞 연락처 & 지원

**문의사항**: 구조 설계 관련 사항은 `FRONTEND-STRUCTURE.md` 참고
**기술 문제**: `UI-PLAN.md`의 디자인 시스템 참고

---

## 📈 성공 지표

| 지표 | 목표 | 측정 방법 |
|------|------|---------|
| 컴포넌트 재사용률 | 70%+ | 공통 컴포넌트 사용 횟수 |
| 페이지 로딩 시간 | <3초 | Lighthouse 측정 |
| 번들 크기 | <100KB (gzip) | webpack-bundle-analyzer |
| 접근성 스코어 | 95+ | axe DevTools |
| 테스트 커버리지 | 70%+ | Jest 리포트 |

---

**작성자**: Claude Code
**버전**: 1.0
**최종 업데이트**: 2026-03-15
**상태**: 준비 완료 (Implementation Ready)
