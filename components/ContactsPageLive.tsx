'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Direct Supabase connection
const supabase = createClient(
  'https://ulrgyupbhkmuzrcpzaov.supabase.co',
  'sb_publishable_RdVPN_xVcquZFhuXlZmKvg_KgRBSHkX'
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
  created_at?: string;
}

export default function ContactsPageLive() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrainers();
    const interval = setInterval(fetchTrainers, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTrainers = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('trainer_prospects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error('Supabase error:', fetchError);
        setError(fetchError.message);
      } else {
        console.log('Loaded trainers:', data?.length);
        setTrainers(data || []);
        setError(null);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading trainers...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading trainers: {error}</div>;
  }

  if (trainers.length === 0) {
    return <div className="text-gray-400 p-4">No trainers found in database</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trainers List */}
      <div className="lg:col-span-2">
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">City</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {trainers.map((trainer) => (
                  <tr
                    key={trainer.id}
                    onClick={() => setSelectedTrainer(trainer)}
                    className="border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition"
                  >
                    <td className="px-4 py-3">{trainer.name}</td>
                    <td className="px-4 py-3 text-gray-400">{trainer.city}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{trainer.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        trainer.stage === 'onboarded' ? 'bg-green-500/20 text-green-400' :
                        trainer.stage === 'booked' ? 'bg-blue-500/20 text-blue-400' :
                        trainer.stage === 'interested' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {trainer.stage || 'prospect'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-400">
          Showing {trainers.length} trainers
        </div>
      </div>

      {/* Details Panel */}
      {selectedTrainer && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-xl font-bold mb-4">{selectedTrainer.name}</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">City</p>
              <p className="text-white">{selectedTrainer.city}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="text-white break-all">{selectedTrainer.email}</p>
            </div>
            {selectedTrainer.instagram && (
              <div>
                <p className="text-gray-500">Instagram</p>
                <p className="text-white">{selectedTrainer.instagram}</p>
              </div>
            )}
            {selectedTrainer.website && (
              <div>
                <p className="text-gray-500">Website</p>
                <p className="text-white break-all">{selectedTrainer.website}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500">Stage</p>
              <p className="text-white">{selectedTrainer.stage || 'prospect'}</p>
            </div>
            <div>
              <p className="text-gray-500">Delivery Status</p>
              <p className="text-white">{selectedTrainer.delivery_status || 'pending'}</p>
            </div>
            <div>
              <p className="text-gray-500">Reply Status</p>
              <p className="text-white">{selectedTrainer.reply_status || 'no_reply'}</p>
            </div>
            {selectedTrainer.notes && (
              <div>
                <p className="text-gray-500">Notes</p>
                <p className="text-white">{selectedTrainer.notes}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSelectedTrainer(null)}
            className="mt-6 w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition text-sm"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
