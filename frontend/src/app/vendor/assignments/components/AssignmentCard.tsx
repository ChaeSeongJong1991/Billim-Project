'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface Assignment {
  id: string
  title: string
  status: string
  priority?: string
  createdAt: string
}

interface AssignmentCardProps {
  assignment: Assignment
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  return (
    <Link href={`/work-orders/${assignment.id}`}>
      <Card className="cursor-pointer p-4 transition-all hover:shadow-md">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold">{assignment.title}</h3>
            <Badge>{assignment.status}</Badge>
          </div>

          {assignment.priority && (
            <p className="text-sm text-gray-600">
              우선순위: {assignment.priority}
            </p>
          )}

          <p className="text-xs text-gray-600">
            신청: {new Date(assignment.createdAt).toLocaleDateString()}
          </p>
        </div>
      </Card>
    </Link>
  )
}
