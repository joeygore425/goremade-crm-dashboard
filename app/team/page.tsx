'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

interface Agent {
  name: string;
  emoji: string;
  role: string;
  goal: string;
  model: string;
  status: 'active' | 'idle' | 'paused';
  specialties: string[];
  currentTask: string;
  tasksCompleted: number;
}

const agents: Agent[] = [
  {
    name: 'Finder Bobby',
    emoji: '📸',
    role: 'Instagram Research Agent',
    goal: 'Find premium trainers via Instagram (1K-50K followers, independent)',
    model: 'Claude',
    status: 'active',
    specialties: ['Instagram research', 'Trainer validation', 'Email extraction', 'Deduplication'],
    currentTask: 'Researching batch 3 (40/50 found)',
    tasksCompleted: 2
  },
  {
    name: 'Scout',
    emoji: '🔍',
    role: 'LinkedIn/Google Research Agent',
    goal: 'Find trainers via LinkedIn & Google websites (verified emails)',
    model: 'Claude',
    status: 'active',
    specialties: ['LinkedIn research', 'Google search', 'Website scraping', 'Email verification'],
    currentTask: 'Researching batch 2 (35/50 found)',
    tasksCompleted: 2
  },
  {
    name: 'Skywalker',
    emoji: '✉️',
    role: 'Trainer Email Sender',
    goal: 'Send personalized outreach emails to trainers (200/day)',
    model: 'Llama',
    status: 'active',
    specialties: ['Email personalization', 'Resend integration', 'Batch sending', 'Delivery tracking'],
    currentTask: 'Sending batch 3 (45/50 delivered)',
    tasksCompleted: 2
  },
  {
    name: 'Apex',
    emoji: '🎯',
    role: 'Client Research Agent',
    goal: 'Find high-level executives ($200K+, travel-heavy, fitness-interested)',
    model: 'Claude',
    status: 'active',
    specialties: ['LinkedIn targeting', 'Executive profiling', 'Travel signal detection', 'Email validation'],
    currentTask: 'Researching batch 1 (25/200 found)',
    tasksCompleted: 1
  },
  {
    name: 'Closer',
    emoji: '💼',
    role: 'Client Email Sender',
    goal: 'Send discipline platform emails to executives (200/day, A/B testing)',
    model: 'Llama',
    status: 'idle',
    specialties: ['Client outreach', 'Subject A/B testing', 'Resend integration', 'Conversion tracking'],
    currentTask: 'Awaiting first client batch from Apex',
    tasksCompleted: 0
  }
];

const statusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-green-400';
    case 'idle':
      return 'text-yellow-400';
    case 'paused':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

const statusDot = (status: string) => {
  switch (status) {
    case 'active':
      return '●';
    case 'idle':
      return '◯';
    case 'paused':
      return '⊗';
    default:
      return '○';
  }
};

export default function TeamRoute() {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Team</h1>
          <p className="text-gray-400 mb-8">Agent status and real-time goals</p>
          
          <div className="grid grid-cols-1 gap-6">
            {agents.map((agent) => (
              <div key={agent.name} className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{agent.emoji}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
                      <p className="text-sm text-gray-400">{agent.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${statusColor(agent.status)}`}>
                      {statusDot(agent.status)} {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Model: {agent.model}</p>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-gray-800 rounded border border-gray-700">
                  <p className="text-sm font-semibold text-cyan-400 mb-1">🎯 Goal</p>
                  <p className="text-gray-300">{agent.goal}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">SPECIALTIES</p>
                    <div className="flex flex-wrap gap-2">
                      {agent.specialties.map((specialty) => (
                        <span key={specialty} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">STATS</p>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>📊 Tasks completed: <strong>{agent.tasksCompleted}</strong></p>
                      <p>⚡ Status: <strong className="capitalize">{agent.status}</strong></p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-950 rounded border border-gray-800">
                  <p className="text-xs font-semibold text-gray-500 mb-1">CURRENT TASK</p>
                  <p className="text-sm text-gray-300">{agent.currentTask}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">System Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Agents Active</p>
                <p className="text-2xl font-bold text-green-400">5/5</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Daily Capacity</p>
                <p className="text-2xl font-bold text-cyan-400">400+ prospects</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email Volume/Day</p>
                <p className="text-2xl font-bold text-blue-400">400 emails</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Data Pipeline</p>
                <p className="text-2xl font-bold text-yellow-400">🔄 Live Sync</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
