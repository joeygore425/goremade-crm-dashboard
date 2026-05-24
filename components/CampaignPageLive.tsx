'use client';
import React, { useState, useEffect } from 'react';

interface Trainer { 
  id: string; 
  name: string; 
  city: string; 
  email: string; 
  status?: string;
  response_type?: string;
  outreach_date?: string;
  response_date?: string;
}

export default function CampaignPageLive() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, contacted: 0, interested: 0, replied: 0, onboarded: 0 });

  useEffect(() => { 
    fetchData(); 
    const i = setInterval(fetchData, 10000); 
    return () => clearInterval(i); 
  }, []);

  const fetchData = async () => {
    try { 
      const res = await fetch('/api/campaigns'); 
      if (!res.ok) throw new Error(`HTTP ${res.status}`); 
      const data = await res.json(); 
      setTrainers(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const contacted = data?.filter((t: Trainer) => t.status === 'contacted' || t.outreach_date).length || 0;
      const interested = data?.filter((t: Trainer) => t.response_type === 'interested').length || 0;
      const replied = data?.filter((t: Trainer) => t.response_date).length || 0;
      const onboarded = data?.filter((t: Trainer) => t.status === 'onboarded').length || 0;
      
      setStats({ total, contacted, interested, replied, onboarded });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-gray-400">Loading campaign data...</div>;

  const { total, contacted, interested, replied, onboarded } = stats;
  const conversionRate = total > 0 ? Math.round((replied / total) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Total Prospects</p>
          <p className="text-3xl font-bold text-white">{total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Contacted</p>
          <p className="text-3xl font-bold text-white">{contacted}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Interested</p>
          <p className="text-3xl font-bold text-white">{interested}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Replied</p>
          <p className="text-3xl font-bold text-white">{replied}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Onboarded</p>
          <p className="text-3xl font-bold text-white">{onboarded}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Contact Rate</p>
          <p className="text-2xl font-bold text-blue-400">{total > 0 ? Math.round((contacted / total) * 100) : 0}%</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Response Rate</p>
          <p className="text-2xl font-bold text-green-400">{total > 0 ? Math.round((replied / total) * 100) : 0}%</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Onboarding Rate</p>
          <p className="text-2xl font-bold text-orange-400">{total > 0 ? Math.round((onboarded / total) * 100) : 0}%</p>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Trainer Pipeline ({total})</h2>
        <div className="overflow-x-auto bg-gray-900/50 border border-gray-800 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left text-gray-400">Name</th>
                <th className="px-4 py-3 text-left text-gray-400">City</th>
                <th className="px-4 py-3 text-left text-gray-400">Email</th>
                <th className="px-4 py-3 text-left text-gray-400">Status</th>
                <th className="px-4 py-3 text-left text-gray-400">Response</th>
                <th className="px-4 py-3 text-left text-gray-400">Stage</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map(t => {
                const hasReply = t.response_date ? '✓ Yes' : '—';
                const replyColor = t.response_date ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-400/10';
                const statusColor = t.status === 'onboarded' ? 'text-green-400 bg-green-400/10' : t.status === 'interested' ? 'text-blue-400 bg-blue-400/10' : 'text-gray-400 bg-gray-400/10';
                
                return (
                  <tr key={t.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-white">{t.name}</td>
                    <td className="px-4 py-3 text-gray-400">{t.city || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{t.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${statusColor}`}>
                        {t.status || 'prospect'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${replyColor}`}>
                        {hasReply}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {t.outreach_date ? new Date(t.outreach_date).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
