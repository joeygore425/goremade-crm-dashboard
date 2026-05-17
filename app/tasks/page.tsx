'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import TasksPageLive from '@/components/TasksPageLive';

export default function TasksRoute() {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Tasks</h1>
          <p className="text-gray-400 mb-8">All active and completed tasks (auto-refreshing)</p>
          <TasksPageLive />
        </div>
      </main>
    </div>
  );
}
