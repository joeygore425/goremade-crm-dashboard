'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function TokenUsageRoute() {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Token Usage</h1>
          <p className="text-gray-400 mb-8">API and agent token consumption</p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">Today</p>
              <p className="text-3xl font-bold text-white">--</p>
              <p className="text-xs text-gray-500 mt-1">tokens</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">This Week</p>
              <p className="text-3xl font-bold text-white">--</p>
              <p className="text-xs text-gray-500 mt-1">tokens</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">This Month</p>
              <p className="text-3xl font-bold text-white">--</p>
              <p className="text-xs text-gray-500 mt-1">tokens</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
