'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatsCardsProps {
  totalTasks: number
  successCount: number
  runningCount: number
  remainingQuota: number
}

export default function StatsCards({
  totalTasks,
  successCount,
  runningCount,
  remainingQuota,
}: StatsCardsProps) {
  const stats = [
    {
      title: '总任务数',
      value: totalTasks,
      color: 'blue',
      borderColor: 'border-l-blue-500',
      textColor: 'text-gray-900',
    },
    {
      title: '成功数',
      value: successCount,
      color: 'green',
      borderColor: 'border-l-green-500',
      textColor: 'text-green-600',
    },
    {
      title: '进行中',
      value: runningCount,
      color: 'orange',
      borderColor: 'border-l-orange-500',
      textColor: 'text-orange-600',
    },
    {
      title: '剩余额度',
      value: remainingQuota,
      color: remainingQuota < 20 ? 'red' : 'purple',
      borderColor: 'border-l-purple-500',
      textColor: remainingQuota < 20 ? 'text-red-600' : 'text-purple-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className={`border-l-4 ${stat.borderColor}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
