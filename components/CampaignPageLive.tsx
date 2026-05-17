'use client';
import React, { useState, useEffect } from 'react';

interface Trainer { id: string; name: string; city: string; email: string; delivery_status?: string; reply_status?: string; stage?: string; }

export default function CampaignPageLive() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 10000); return () => clearInterval(i); }, []);

  const fetchData = async () => {
    try { const res = await fetch('/api/campaigns'); if (!res.ok) throw new Error(`HTTP ${res.status}`); const data = await res.json(); setTrainers(data || []); setLoading(false); } catch { setLoading(false); }
  };

  if (loading) return <div className="text-gray-400">Loading campaign data...</div>;

  const delivered = trainers.filter(t => t.delivery_status === 'delivered').length;
  const bounced = trainers.filter(t => t.delivery_status === 'bounced').length;
  const delayed = trainers.filter(t => t.delivery_status === 'delayed').length;
  const replied = trainers.filter(t => t.reply_status === 'replied').length;
  const total = trainers.length;
  const rate = total > 0 ? Math.round((replied / total) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-6"><p className="text-gray-400 text-sm mb-2">Total Sent</p><p className="text-3xl font-bold text-white">{total}</p></div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg p-6"><p className="text-gray-400 text-sm mb-2">Delivered</p><p className="text-3xl font-bold text-white">{delivered}</p></div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-lg p-6"><p className="text-gray-400 text-sm mb-2">Delayed</p><p className="text-3xl font-bold text-white">{delayed}</p></div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-lg p-6"><p className="text-gray-400 text-sm mb-2">Bounced</p><p className="text-3xl font-bold text-white">{bounced}</p></div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg p-6"><p className="text-gray-400 text-sm mb-2">Conversion</p><p className="text-3xl font-bold text-white">{rate}%</p></div>
      </div>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Trainers Contacted ({total})</h2>
        <div className="overflow-x-auto bg-gray-900/50 border border-gray-800 rounded-lg">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-800"><th className="px-4 py-3 text-left text-gray-400">Name</th><th className="px-4 py-3 text-left text-gray-400">City</th><th className="px-4 py-3 text-left text-gray-400">Email</th><th className="px-4 py-3 text-left text-gray-400">Status</th><th className="px-4 py-3 text-left text-gray-400">Reply</th></tr></thead>
            <tbody>{trainers.map(t => (
              <tr key={t.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="px-4 py-3 text-white">{t.name}</td><td className="px-4 py-3 text-gray-400">{t.city}</td><td className="px-4 py-3 text-gray-400 font-mono text-xs">{t.email}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${t.delivery_status === 'delivered' ? 'text-green-400 bg-green-400/10' : t.delivery_status === 'bounced' ? 'text-red-400 bg-red-400/10' : 'text-gray-400 bg-gray-400/10'}`}>{t.delivery_status || 'pending'}</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${t.reply_status === 'replied' ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-400/10'}`}>{t.reply_status === 'replied' ? '✓ Replied' : 'No reply'}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
