'use client'

import { useEffect, useState } from 'react'
import { supabase, OutreachCampaign } from '@/lib/supabase'
import { formatDate, formatPercent } from '@/lib/utils'
import ErrorBoundary from './ErrorBoundary'

export default function OutreachPerformance() {
  const [campaigns, setCampaigns] = useState<OutreachCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchCampaigns = async () => {
      try {
        const { data, error } = await supabase
          .from('outreach_campaigns')
          .select('*')
          .order('sent_date', { ascending: false })

        if (error) throw error
        setCampaigns(data || [])
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [mounted])

  const calculateMetrics = (campaigns: OutreachCampaign[]) => {
    if (campaigns.length === 0) return { avgOpen: 0, avgClick: 0, avgReply: 0 }
    
    const totalOpen = campaigns.reduce((sum, c) => sum + (c.open_rate || 0), 0)
    const totalClick = campaigns.reduce((sum, c) => sum + (c.click_rate || 0), 0)
    const totalReply = campaigns.reduce((sum, c) => sum + (c.reply_rate || 0), 0)

    return {
      avgOpen: totalOpen / campaigns.length,
      avgClick: totalClick / campaigns.length,
      avgReply: totalReply / campaigns.length,
    }
  }

  const metrics = calculateMetrics(campaigns)

  if (!mounted || loading) {
    return <div className="text-gray-400">Loading campaigns...</div>
  }

  return (
    <ErrorBoundary>
    <div className="space-y-6">
      {/* Overall Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="text-gray-400 text-sm mb-2">Avg Open Rate</div>
          <div className="text-3xl font-bold">{formatPercent(metrics.avgOpen)}</div>
          <div className="text-gray-500 text-xs mt-2">Across all campaigns</div>
        </div>
        <div className="stat-card">
          <div className="text-gray-400 text-sm mb-2">Avg Click Rate</div>
          <div className="text-3xl font-bold">{formatPercent(metrics.avgClick)}</div>
          <div className="text-gray-500 text-xs mt-2">Link clicks</div>
        </div>
        <div className="stat-card">
          <div className="text-gray-400 text-sm mb-2">Avg Reply Rate</div>
          <div className="text-3xl font-bold">{formatPercent(metrics.avgReply)}</div>
          <div className="text-gray-500 text-xs mt-2">Email responses</div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="stat-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-700">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Campaign Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Type</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-300">Sent</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-300">Opened</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-300">Open Rate</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-300">Clicked</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-300">Replied</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Sent Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {campaigns.length > 0 ? (
              campaigns.map(campaign => (
                <tr key={campaign.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{campaign.campaign_name}</td>
                  <td className="py-3 px-4 text-gray-400">
                    {campaign.target_type === 'trainers' ? '👨‍🏫 Trainers' : '👥 Clients'}
                  </td>
                  <td className="text-center py-3 px-4">{campaign.total_sent}</td>
                  <td className="text-center py-3 px-4">{campaign.total_opened}</td>
                  <td className="text-center py-3 px-4 font-semibold text-blue-400">
                    {formatPercent(campaign.open_rate)}
                  </td>
                  <td className="text-center py-3 px-4">{campaign.total_clicked}</td>
                  <td className="text-center py-3 px-4 font-semibold text-green-400">
                    {campaign.total_replied}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {campaign.sent_date ? formatDate(campaign.sent_date) : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400">
                  No campaigns yet. Create your first outreach campaign!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Campaign Creation Guide */}
      {campaigns.length === 0 && (
        <div className="stat-card">
          <h3 className="text-lg font-semibold mb-4">Getting Started</h3>
          <ol className="space-y-3 text-sm text-gray-300 list-decimal list-inside">
            <li>Create a batch of trainer/client prospects (via the database)</li>
            <li>Send outreach emails via Resend</li>
            <li>Create an outreach_campaign entry to track metrics</li>
            <li>Monitor open rates, click rates, and replies here</li>
          </ol>
        </div>
      )}
    </div>
    </ErrorBoundary>
  )
}
