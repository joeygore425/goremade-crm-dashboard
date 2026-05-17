'use client';
import React, { useState, useEffect } from 'react';

interface Task { id: string; name: string; description?: string; status: string; due_date?: string; due_time?: string; progress_percentage?: number; agent_id?: string; }

export default function TasksPageLive() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchTasks(); const i = setInterval(fetchTasks, 10000); return () => clearInterval(i); }, []);

  const fetchTasks = async () => {
    try { const res = await fetch('/api/tasks'); if (!res.ok) throw new Error(`HTTP ${res.status}`); const data = await res.json(); setTasks(data || []); setError(null); setLoading(false); } catch (err: any) { setError(err.message); setLoading(false); }
  };

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  if (loading) return <div className="text-center py-8">Loading tasks...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (tasks.length === 0) return <div className="text-gray-400 p-4">No tasks found</div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-6">{['all','pending','in_progress','completed'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded text-sm font-medium ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}>{f.charAt(0).toUpperCase() + f.slice(1).replace('_',' ')}</button>))}</div>
      <div className="space-y-3">{filtered.map(task => (
        <div key={task.id} className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-white">{task.name}</h3>
            <span className={`px-3 py-1 rounded text-xs font-semibold ${task.status === 'completed' ? 'bg-green-500/20 text-green-400' : task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{task.status.replace('_',' ')}</span>
          </div>
          {task.description && <p className="text-sm text-gray-400 mb-2">{task.description}</p>}
          {typeof task.progress_percentage === 'number' && <div className="mb-2"><div className="w-full bg-slate-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width:`${task.progress_percentage}%`}}/></div><span className="text-xs text-gray-400">{task.progress_percentage}%</span></div>}
          <div className="flex gap-4 text-xs text-gray-400">{task.agent_id && <span>Agent: {task.agent_id}</span>}{task.due_date && <span>Due: {task.due_date}</span>}</div>
        </div>
      ))}</div>
      <div className="text-sm text-gray-400 text-center">Showing {filtered.length} of {tasks.length} tasks</div>
    </div>
  );
}
