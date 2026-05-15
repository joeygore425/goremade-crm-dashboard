'use client'

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon?: string
  trend?: number
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-gray-400 text-sm font-medium mb-3">{title}</div>
          <div className="text-4xl font-bold">{value}</div>
          {subtitle && (
            <div className="text-gray-500 text-xs mt-3">{subtitle}</div>
          )}
        </div>
        {icon && (
          <div className="text-3xl ml-4">{icon}</div>
        )}
      </div>
      {trend !== undefined && (
        <div className={`mt-4 text-sm ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  )
}
