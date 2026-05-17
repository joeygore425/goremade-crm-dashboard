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
  notes?: string;
}

export default function ContactsPageLive() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchTrainers();
    const sub = supabase
      .channel('trainers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trainer_prospects' }, () => fetchTrainers())
      .subscribe();
    return () => { sub.unsubscribe(); };
  }, []);

  const fetchTrainers = async () => {
    const { data } = await supabase.from('trainer_prospects').select('*').order('created_at', { ascending: false });
    setTrainers(data || []);
    setLoading(false);
  };

  const getStageColor = (stage?: string) => {
    switch (stage) {
      case 'onboarded':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'booked':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'interested':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'emailed':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getDeliveryColor = (status?: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-400';
      case 'bounced':
        return 'text-red-400';
      case 'delayed':
        return 'text-yellow-400';
      case 'sent':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const filteredTrainers = trainers.filter(t => {
    if (filter === 'all') return true;
    return t.stage === filter;
  });

  if (loading) return <div className="text-gray-400">Loading contacts...</div>;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Trainer List */}
      <div className="col-span-2">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            All ({trainers.length})
          </button>
          <button
            onClick={() => setFilter('interested')}
            className={`px-4 py-2 rounded ${filter === 'interested' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            Interested ({trainers.filter(t => t.stage === 'interested').length})
          </button>
          <button
            onClick={() => setFilter('booked')}
            className={`px-4 py-2 rounded ${filter === 'booked' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            Booked ({trainers.filter(t => t.stage === 'booked').length})
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTrainers.map(trainer => (
            <div
              key={trainer.id}
              onClick={() => setSelectedTrainer(trainer)}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedTrainer?.id === trainer.id
                  ? 'bg-gray-800 border-red-600'
                  : 'bg-gray-900/50 border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white">{trainer.name}</h3>
                  <p className="text-sm text-gray-400">{trainer.city}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded border ${getStageColor(trainer.stage)}`}>
                  {trainer.stage || 'prospect'}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <span className={getDeliveryColor(trainer.delivery_status)}>
                  {trainer.delivery_status === 'delivered' ? '✓' : '○'} {trainer.delivery_status || 'pending'}
                </span>
                {trainer.reply_status === 'replied' && <span className="text-green-400">Replied ✓</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedTrainer ? (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">{selectedTrainer.name}</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">City</p>
              <p className="text-white">{selectedTrainer.city}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-white font-mono text-sm break-all">{selectedTrainer.email}</p>
            </div>

            {selectedTrainer.instagram && (
              <div>
                <p className="text-gray-500 text-sm">Instagram</p>
                <a href={`https://instagram.com/${selectedTrainer.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  {selectedTrainer.instagram}
                </a>
              </div>
            )}

            {selectedTrainer.website && (
              <div>
                <p className="text-gray-500 text-sm">Website</p>
                <a href={selectedTrainer.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm break-all">
                  {selectedTrainer.website}
                </a>
              </div>
            )}

            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-500 text-sm mb-2">Status</p>
              <div className="space-y-2">
                <p className="text-white">
                  <span className="text-gray-500">Delivery:</span> {' '}
                  <span className={getDeliveryColor(selectedTrainer.delivery_status)}>
                    {selectedTrainer.delivery_status || 'pending'}
                  </span>
                </p>
                <p className="text-white">
                  <span className="text-gray-500">Reply:</span> {' '}
                  <span className={selectedTrainer.reply_status === 'replied' ? 'text-green-400' : 'text-gray-400'}>
                    {selectedTrainer.reply_status === 'replied' ? '✓ Replied' : 'No reply'}
                  </span>
                </p>
                <p className="text-white">
                  <span className="text-gray-500">Stage:</span> {' '}
                  <span className="text-blue-400">{selectedTrainer.stage || 'prospect'}</span>
                </p>
              </div>
            </div>

            {selectedTrainer.notes && (
              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-500 text-sm mb-2">Notes</p>
                <p className="text-gray-300 text-sm">{selectedTrainer.notes}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 flex items-center justify-center text-gray-500">
          <p>Select a trainer to view details</p>
        </div>
      )}
    </div>
  );
}
