'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function CalendarRoute() {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Calendar</h1>
          <p className="text-gray-400 mb-8">Scheduled tasks and campaigns</p>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-gray-400">
            <p>Calendar view coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
