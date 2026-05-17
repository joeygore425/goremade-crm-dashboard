'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ScheduledEvent {
  id: string;
  name: string;
  type: 'cron_job' | 'campaign' | 'email_send' | 'reminder';
  scheduled_time: string;
  timezone: string;
  frequency?: string;
  cron_expression?: string;
  status: string;
}

const TIMEZONES = [
  { label: 'Eastern', value: 'America/New_York' },
  { label: 'Central', value: 'America/Chicago' },
  { label: 'Mountain', value: 'America/Denver' },
  { label: 'Pacific', value: 'America/Los_Angeles' },
];

export default function CalendarPageLive() {
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    const sub = supabase
      .channel('events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scheduled_events' }, () => fetchEvents())
      .subscribe();
    return () => { sub.unsubscribe(); };
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('scheduled_events')
      .select('*')
      .order('scheduled_time', { ascending: true });
    setEvents(data || []);
    setLoading(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cron_job':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'campaign':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
      case 'email_send':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'reminder':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>;
      case 'scheduled':
        return <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>;
      case 'completed':
        return <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>;
      default:
        return <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-2"></span>;
    }
  };

  const formatTime = (isoTime: string) => {
    try {
      const date = new Date(isoTime);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: selectedTimezone,
      });
    } catch {
      return isoTime;
    }
  };

  if (loading) return <div className="text-gray-400">Loading calendar...</div>;

  // Group events by type
  const cronJobs = events.filter(e => e.type === 'cron_job');
  const campaigns = events.filter(e => e.type === 'campaign');
  const emailSends = events.filter(e => e.type === 'email_send');

  return (
    <div className="space-y-8">
      {/* Timezone Selector */}
      <div className="flex items-center gap-4 bg-gray-900/50 border border-gray-800 rounded-lg p-4">
        <label className="text-gray-400">Timezone:</label>
        <select
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
        >
          {TIMEZONES.map(tz => (
            <option key={tz.value} value={tz.value}>{tz.label} ({tz.value.split('/')[1]})</option>
          ))}
        </select>
      </div>

      {/* Cron Jobs */}
      {cronJobs.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">⚙️</span> Running Tasks (Cron Jobs)
          </h2>
          <div className="space-y-3">
            {cronJobs.map(event => (
              <div key={event.id} className={`border rounded-lg p-4 ${getTypeColor(event.type)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(event.status)}
                    <div>
                      <h3 className="font-semibold">{event.name}</h3>
                      {event.frequency && <p className="text-xs opacity-75">Runs: {event.frequency}</p>}
                      {event.cron_expression && <p className="text-xs opacity-75 font-mono">{event.cron_expression}</p>}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-black/30">{event.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Campaigns */}
      {campaigns.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-purple-400">🚀</span> Campaigns
          </h2>
          <div className="space-y-3">
            {campaigns.map(event => (
              <div key={event.id} className={`border rounded-lg p-4 ${getTypeColor(event.type)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(event.status)}
                    <div>
                      <h3 className="font-semibold">{event.name}</h3>
                      <p className="text-xs opacity-75">{formatTime(event.scheduled_time)}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-black/30">{event.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Email Sends */}
      {emailSends.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-green-400">📧</span> Scheduled Sends
          </h2>
          <div className="space-y-3">
            {emailSends.map(event => (
              <div key={event.id} className={`border rounded-lg p-4 ${getTypeColor(event.type)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(event.status)}
                    <div>
                      <h3 className="font-semibold">{event.name}</h3>
                      <p className="text-xs opacity-75">{formatTime(event.scheduled_time)}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-black/30">{event.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <p className="text-gray-500">No scheduled events</p>
      )}
    </div>
  );
}
