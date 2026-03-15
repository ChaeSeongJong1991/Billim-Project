'use client'

import { GuideCard } from './GuideCard'
import { usePreventiveMaintenance } from '@/hooks/usePreventiveMaintenance'
import { Spinner } from '@/components/common/Spinner'
import { Error } from '@/components/common/Error'

export function MaintenanceList() {
  const { data: guides, isLoading, error } = usePreventiveMaintenance()

  if (isLoading) return <Spinner />
  if (error)
    return <Error message="가이드 목록을 불러올 수 없습니다" />

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {guides && guides.length > 0 ? (
        guides.map((guide) => <GuideCard key={guide.id} guide={guide} />)
      ) : (
        <div className="col-span-full text-center py-8 text-gray-500">
          등록된 가이드가 없습니다
        </div>
      )}
    </div>
  )
}
