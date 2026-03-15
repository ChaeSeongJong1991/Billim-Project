# UI Components Guide

## Overview

This guide documents all common UI components developed for the Billim project. Components follow the Exaggerated Minimalism design system with proper TypeScript types, accessibility features, and responsive design.

## Components Developed

### 1. StatusBadge.tsx
**Purpose**: Display work order status or priority levels with visual indicators

**Features**:
- Supports 4 work order statuses: NEW, IN_PROGRESS, COMPLETED, CANCELLED
- Supports 3 priority levels: LOW, MEDIUM, HIGH
- Icon + label display with accessibility support
- 3 size variants: sm, md, lg
- 3 style variants: default, outline, solid
- ARIA labels for screen readers

**Usage**:
```tsx
import { StatusBadge } from '@/components/ui'

// Status badge
<StatusBadge status="IN_PROGRESS" size="md" />

// Priority badge
<StatusBadge priority="HIGH" size="md" />

// Custom label
<StatusBadge status="COMPLETED" customLabel="작업중" />
```

**Color Mapping**:
- NEW: Blue (#3B82F6)
- IN_PROGRESS: Amber (#F59E0B)
- COMPLETED: Emerald (#10B981)
- CANCELLED: Slate (#64748B)
- Priority HIGH: Red (#EF4444)
- Priority MEDIUM: Orange (#F97316)
- Priority LOW: Emerald (#10B981)

---

### 2. Timeline.tsx
**Purpose**: Display chronological sequence of events/logs

**Features**:
- Vertical and horizontal layout variants
- Animated timeline line
- Support for custom icons per entry
- Actor/role information (TENANT, ADMIN, CONTRACTOR)
- Responsive design
- Empty state handling

**Usage**:
```tsx
import { Timeline } from '@/components/ui'

const logs = [
  {
    id: '1',
    timestamp: '2026-03-14 10:00',
    title: '업체 배정됨',
    description: '한수도 수리소',
    icon: '🔵',
    actor: '관리자',
    actorRole: 'ADMIN'
  }
]

<Timeline logs={logs} variant="vertical" />
```

---

### 3. ImageGallery.tsx
**Purpose**: Display and manage image collections with preview functionality

**Features**:
- Main image display with zoom area
- Thumbnail navigation
- Previous/Next navigation arrows
- Image counter
- Optional edit mode with delete capability
- Download functionality
- Responsive container sizing
- Keyboard navigation support

**Usage**:
```tsx
import { ImageGallery } from '@/components/ui'

const images = [
  { id: '1', url: '/img1.jpg', alt: 'Image 1' },
  { id: '2', url: '/img2.jpg', alt: 'Image 2' }
]

<ImageGallery
  images={images}
  editable={true}
  onDelete={(id) => handleDelete(id)}
  maxHeight="max-h-96"
/>
```

---

### 4. WorkOrderCard.tsx
**Purpose**: Display individual work order summary in card format

**Features**:
- Compact and full view modes
- Status and priority badges
- Room number, contractor, created date display
- Optional action button
- Responsive design
- Hover effects with shadow

**Usage**:
```tsx
import { WorkOrderCard } from '@/components/ui'

const workOrder = {
  id: '1',
  title: '화장실 누수',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  roomNumber: '201',
  contractorName: '한수도 수리소',
  createdAt: '2026-03-12'
}

<WorkOrderCard
  workOrder={workOrder}
  onViewDetails={(id) => navigate(`/workorder/${id}`)}
/>
```

---

### 5. FormComponents.tsx
**Purpose**: Reusable form elements with validation and accessibility

#### FormInput
```tsx
<FormInput
  label="제목"
  required={true}
  error="제목은 필수입니다"
  helperText="최대 100자"
  placeholder="예) 화장실 누수"
/>
```

#### FormSelect
```tsx
<FormSelect
  label="카테고리"
  required={true}
  options={[
    { value: 'leak', label: '누수' },
    { value: 'appliance', label: '가전' }
  ]}
  placeholder="선택하세요"
/>
```

#### FormTextArea
```tsx
<FormTextArea
  label="설명"
  required={true}
  maxLength={500}
  showCharCount={true}
  helperText="상세히 설명해주세요"
/>
```

#### FormRadioGroup
```tsx
<FormRadioGroup
  label="우선순위"
  options={[
    { value: 'low', label: '낮음' },
    { value: 'medium', label: '중간' },
    { value: 'high', label: '높음' }
  ]}
  direction="row"
/>
```

#### FormCheckbox
```tsx
<FormCheckbox
  label="약관에 동의합니다"
  helperText="필수 약관입니다"
/>
```

**Common Features**:
- Label with required indicator (*)
- Error messages (red, below field)
- Helper text (gray, smaller font)
- Focus states (blue outline)
- Disabled states (gray)
- ARIA attributes for accessibility

---

### 6. LoadingState.tsx
**Purpose**: Display loading states and skeleton placeholders

#### Skeleton Component
```tsx
<Skeleton variant="text" /> // Text skeleton
<Skeleton variant="avatar" /> // Avatar skeleton
<Skeleton variant="card" /> // Card skeleton
<Skeleton count={3} /> // Multiple skeletons
```

#### LoadingState Component
```tsx
<LoadingState variant="page" message="데이터를 불러오는 중..." />
<LoadingState variant="list" /> // List loading skeleton
<LoadingState variant="table" /> // Table loading skeleton
```

#### LoadingSpinner Component
```tsx
<LoadingSpinner size="md" message="로딩 중..." />
```

---

### 7. EmptyState.tsx
**Purpose**: Display empty, error, and no-results states

#### EmptyState
```tsx
<EmptyState
  icon={<CustomIcon />}
  title="민원이 없습니다"
  description="아직 등록된 민원이 없습니다"
  action={{
    label: '새 민원 접수',
    onClick: () => navigate('/create')
  }}
/>
```

#### ErrorState
```tsx
<ErrorState
  message="오류가 발생했습니다"
  description="나중에 다시 시도해주세요"
  retry={{
    label: '다시 시도',
    onClick: () => refetch()
  }}
/>
```

#### NoResultsState
```tsx
<NoResultsState
  searchTerm="화장실"
  onClear={() => setSearchTerm('')}
/>
```

---

## Type Definitions

All types are centralized in `types.ts`:

```typescript
// Work Order
type WorkOrderStatus = 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH'
type MaintenanceCategory = 'LEAK' | 'APPLIANCE' | 'PLUMBING' | 'ELECTRICAL' | 'OTHER'

// Timeline
interface TimelineLog {
  id: string
  timestamp: string
  title: string
  description?: string
  icon?: React.ReactNode
  actor?: string
  actorRole?: 'TENANT' | 'ADMIN' | 'CONTRACTOR'
}

// Image Gallery
interface GalleryImage {
  id: string
  url: string
  alt?: string
  thumbnail?: string
}
```

---

## Accessibility Features

All components include:
- ✓ ARIA labels and descriptions
- ✓ Semantic HTML (role, aria-label, aria-describedby)
- ✓ Keyboard navigation support
- ✓ Focus states visible (2px blue outline)
- ✓ Color not the only indicator (icons included)
- ✓ Error messages linked to inputs
- ✓ Empty/loading states with proper roles

**Testing with axe DevTools** is recommended before deployment.

---

## Responsive Design

Components are responsive for:
- **Mobile**: 375px (1 column, 16px padding)
- **Tablet**: 768px (2 columns, 24px padding)
- **Desktop**: 1024px+ (3+ columns, max-width 1280px)

All components use Tailwind CSS responsive classes (sm:, md:, lg:, xl:).

---

## Dark Mode Support

All components support dark mode with:
- `dark:` prefixed Tailwind classes
- Proper color contrast in both modes
- Tested with `prefers-color-scheme: dark`

---

## Export Structure

```typescript
// Import single components
import { StatusBadge, Timeline, ImageGallery } from '@/components/ui'

// Import with types
import { StatusBadge, type StatusBadgeProps } from '@/components/ui'

// Import all form components
import {
  FormInput,
  FormSelect,
  FormTextArea,
  FormRadioGroup,
  FormCheckbox
} from '@/components/ui'
```

---

## Integration Examples

### Work Order Creation Form
```tsx
import {
  FormInput,
  FormSelect,
  FormTextArea,
  FormRadioGroup,
  FormCheckbox,
  Button
} from '@/components/ui'

export function CreateWorkOrderForm() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    priority: 'medium'
  })

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="제목"
        required
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
      />

      <FormSelect
        label="카테고리"
        required
        options={[...]}
        value={formData.category}
        onChange={(e) => setFormData({...formData, category: e.target.value})}
      />

      <FormTextArea
        label="설명"
        required
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
      />

      <FormRadioGroup
        label="우선순위"
        options={[...]}
        value={formData.priority}
        onChange={(value) => setFormData({...formData, priority: value})}
      />

      <Button variant="default" type="submit">제출</Button>
    </form>
  )
}
```

### Work Order List with States
```tsx
import {
  WorkOrderCard,
  LoadingState,
  EmptyState,
  ErrorState
} from '@/components/ui'

export function WorkOrderList() {
  const { data, isLoading, error } = useWorkOrders()

  if (isLoading) return <LoadingState variant="list" />
  if (error) return <ErrorState retry={{ onClick: refetch }} />
  if (!data?.length) return <EmptyState action={{ label: '새 민원 접수', onClick: () => {} }} />

  return (
    <div className="grid gap-4">
      {data.map((order) => (
        <WorkOrderCard key={order.id} workOrder={order} />
      ))}
    </div>
  )
}
```

---

## File Structure

```
frontend/src/components/ui/
├── types.ts                    # Type definitions
├── index.ts                    # Export barrel
├── COMPONENT_GUIDE.md          # This file
│
├── StatusBadge.tsx             # Status/priority badges
├── Timeline.tsx                # Event timeline
├── ImageGallery.tsx            # Image viewer
├── WorkOrderCard.tsx           # Work order summary
├── FormComponents.tsx          # Form inputs (5 variants)
├── LoadingState.tsx            # Skeleton & loading UI
├── EmptyState.tsx              # Empty, error, no-results
│
├── button.tsx                  # Base button (shadcn/ui)
├── input.tsx                   # Base input (shadcn/ui)
├── badge.tsx                   # Base badge (shadcn/ui)
├── card.tsx                    # Base card (shadcn/ui)
├── label.tsx                   # Base label (shadcn/ui)
├── dialog.tsx                  # Base dialog (shadcn/ui)
└── separator.tsx               # Base separator (shadcn/ui)
```

---

## Testing Checklist

- [ ] Components render without errors
- [ ] TypeScript compilation passes
- [ ] Dark mode works correctly
- [ ] Responsive design at 375px, 768px, 1024px
- [ ] Keyboard navigation (Tab, Enter, Arrow keys)
- [ ] Screen reader testing (ARIA labels)
- [ ] axe DevTools accessibility scan
- [ ] Color contrast ratio ≥4.5:1 (text)
- [ ] Focus states visible
- [ ] Empty/loading/error states display correctly

---

## Style Consistency

All components use:
- **Spacing**: Tailwind 8px spacing scale (px-2, gap-4, etc.)
- **Colors**: Design system tokens (blue-600, amber-100, etc.)
- **Borders**: 1-2px with slate-200 (light mode) / slate-700 (dark)
- **Shadows**: Tailwind shadow-xs for subtle depth
- **Rounded**: md (0.375rem) for card corners
- **Transitions**: transition-all for interactive elements

---

## Next Steps

1. Integrate components into page templates
2. Create Storybook stories for component library
3. Add unit tests (Jest + React Testing Library)
4. Implement theming system (CSS variables)
5. Create component composition patterns
