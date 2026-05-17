'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Dashboard</h1>
          <p className="text-gray-400 mb-8">Welcome to GoreMade Mission Control</p>
          <Dashboard />
        </div>
      </main>
    </div>
  );
}
