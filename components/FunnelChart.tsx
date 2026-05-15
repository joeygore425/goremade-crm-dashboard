'use client'

interface Stage {
  label: string
  value: number
}

interface FunnelChartProps {
  stages: Stage[]
  color: string
}

export default function FunnelChart({ stages, color }: FunnelChartProps) {
  const maxValue = Math.max(...stages.map(s => s.value), 1)

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        const percentage = (stage.value / maxValue) * 100
        const conversionFromPrev = index > 0 
          ? ((stage.value / stages[index - 1].value) * 100).toFixed(1)
          : null

        return (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-300">{stage.label}</span>
              <div className="text-right">
                <span className="font-bold text-white">{stage.value}</span>
                {conversionFromPrev && (
                  <span className="text-xs text-gray-400 ml-2">({conversionFromPrev}%)</span>
                )}
              </div>
            </div>
            <div className="h-8 bg-slate-700 rounded-lg overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
