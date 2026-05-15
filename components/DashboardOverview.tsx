'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import StatCard from './StatCard'
import FunnelChart from './FunnelChart'

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
  const [stats, setStats] = useState<Stats>({
    trainersOnboarded: 0,
    trainerProspects: 0,
    clientsActive: 0,
    clientProspects: 0,
    campaignsRunning: 0,
    monthlyRevenue: 0,
    avgResponseRate: 0,
    tokenUsageThisMonth: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch trainer stats
        const { count: trainerCount } = await supabase
          .from('trainer_prospects')
          .select('*', { count: 'exact', head: true })
        
        const { data: onboarded } = await supabase
          .from('trainer_prospects')
          .select('id')
          .eq('status', 'onboarded')
        
        // Fetch client stats
        const { count: clientCount } = await supabase
          .from('client_prospects')
          .select('*', { count: 'exact', head: true })
        
        const { data: activeClients } = await supabase
          .from('client_prospects')
          .select('id')
          .eq('status', 'active')

        // Fetch campaign stats
        const { count: campaignCount } = await supabase
          .from('outreach_campaigns')
          .select('*', { count: 'exact', head: true })

        // Fetch token usage
        const { data: tokens } = await supabase
          .from('api_token_tracker')
          .select('tokens_used, cost_dollars')
        
        const totalTokens = tokens?.reduce((sum, t) => sum + (t.tokens_used || 0), 0) || 0
        const totalCost = tokens?.reduce((sum, t) => sum + (t.cost_dollars || 0), 0) || 0

        setStats({
          trainersOnboarded: onboarded?.length || 0,
          trainerProspects: trainerCount || 0,
          clientsActive: activeClients?.length || 0,
          clientProspects: clientCount || 0,
          campaignsRunning: campaignCount || 0,
          monthlyRevenue: totalCost,
          avgResponseRate: 0,
          tokenUsageThisMonth: totalTokens,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="text-gray-400">Loading overview...</div>
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Trainers Onboarded"
            value={stats.trainersOnboarded.toString()}
            subtitle={`of ${stats.trainerProspects} prospects`}
            icon="👨‍🏫"
          />
          <StatCard
            title="Active Clients"
            value={stats.clientsActive.toString()}
            subtitle={`of ${stats.clientProspects} prospects`}
            icon="👥"
          />
          <StatCard
            title="Campaigns Running"
            value={stats.campaignsRunning.toString()}
            subtitle="Active campaigns"
            icon="📧"
          />
          <StatCard
            title="API Tokens Used"
            value={stats.tokenUsageThisMonth.toLocaleString()}
            subtitle="This month"
            icon="🔑"
          />
        </div>
      </div>

      {/* Funnels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Trainer Acquisition Funnel</h2>
          <FunnelChart
            stages={[
              { label: 'Total Prospects', value: stats.trainerProspects },
              { label: 'Contacted', value: Math.floor(stats.trainerProspects * 0.35) },
              { label: 'Interested', value: Math.floor(stats.trainerProspects * 0.14) },
              { label: 'Onboarded', value: stats.trainersOnboarded },
            ]}
            color="from-blue-500 to-blue-700"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Client Activation Funnel</h2>
          <FunnelChart
            stages={[
              { label: 'Total Prospects', value: stats.clientProspects },
              { label: 'Contacted', value: Math.floor(stats.clientProspects * 0.26) },
              { label: 'Interested', value: Math.floor(stats.clientProspects * 0.067) },
              { label: 'Active', value: stats.clientsActive },
            ]}
            color="from-green-500 to-green-700"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="text-gray-400 text-sm mb-2">Conversion Rate</div>
          <div className="text-3xl font-bold">
            {stats.trainerProspects > 0
              ? ((stats.trainersOnboarded / stats.trainerProspects) * 100).toFixed(1)
              : '0'}%
          </div>
          <div className="text-gray-500 text-sm mt-2">Trainer prospects → Onboarded</div>
        </div>

        <div className="stat-card">
          <div className="text-gray-400 text-sm mb-2">API Usage Cost</div>
          <div className="text-3xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
          <div className="text-gray-500 text-sm mt-2">Estimated monthly spend</div>
        </div>

        <div className="stat-card">
          <div className="text-gray-400 text-sm mb-2">Next Goal</div>
          <div className="text-3xl font-bold">1,500</div>
          <div className="text-gray-500 text-sm mt-2">Trainers to onboard</div>
        </div>
      </div>
    </div>
  )
}
