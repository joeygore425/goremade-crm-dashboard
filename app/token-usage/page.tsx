'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import TokenUsagePageLive from '@/components/TokenUsagePageLive';

export default function TokenUsageRoute() {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Token Usage</h1>
          <p className="text-gray-400 mb-8">Claude API usage tracking and costs</p>
          <TokenUsagePageLive />
        </div>
      </main>
    </div>
  );
}
