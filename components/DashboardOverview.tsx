'use client'

import { useState, useEffect } from 'react'
import StatCard from './StatCard'

interface Stats {
  trainersOnboarded: number
  trainerProspects: number
  clientsActive: number
  clientProspects: number
  campaignsRunning: number
  monthlyRevenue: number
  avgResponseRate: number
  tokenUsageThisMonth: number
}

export default function DashboardOverview() {
  const [stats] = useState<Stats>({
    trainersOnboarded: 0,
    trainerProspects: 50,
    clientsActive: 8,
    clientProspects: 0,
    campaignsRunning: 1,
    monthlyRevenue: 0,
    avgResponseRate: 0,
    tokenUsageThisMonth: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="text-gray-400">Loading...</div>
  }

  return (
    <div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Trainer Prospects"
          value={stats.trainerProspects}
          change="+50 this week"
          icon="👨‍🏫"
        />
        <StatCard
          label="Active Clients"
          value={stats.clientsActive}
          change="Stable"
          icon="👥"
        />
        <StatCard
          label="Campaigns Running"
          value={stats.campaignsRunning}
          change="Active now"
          icon="📧"
        />
        <StatCard
          label="Avg Response Rate"
          value={stats.avgResponseRate}
          change="Monitoring"
          icon="📊"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Campaign Status</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Emails Sent</span>
            <span className="text-white font-semibold">50 / 50</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <div className="text-sm text-gray-500">Staggered 5 minutes apart</div>
        </div>
      </div>
    </div>
  )
}
