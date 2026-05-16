'use client'

import { useEffect, useState } from 'react'
import { supabase, ClientProspect } from '@/lib/supabase'
import { getStatusColor, daysAgo } from '@/lib/utils'
import SearchFilter from './SearchFilter'
import ErrorBoundary from './ErrorBoundary'

export default function ClientPipeline() {
  const [clients, setClients] = useState<ClientProspect[]>([])
  const [filteredClients, setFilteredClients] = useState<ClientProspect[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    industry: 'all',
    searchText: '',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('client_prospects')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setClients(data || [])
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [mounted])

  useEffect(() => {
    let results = clients

    if (filters.status !== 'all') {
      results = results.filter(c => c.status === filters.status)
    }
    if (filters.industry !== 'all') {
      results = results.filter(c => c.industry === filters.industry)
    }
    if (filters.searchText) {
      const search = filters.searchText.toLowerCase()
      results = results.filter(
        c =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.company?.toLowerCase().includes(search)
      )
    }

    setFilteredClients(results)
  }, [clients, filters])

  const statuses = Array.from(new Set(clients.map(c => c.status).filter((s): s is string => Boolean(s))))
  const industries = Array.from(new Set(clients.map(c => c.industry).filter((i): i is string => Boolean(i))))

  if (!mounted || loading) {
    return <div className="text-gray-400">Loading clients...</div>
  }

  return (
    <ErrorBoundary>
    <div className="space-y-6">
      {/* Filters */}
      <SearchFilter
        searchText={filters.searchText}
        onSearchChange={(text) => setFilters({ ...filters, searchText: text })}
        filterOptions={[
          {
            label: 'Status',
            options: [
              { value: 'all', label: 'All Statuses' },
              ...statuses.map(s => ({ value: s ?? '', label: s ?? '' })),
            ],
            value: filters.status,
            onChange: (val) => setFilters({ ...filters, status: val }),
          },
          {
            label: 'Industry',
            options: [
              { value: 'all', label: 'All Industries' },
              ...industries.map(i => ({ value: i ?? '', label: i ?? '' })),
            ],
            value: filters.industry,
            onChange: (val) => setFilters({ ...filters, industry: val }),
          },
          {
            label: 'Placeholder',
            options: [{ value: 'all', label: 'All' }],
            value: 'all',
            onChange: () => {},
          },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card text-center">
          <div className="text-2xl font-bold text-white">{clients.length}</div>
          <div className="text-xs text-gray-400">Total Prospects</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-bold text-blue-400">
            {clients.filter(c => c.status === 'contacted').length}
          </div>
          <div className="text-xs text-gray-400">Contacted</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-bold text-amber-400">
            {clients.filter(c => c.status === 'interested').length}
          </div>
          <div className="text-xs text-gray-400">Interested</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-bold text-green-400">
            {clients.filter(c => c.status === 'active').length}
          </div>
          <div className="text-xs text-gray-400">Active</div>
        </div>
      </div>

      {/* Table */}
      <div className="stat-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-700">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Company</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Title</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Industry</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Last Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredClients.length > 0 ? (
              filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{client.name}</td>
                  <td className="py-3 px-4 text-gray-400">{client.company || '-'}</td>
                  <td className="py-3 px-4">{client.title || '-'}</td>
                  <td className="py-3 px-4">{client.industry || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {client.outreach_date
                      ? `${daysAgo(client.outreach_date)} days ago`
                      : 'Never'
                    }
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  No clients match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </ErrorBoundary>
  )
}
