'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

interface Batch {
  id: string;
  batch_number: number;
  batch_type: string;
  status: string;
  prospects_found: number;
  emails_sent: number;
  delivery_rate: number;
  success_rate: number;
  started_at: string;
  completed_at?: string;
}

interface Contact {
  id: string;
  prospect_name: string;
  prospect_email: string;
  prospect_title?: string;
  prospect_city: string;
  prospect_company?: string;
  prospect_type: string;
  batch_number: number;
  added_at: string;
}

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [trainers, setTrainers] = useState<Contact[]>([]);
  const [clients, setClients] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'batches' | 'trainers' | 'clients'>('batches');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [batchRes, trainerRes, clientRes] = await Promise.all([
        fetch('/api/batches'),
        fetch('/api/batches/contacts?type=trainer'),
        fetch('/api/batches/contacts?type=client'),
      ]);

      if (batchRes.ok) setBatches(await batchRes.json());
      if (trainerRes.ok) setTrainers(await trainerRes.json());
      if (clientRes.ok) setClients(await clientRes.json());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10';
      case 'running':
        return 'text-blue-400 bg-blue-400/10';
      case 'failed':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const filteredTrainers = trainers.filter(
    (t) =>
      t.prospect_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.prospect_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.prospect_city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClients = clients.filter(
    (c) =>
      c.prospect_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.prospect_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.prospect_company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Campaign Batches</h1>
          <p className="text-gray-400 mb-8">Automated batch scheduling and contact tracking</p>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-800">
            <button
              onClick={() => setActiveTab('batches')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'batches'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Batch History
            </button>
            <button
              onClick={() => setActiveTab('trainers')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'trainers'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Trainers ({trainers.length})
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'clients'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Clients ({clients.length})
            </button>
          </div>

          {/* Batch History */}
          {activeTab === 'batches' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Batches</p>
                  <p className="text-3xl font-bold text-white">{batches.length}</p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Prospects</p>
                  <p className="text-3xl font-bold text-white">
                    {batches.reduce((sum, b) => sum + b.prospects_found, 0)}
                  </p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Sent</p>
                  <p className="text-3xl font-bold text-white">
                    {batches.reduce((sum, b) => sum + b.emails_sent, 0)}
                  </p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Avg Delivery</p>
                  <p className="text-3xl font-bold text-white">
                    {batches.length > 0
                      ? Math.round(
                          batches.reduce((sum, b) => sum + b.delivery_rate, 0) / batches.length
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto bg-gray-900/50 border border-gray-800 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left text-gray-400">Batch</th>
                      <th className="px-4 py-3 text-left text-gray-400">Type</th>
                      <th className="px-4 py-3 text-left text-gray-400">Status</th>
                      <th className="px-4 py-3 text-left text-gray-400">Found</th>
                      <th className="px-4 py-3 text-left text-gray-400">Sent</th>
                      <th className="px-4 py-3 text-left text-gray-400">Delivery</th>
                      <th className="px-4 py-3 text-left text-gray-400">Started</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches
                      .sort((a, b) => b.batch_number - a.batch_number)
                      .map((batch) => (
                        <tr key={batch.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="px-4 py-3 text-white font-mono">#{batch.batch_number}</td>
                          <td className="px-4 py-3 text-gray-400 capitalize">{batch.batch_type}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(batch.status)}`}>
                              {batch.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-white">{batch.prospects_found}</td>
                          <td className="px-4 py-3 text-white">{batch.emails_sent}</td>
                          <td className="px-4 py-3 text-white">{batch.delivery_rate.toFixed(1)}%</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {new Date(batch.started_at).toLocaleDateString()} {new Date(batch.started_at).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Trainers List */}
          {activeTab === 'trainers' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search trainers by name, email, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <div className="overflow-x-auto bg-gray-900/50 border border-gray-800 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left text-gray-400">Trainer</th>
                      <th className="px-4 py-3 text-left text-gray-400">Email</th>
                      <th className="px-4 py-3 text-left text-gray-400">City</th>
                      <th className="px-4 py-3 text-left text-gray-400">Batch</th>
                      <th className="px-4 py-3 text-left text-gray-400">Date Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrainers.map((trainer) => (
                      <tr key={trainer.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="px-4 py-3 text-white">{trainer.prospect_name}</td>
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{trainer.prospect_email}</td>
                        <td className="px-4 py-3 text-gray-400">{trainer.prospect_city}</td>
                        <td className="px-4 py-3 text-gray-400">#{trainer.batch_number}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {new Date(trainer.added_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Clients List */}
          {activeTab === 'clients' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search clients by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <div className="overflow-x-auto bg-gray-900/50 border border-gray-800 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left text-gray-400">Client</th>
                      <th className="px-4 py-3 text-left text-gray-400">Title</th>
                      <th className="px-4 py-3 text-left text-gray-400">Company</th>
                      <th className="px-4 py-3 text-left text-gray-400">Email</th>
                      <th className="px-4 py-3 text-left text-gray-400">Batch</th>
                      <th className="px-4 py-3 text-left text-gray-400">Date Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="px-4 py-3 text-white">{client.prospect_name}</td>
                        <td className="px-4 py-3 text-gray-400">{client.prospect_title || '—'}</td>
                        <td className="px-4 py-3 text-gray-400">{client.prospect_company || '—'}</td>
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{client.prospect_email}</td>
                        <td className="px-4 py-3 text-gray-400">#{client.batch_number}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {new Date(client.added_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
