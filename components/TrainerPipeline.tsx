'use client'

import { useEffect, useState } from 'react'
import { supabase, TrainerProspect } from '@/lib/supabase'
import { formatDate, getStatusColor, daysAgo } from '@/lib/utils'
import SearchFilter from './SearchFilter'

export default function TrainerPipeline() {
  const [trainers, setTrainers] = useState<TrainerProspect[]>([])
  const [filteredTrainers, setFilteredTrainers] = useState<TrainerProspect[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    state: 'all',
    specialty: 'all',
    searchText: '',
  })

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const { data, error } = await supabase
          .from('trainer_prospects')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setTrainers(data || [])
      } catch (error) {
        console.error('Error fetching trainers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrainers()
  }, [])

  useEffect(() => {
    let results = trainers

    if (filters.status !== 'all') {
      results = results.filter(t => t.status === filters.status)
    }
    if (filters.state !== 'all') {
      results = results.filter(t => t.state === filters.state)
    }
    if (filters.specialty !== 'all') {
      results = results.filter(t => t.specialty === filters.specialty)
    }
    if (filters.searchText) {
      const search = filters.searchText.toLowerCase()
      results = results.filter(
        t =>
          t.name.toLowerCase().includes(search) ||
          t.email.toLowerCase().includes(search)
      )
    }

    setFilteredTrainers(results)
  }, [trainers, filters])

  const statuses = Array.from(new Set(trainers.map(t => t.status)))
  const states = Array.from(new Set(trainers.map(t => t.state).filter(Boolean)))
  const specialties = Array.from(new Set(trainers.map(t => t.specialty).filter(Boolean)))

  if (loading) {
    return <div className="text-gray-400">Loading trainers...</div>
  }

  return (
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
              ...statuses.map(s => ({ value: s, label: s })),
            ],
            value: filters.status,
            onChange: (val) => setFilters({ ...filters, status: val }),
          },
          {
            label: 'State',
            options: [
              { value: 'all', label: 'All States' },
              ...states.map(s => ({ value: s, label: s })),
            ],
            value: filters.state,
            onChange: (val) => setFilters({ ...filters, state: val }),
          },
          {
            label: 'Specialty',
            options: [
              { value: 'all', label: 'All Specialties' },
              ...specialties.map(s => ({ value: s, label: s })),
            ],
            value: filters.specialty,
            onChange: (val) => setFilters({ ...filters, specialty: val }),
          },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card text-center">
          <div className="text-2xl font-bold text-white">{trainers.length}</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-bold text-blue-400">
            {trainers.filter(t => t.status === 'contacted').length}
          </div>
          <div className="text-xs text-gray-400">Contacted</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-bold text-amber-400">
            {trainers.filter(t => t.status === 'interested').length}
          </div>
          <div className="text-xs text-gray-400">Interested</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-2xl font-bold text-green-400">
            {trainers.filter(t => t.status === 'onboarded').length}
          </div>
          <div className="text-xs text-gray-400">Onboarded</div>
        </div>
      </div>

      {/* Table */}
      <div className="stat-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-700">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">State</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Specialty</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Last Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredTrainers.length > 0 ? (
              filteredTrainers.map(trainer => (
                <tr key={trainer.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{trainer.name}</td>
                  <td className="py-3 px-4 text-gray-400">{trainer.email}</td>
                  <td className="py-3 px-4">{trainer.state || '-'}</td>
                  <td className="py-3 px-4">{trainer.specialty || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getStatusColor(trainer.status)}`}>
                      {trainer.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {trainer.outreach_date 
                      ? `${daysAgo(trainer.outreach_date)} days ago`
                      : 'Never'
                    }
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  No trainers match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
