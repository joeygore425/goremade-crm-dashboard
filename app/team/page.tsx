'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function TeamRoute() {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Team</h1>
          <p className="text-gray-400 mb-8">Agents and their specialties</p>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">🤖 Ricky</h2>
              <div className="space-y-2 text-gray-400">
                <p><strong>Status:</strong> <span className="text-green-400">● Active</span></p>
                <p><strong>Specialties:</strong> Trainer research, Email campaigns, Campaign monitoring, Agent management</p>
                <p><strong>Personality:</strong> Resourceful, direct, quality-focused. Loves finding verified trainers and building systems that actually work.</p>
                <p><strong>Current Tasks:</strong> 1 active</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
