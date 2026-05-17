'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function CampaignRoute() {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Trainer Acquisition Campaign</h1>
          <p className="text-gray-400 mb-8">Email campaign performance and trainer pipeline</p>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-gray-400">
            <p>Campaign details coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
