'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Direct Supabase connection
const supabase = createClient(
  'https://ulrgyupbhkmuzrcpzaov.supabase.co',
  'sb_publishable_RdVPN_xVcquZFhuXlZmKvg_KgRBSHkX'
);

interface ScheduledEvent {
  id: string;
  name: string;
  type: string;
  scheduled_time: string;
  timezone?: string;
  frequency?: string;
  cron_expression?: string;
  status: string;
  created_at?: string;
}

export default function CalendarPageLive() {
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timezone, setTimezone] = useState('America/New_York');

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('scheduled_events')
        .select('*')
        .order('scheduled_time', { ascending: true });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        setError(fetchError.message);
      } else {
        console.log('Loaded events:', data?.length);
        setEvents(data || []);
        setError(null);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cron_job':
        return '🔄';
      case 'email_send':
        return '📧';
      case 'campaign':
        return '📢';
      case 'follow_up':
        return '↩️';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatDateTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: timezone
      });
    } catch {
      return dateTime;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading calendar...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading calendar: {error}</div>;
  }

  if (events.length === 0) {
    return <div className="text-gray-400 p-4">No scheduled events found</div>;
  }

  // Group events by date
  const eventsByDate: { [key: string]: ScheduledEvent[] } = {};
  events.forEach((event) => {
    const date = new Date(event.scheduled_time).toLocaleDateString();
    if (!eventsByDate[date]) {
      eventsByDate[date] = [];
    }
    eventsByDate[date].push(event);
  });

  return (
    <div className="space-y-6">
      {/* Timezone Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-300">Timezone:</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm"
        >
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
          <option value="UTC">UTC</option>
        </select>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {Object.entries(eventsByDate).map(([date, dateEvents]) => (
          <div key={date}>
            <h3 className="text-lg font-bold text-white mb-3">{date}</h3>
            <div className="space-y-2">
              {dateEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-slate-800 rounded-lg border border-slate-700 p-4 hover:border-slate-600 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-2xl">{getTypeIcon(event.type)}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{event.name}</h4>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                          <span>🕐 {formatDateTime(event.scheduled_time)}</span>
                          {event.frequency && <span>🔄 {event.frequency}</span>}
                        </div>
                        {event.cron_expression && (
                          <div className="text-xs text-gray-500 mt-1 font-mono">
                            cron: {event.cron_expression}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-semibold border whitespace-nowrap ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-400 text-center">
        Total: {events.length} scheduled events
      </div>
    </div>
  );
}
