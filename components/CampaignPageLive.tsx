'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Trainer {
  id: string;
  name: string;
  city: string;
  email: string;
  instagram?: string;
  website?: string;
  delivery_status?: string;
  reply_status?: string;
  stage?: string;
}

interface CampaignMetrics {
  total_sent: number;
  total_delivered: number;
  total_bounced: number;
  total_delayed: number;
  total_replied: number;
  conversion_rate: number;
}

export default function CampaignPageLive() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const sub = supabase
      .channel('trainers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trainer_prospects' }, () => fetchData())
      .subscribe();
    return () => { sub.unsubscribe(); };
  }, []);

  const fetchData = async () => {
    // Fetch trainers
    const { data: trainersData } = await supabase
      .from('trainer_prospects')
      .select('*')
      .limit(100);
    
    if (trainersData) {
      setTrainers(trainersData);
      
      // Calculate metrics
      const delivered = trainersData.filter(t => t.delivery_status === 'delivered').length;
      const bounced = trainersData.filter(t => t.delivery_status === 'bounced').length;
      const delayed = trainersData.filter(t => t.delivery_status === 'delayed').length;
      const replied = trainersData.filter(t => t.reply_status === 'replied').length;
      const total = trainersData.length;
      const conversionRate = total > 0 ? Math.round((replied / total) * 100) : 0;

      setMetrics({
        total_sent: total,
        total_delivered: delivered,
        total_bounced: bounced,
        total_delayed: delayed,
        total_replied: replied,
        conversion_rate: conversionRate,
      });
    }
    setLoading(false);
  };

  if (loading) return <div className="text-gray-400">Loading campaign data...</div>;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-400 bg-green-400/10';
      case 'bounced':
        return 'text-red-400 bg-red-400/10';
      case 'delayed':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'sent':
        return 'text-blue-400 bg-blue-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Sent</p>
            <p className="text-3xl font-bold text-white">{metrics.total_sent}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Delivered</p>
            <p className="text-3xl font-bold text-white">{metrics.total_delivered}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Delayed</p>
            <p className="text-3xl font-bold text-white">{metrics.total_delayed}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Bounced</p>
            <p className="text-3xl font-bold text-white">{metrics.total_bounced}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Conversion</p>
            <p className="text-3xl font-bold text-white">{metrics.conversion_rate}%</p>
          </div>
        </div>
      )}

      {/* Trainers Table */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Trainers Contacted ({trainers.length})</h2>
        <div className="overflow-x-auto bg-gray-900/50 border border-gray-800 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Name</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">City</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Email</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Status</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Reply</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map(trainer => (
                <tr key={trainer.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-white">{trainer.name}</td>
                  <td className="px-4 py-3 text-gray-400">{trainer.city}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{trainer.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(trainer.delivery_status)}`}>
                      {trainer.delivery_status || 'pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trainer.reply_status === 'replied' ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-400/10'
                    }`}>
                      {trainer.reply_status === 'replied' ? '✓ Replied' : 'No reply'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
