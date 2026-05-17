'use client';

import React from 'react';
import Sidebar from './Sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-black">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
