'use client'

import { StatsCard } from './StatsCard'

interface KPIGridProps {
  stats: Array<{
    title: string
    value: string | number
    subtext?: string
    icon?: string
  }>
}

export function KPIGrid({ stats }: KPIGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          subtext={stat.subtext}
          icon={stat.icon}
        />
      ))}
    </div>
  )
}
