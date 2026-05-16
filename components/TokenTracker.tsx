'use client'

import { useEffect, useState } from 'react'
import { supabase, ApiTokenTracker } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'
import ErrorBoundary from './ErrorBoundary'

interface TokenStats {
  totalTokens: number
  totalCost: number
  byService: {
    [key: string]: { tokens: number; cost: number; requests: number }
  }
}

export default function TokenTracker() {
  const [tokens, setTokens] = useState<ApiTokenTracker[]>([])
  const [stats, setStats] = useState<TokenStats>({
    totalTokens: 0,
    totalCost: 0,
    byService: {},
  })
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchTokens = async () => {
      try {
        const { data, error } = await supabase
          .from('api_token_tracker')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        
        setTokens(data || [])

        // Calculate stats
        const stats: TokenStats = {
          totalTokens: 0,
          totalCost: 0,
          byService: {},
        }

        data?.forEach(token => {
          stats.totalTokens += token.tokens_used || 0
          stats.totalCost += token.cost_dollars || 0

          if (!stats.byService[token.service_name]) {
            stats.byService[token.service_name] = {
              tokens: 0,
              cost: 0,
              requests: 0,
            }
          }

          stats.byService[token.service_name].tokens += token.tokens_used || 0
          stats.byService[token.service_name].cost += token.cost_dollars || 0
          stats.byService[token.service_name].requests += 1
        })

        setStats(stats)
      } catch (error) {
        console.error('Error fetching tokens:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [mounted])

  if (!mounted || loading) {
    return <div className="text-gray-400">Loading token usage...</div>
  }

  return (
    <ErrorBoundary>
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="text-gray-400 text-sm mb-2">Total Tokens Used</div>
          <div className="text-3xl font-bold">{stats.totalTokens.toLocaleString()}</div>
          <div className="text-gray-500 text-xs mt-2">All-time usage</div>
        </div>
        <div className="stat-card">
          <div className="text-gray-400 text-sm mb-2">Total Cost</div>
          <div className="text-3xl font-bold">{formatCurrency(stats.totalCost)}</div>
          <div className="text-gray-500 text-xs mt-2">Estimated cost</div>
        </div>
        <div className="stat-card">
          <div className="text-gray-400 text-sm mb-2">API Calls</div>
          <div className="text-3xl font-bold">{tokens.length}</div>
          <div className="text-gray-500 text-xs mt-2">Total requests</div>
        </div>
      </div>

      {/* Service Breakdown */}
      <div className="stat-card">
        <h3 className="text-lg font-semibold mb-4">Usage by Service</h3>
        <div className="space-y-4">
          {Object.entries(stats.byService).map(([service, data]) => (
            <div key={service}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-300">{service}</span>
                <span className="text-sm text-gray-400">
                  {data.requests} requests · {formatCurrency(data.cost)}
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-700"
                  style={{
                    width: `${(data.tokens / Math.max(stats.totalTokens, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent API Calls */}
      <div className="stat-card overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Recent API Calls</h3>
        <table className="w-full text-sm">
          <thead className="border-b border-slate-700">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Service</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Endpoint</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Method</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-300">Tokens</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-300">Cost</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {tokens.length > 0 ? (
              tokens.map(token => (
                <tr key={token.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{token.service_name}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs font-mono">
                    {token.endpoint || '-'}
                  </td>
                  <td className="py-3 px-4 text-gray-400">{token.method || '-'}</td>
                  <td className="py-3 px-4 text-right text-blue-400 font-mono">
                    {token.tokens_used.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    {formatCurrency(token.cost_dollars)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        token.response_status && token.response_status < 300
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {token.response_status || 'Error'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {formatDate(token.created_at)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  No API usage logged yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cost Forecast */}
      <div className="stat-card">
        <h3 className="text-lg font-semibold mb-4">Cost Forecast</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-gray-400 text-sm mb-2">Current Usage</div>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalCost)}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-2">Monthly Projection</div>
            <div className="text-2xl font-bold">
              {formatCurrency((stats.totalCost / Math.max(tokens.length, 1)) * 30)}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-2">Annual Projection</div>
            <div className="text-2xl font-bold">
              {formatCurrency((stats.totalCost / Math.max(tokens.length, 1)) * 365)}
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  )
}
