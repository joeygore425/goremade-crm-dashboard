'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface TokenUsage {
  agent_id: string;
  path: string;
  tokens_used: number;
  cost: number;
  date: string;
}

interface AgentSummary {
  name: string;
  tokens_today: number;
  tokens_week: number;
  tokens_month: number;
  cost_today: number;
  cost_week: number;
  cost_month: number;
  breakdown: { [path: string]: number };
}

export default function TokenUsagePageLive() {
  const [usage, setUsage] = useState<TokenUsage[]>([]);
  const [agentSummary, setAgentSummary] = useState<AgentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
    const sub = supabase
      .channel('token_usage')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'token_usage' }, () => fetchUsage())
      .subscribe();
    return () => { sub.unsubscribe(); };
  }, []);

  const fetchUsage = async () => {
    const { data } = await supabase
      .from('token_usage')
      .select('*')
      .order('date', { ascending: false });

    if (data) {
      setUsage(data);
      calculateSummary(data);
    }
    setLoading(false);
  };

  const calculateSummary = (usageData: TokenUsage[]) => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let tokens_today = 0;
    let tokens_week = 0;
    let tokens_month = 0;
    let cost_today = 0;
    let cost_week = 0;
    let cost_month = 0;
    const breakdown: { [key: string]: number } = {};

    usageData.forEach(u => {
      // Daily
      if (u.date === today) {
        tokens_today += u.tokens_used;
        cost_today += u.cost || 0;
      }
      // Weekly
      if (u.date >= weekAgo) {
        tokens_week += u.tokens_used;
        cost_week += u.cost || 0;
      }
      // Monthly
      if (u.date >= monthAgo) {
        tokens_month += u.tokens_used;
        cost_month += u.cost || 0;
        breakdown[u.path] = (breakdown[u.path] || 0) + u.tokens_used;
      }
    });

    setAgentSummary({
      name: 'Ricky',
      tokens_today,
      tokens_week,
      tokens_month,
      cost_today,
      cost_week,
      cost_month,
      breakdown,
    });
  };

  if (loading) return <div className="text-gray-400">Loading token usage...</div>;

  const estimatedCost = (tokens: number) => (tokens * 0.00000267).toFixed(4); // Approx cost per token for Haiku

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      {agentSummary && (
        <>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Claude API Usage (Ricky)</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Today</p>
                <p className="text-3xl font-bold text-white">{agentSummary.tokens_today.toLocaleString()}</p>
                <p className="text-xs text-blue-400 mt-1">${estimatedCost(agentSummary.tokens_today)}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">This Week</p>
                <p className="text-3xl font-bold text-white">{agentSummary.tokens_week.toLocaleString()}</p>
                <p className="text-xs text-purple-400 mt-1">${estimatedCost(agentSummary.tokens_week)}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">This Month</p>
                <p className="text-3xl font-bold text-white">{agentSummary.tokens_month.toLocaleString()}</p>
                <p className="text-xs text-orange-400 mt-1">${estimatedCost(agentSummary.tokens_month)}</p>
              </div>
            </div>
          </div>

          {/* Breakdown by Task */}
          {Object.keys(agentSummary.breakdown).length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Usage by Task (This Month)</h3>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-6 py-3 text-left text-gray-400 font-medium">Task</th>
                      <th className="px-6 py-3 text-right text-gray-400 font-medium">Tokens</th>
                      <th className="px-6 py-3 text-right text-gray-400 font-medium">% of Total</th>
                      <th className="px-6 py-3 text-right text-gray-400 font-medium">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(agentSummary.breakdown)
                      .sort(([, a], [, b]) => b - a)
                      .map(([path, tokens]) => (
                        <tr key={path} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="px-6 py-3 text-white">{path}</td>
                          <td className="px-6 py-3 text-right text-gray-300">{tokens.toLocaleString()}</td>
                          <td className="px-6 py-3 text-right text-gray-300">
                            {agentSummary.tokens_month > 0
                              ? ((tokens / agentSummary.tokens_month) * 100).toFixed(1)
                              : 0}%
                          </td>
                          <td className="px-6 py-3 text-right text-blue-400">${estimatedCost(tokens)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Usage */}
          {usage.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-6 py-3 text-left text-gray-400 font-medium">Date</th>
                      <th className="px-6 py-3 text-left text-gray-400 font-medium">Task</th>
                      <th className="px-6 py-3 text-right text-gray-400 font-medium">Tokens</th>
                      <th className="px-6 py-3 text-right text-gray-400 font-medium">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usage.slice(0, 20).map((u, i) => (
                      <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                        <td className="px-6 py-3 text-gray-400">{u.date}</td>
                        <td className="px-6 py-3 text-white">{u.path}</td>
                        <td className="px-6 py-3 text-right text-gray-300">{u.tokens_used.toLocaleString()}</td>
                        <td className="px-6 py-3 text-right text-blue-400">${u.cost?.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {usage.length === 0 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center text-gray-500">
          <p>No token usage data yet. Usage will be tracked as tasks complete.</p>
        </div>
      )}
    </div>
  );
}
