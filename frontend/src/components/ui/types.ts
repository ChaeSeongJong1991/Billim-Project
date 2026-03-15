/**
 * UI Component Types
 * Centralized type definitions for common UI patterns
 */

// Status types
export type WorkOrderStatus = 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type MaintenanceCategory = 'LEAK' | 'APPLIANCE' | 'PLUMBING' | 'ELECTRICAL' | 'OTHER'

// Badge variants
export type StatusBadgeVariant = 'default' | 'outline' | 'solid'
export type StatusBadgeSize = 'sm' | 'md' | 'lg'

// Timeline
export interface TimelineLog {
  id: string
  timestamp: string
  title: string
  description?: string
  icon?: React.ReactNode
  actor?: string
  actorRole?: 'TENANT' | 'ADMIN' | 'CONTRACTOR'
}

// Image Gallery
export interface GalleryImage {
  id: string
  url: string
  alt?: string
  thumbnail?: string
}

// Work Order
export interface WorkOrder {
  id: string
  title: string
  status: WorkOrderStatus
  priority: PriorityLevel
  category?: MaintenanceCategory
  roomNumber?: string
  contractorName?: string
  createdAt: string
  updatedAt?: string
}

// Form States
export interface FormFieldError {
  field: string
  message: string
}

// Loading & Empty States
export type StateVariant = 'loading' | 'empty' | 'error'
