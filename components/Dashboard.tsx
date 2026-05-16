'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'
import Header from './Header'
import ErrorBoundary from './ErrorBoundary'

const DashboardOverview = dynamic(() => import('./DashboardOverview'), {
  loading: () => <div className="text-gray-400">Loading overview...</div>,
})

const TrainerPipeline = dynamic(() => import('./TrainerPipeline'), {
  loading: () => <div className="text-gray-400">Loading trainers...</div>,
})

const ClientPipeline = dynamic(() => import('./ClientPipeline'), {
  loading: () => <div className="text-gray-400">Loading clients...</div>,
})

const OutreachPerformance = dynamic(() => import('./OutreachPerformance'), {
  loading: () => <div className="text-gray-400">Loading campaigns...</div>,
})

const TokenTracker = dynamic(() => import('./TokenTracker'), {
  loading: () => <div className="text-gray-400">Loading token usage...</div>,
})

type Tab = 'overview' | 'trainers' | 'clients' | 'campaigns' | 'tokens'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check Supabase connection
    const checkConnection = async () => {
      try {
        const { error } = await supabase
          .from('trainer_prospects')
          .select('count')
          .limit(1)
        
        if (!error) {
          console.log('✓ Supabase connected')
        }
      } catch (err) {
        console.error('Supabase connection error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    checkConnection()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {/* Tab Navigation */}
      <div className="border-b border-slate-700 sticky top-0 z-10 bg-slate-900/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex space-x-8">
            {([
              { id: 'overview', label: '📊 Overview' },
              { id: 'trainers', label: '👨‍🏫 Trainer Pipeline' },
              { id: 'clients', label: '👥 Client Pipeline' },
              { id: 'campaigns', label: '📧 Campaigns' },
              { id: 'tokens', label: '🔑 Token Usage' },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-orange-600 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ErrorBoundary>
          {activeTab === 'overview' && <DashboardOverview />}
          {activeTab === 'trainers' && <TrainerPipeline />}
          {activeTab === 'clients' && <ClientPipeline />}
          {activeTab === 'campaigns' && <OutreachPerformance />}
          {activeTab === 'tokens' && <TokenTracker />}
        </ErrorBoundary>
      </div>
    </div>
  )
}
