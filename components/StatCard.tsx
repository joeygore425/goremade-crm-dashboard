'use client'

interface StatCardProps {
  label?: string
  title?: string
  value: string | number
  subtitle?: string
  change?: string
  icon?: string
  trend?: number
}

export default function StatCard({
  label,
  title,
  value,
  subtitle,
  change,
  icon,
  trend,
}: StatCardProps) {
  const displayTitle = label || title || ''
  const displaySubtitle = subtitle || change || ''

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-gray-400 text-sm font-medium mb-3">{displayTitle}</div>
          <div className="text-3xl font-bold text-white">{value}</div>
          {displaySubtitle && (
            <div className="text-gray-500 text-xs mt-3">{displaySubtitle}</div>
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
