'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed: initialCollapsed = false }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Tasks', path: '/tasks', icon: '✓' },
    { label: 'Campaign', path: '/campaign', icon: '🚀' },
    { label: 'Calendar', path: '/calendar', icon: '📅' },
    { label: 'Team', path: '/team', icon: '👥' },
    { label: 'Token Usage', path: '/token-usage', icon: '⚡' },
  ];

  return (
    <div
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-black border-r border-gray-800 h-screen flex flex-col transition-all duration-300`}
    >
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-white font-bold text-lg">MISSION CONTROL</h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 text-gray-500 text-xs text-center">
        {!collapsed && <p>Ricky v1.0</p>}
      </div>
    </div>
  );
}
