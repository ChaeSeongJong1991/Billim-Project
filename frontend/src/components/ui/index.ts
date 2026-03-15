/**
 * UI Component Exports
 * Central export point for all UI components
 */

// Base components (shadcn/ui)
export { Button, buttonVariants } from './button'
export type { } from './button'

export { Input } from './input'
export type { } from './input'

export { Badge, badgeVariants } from './badge'
export type { BadgeProps } from './badge'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card'
export type { } from './card'

export { Label } from './label'
export type { } from './label'

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from './dialog'
export type { } from './dialog'

export { Separator } from './separator'
export type { } from './separator'

// Custom components
export { StatusBadge, statusBadgeVariants } from './StatusBadge'
export type { StatusBadgeProps } from './StatusBadge'

export { Timeline, TimelineItem, timelineVariants, timelineItemVariants } from './Timeline'
export type { TimelineProps, TimelineItemProps } from './Timeline'

export { ImageGallery } from './ImageGallery'
export type { ImageGalleryProps } from './ImageGallery'

export { WorkOrderCard } from './WorkOrderCard'
export type { WorkOrderCardProps } from './WorkOrderCard'

export {
  FormInput,
  FormSelect,
  FormTextArea,
  FormRadioGroup,
  FormCheckbox,
} from './FormComponents'
export type {
  FormInputProps,
  FormSelectProps,
  FormTextAreaProps,
  FormRadioGroupProps,
  FormCheckboxProps,
} from './FormComponents'

export { Skeleton, LoadingState, LoadingSpinner } from './LoadingState'
export type { SkeletonProps, LoadingStateProps, LoadingSpinnerProps } from './LoadingState'

export { EmptyState, ErrorState, NoResultsState } from './EmptyState'
export type { EmptyStateProps, ErrorStateProps, NoResultsStateProps } from './EmptyState'

// Types
export type {
  WorkOrderStatus,
  PriorityLevel,
  MaintenanceCategory,
  StatusBadgeVariant,
  StatusBadgeSize,
  TimelineLog,
  GalleryImage,
  WorkOrder,
  FormFieldError,
  StateVariant,
} from './types'
