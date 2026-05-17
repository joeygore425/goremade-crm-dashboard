'use client';
import React, { useState, useEffect } from 'react';

interface ScheduledEvent { id: string; name: string; type: string; scheduled_time: string; frequency?: string; cron_expression?: string; status: string; }

export default function CalendarPageLive() {
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchEvents(); const i = setInterval(fetchEvents, 10000); return () => clearInterval(i); }, []);

  const fetchEvents = async () => {
    try { const res = await fetch('/api/events'); if (!res.ok) throw new Error(`HTTP ${res.status}`); const data = await res.json(); setEvents(data || []); setError(null); setLoading(false); } catch (err: any) { setError(err.message); setLoading(false); }
  };

  if (loading) return <div className="text-center py-8">Loading calendar...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (events.length === 0) return <div className="text-gray-400 p-4">No scheduled events found</div>;

  const getIcon = (t: string) => t === 'email_send' ? '📧' : t === 'campaign' ? '📢' : t === 'cron_job' ? '🔄' : '📋';

  return (
    <div className="space-y-4">{events.map(event => (
      <div key={event.id} className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{getIcon(event.type)}</div>
            <div>
              <h4 className="font-bold text-white">{event.name}</h4>
              <p className="text-sm text-gray-400 mt-1">🕐 {new Date(event.scheduled_time).toLocaleString()}</p>
              {event.frequency && <p className="text-sm text-gray-400">🔄 {event.frequency}</p>}
              {event.cron_expression && <p className="text-xs text-gray-500 font-mono">cron: {event.cron_expression}</p>}
            </div>
          </div>
          <span className={`px-3 py-1 rounded text-xs font-semibold ${event.status === 'running' ? 'bg-green-500/20 text-green-400' : event.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>{event.status}</span>
        </div>
      </div>
    ))}<div className="text-sm text-gray-400 text-center">Total: {events.length} events</div></div>
  );
}
