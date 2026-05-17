'use client';
import React, { useState, useEffect } from 'react';

interface TokenUsage { agent_id: string; path: string; tokens_used: number; cost: number; date: string; }

export default function TokenUsagePageLive() {
  const [usage, setUsage] = useState<TokenUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsage(); const i = setInterval(fetchUsage, 10000); return () => clearInterval(i); }, []);

  const fetchUsage = async () => {
    try { const res = await fetch('/api/token-usage'); if (!res.ok) throw new Error(`HTTP ${res.status}`); const data = await res.json(); setUsage(data || []); setLoading(false); } catch { setLoading(false); }
  };

  if (loading) return <div className="text-gray-400">Loading token usage...</div>;

  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
  let tToday=0,tWeek=0,tMonth=0;
  const breakdown: {[k:string]:number} = {};
  usage.forEach(u => {
    if (u.date === today) tToday += u.tokens_used;
    if (u.date >= weekAgo) tWeek += u.tokens_used;
    if (u.date >= monthAgo) { tMonth += u.tokens_used; breakdown[u.path] = (breakdown[u.path]||0) + u.tokens_used; }
  });
  const est = (t: number) => (t * 0.00000267).toFixed(4);

  return (
    <div className="space-y-8">
      <div><h2 className="text-2xl font-bold text-white mb-4">Claude API Usage (Ricky)</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-6"><p className="text-gray-400 text-sm mb-2">Today</p><p className="text-3xl font-bold text-white">{tToday.toLocaleString()}</p><p className="text-xs text-blue-400 mt-1">${est(tToday)}</p></div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg p-6"><p className="text-gray-400 text-sm mb-2">This Week</p><p className="text-3xl font-bold text-white">{tWeek.toLocaleString()}</p><p className="text-xs text-purple-400 mt-1">${est(tWeek)}</p></div>
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg p-6"><p className="text-gray-400 text-sm mb-2">This Month</p><p className="text-3xl font-bold text-white">{tMonth.toLocaleString()}</p><p className="text-xs text-orange-400 mt-1">${est(tMonth)}</p></div>
        </div>
      </div>
      {Object.keys(breakdown).length > 0 && <div><h3 className="text-xl font-bold text-white mb-4">Usage by Task</h3><div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-gray-800"><th className="px-6 py-3 text-left text-gray-400">Task</th><th className="px-6 py-3 text-right text-gray-400">Tokens</th><th className="px-6 py-3 text-right text-gray-400">Cost</th></tr></thead><tbody>{Object.entries(breakdown).sort(([,a],[,b])=>b-a).map(([p,t])=>(<tr key={p} className="border-b border-gray-800"><td className="px-6 py-3 text-white">{p}</td><td className="px-6 py-3 text-right text-gray-300">{t.toLocaleString()}</td><td className="px-6 py-3 text-right text-blue-400">${est(t)}</td></tr>))}</tbody></table></div></div>}
      {usage.length === 0 && <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center text-gray-500"><p>No token usage data yet.</p></div>}
    </div>
  );
}
