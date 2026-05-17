'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import ContactsPageLive from '@/components/ContactsPageLive';

export default function ContactsRoute() {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Contacts</h1>
          <p className="text-gray-400 mb-8">All trainers contacted in campaign</p>
          <ContactsPageLive />
        </div>
      </main>
    </div>
  );
}
