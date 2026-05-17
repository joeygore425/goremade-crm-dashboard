'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Direct Supabase connection
const supabase = createClient(
  'https://ulrgyupbhkmuzrcpzaov.supabase.co',
  'sb_publishable_RdVPN_xVcquZFhuXlZmKvg_KgRBSHkX'
);

interface Task {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  due_date?: string;
  due_time?: string;
  progress_percentage?: number;
  agent_id?: string;
  created_at?: string;
}

export default function TasksPageLive() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        setError(fetchError.message);
      } else {
        console.log('Loaded tasks:', data?.length);
        setTasks(data || []);
        setError(null);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in_progress':
        return '⟳';
      case 'pending':
        return '◯';
      case 'failed':
        return '✗';
      default:
        return '?';
    }
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filter);

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading tasks: {error}</div>;
  }

  if (tasks.length === 0) {
    return <div className="text-gray-400 p-4">No tasks found in database</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'in_progress', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded transition text-sm font-medium ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No tasks in this category</div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-slate-800 rounded-lg border border-slate-700 p-4 hover:border-slate-600 transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`text-lg font-bold mt-1 ${
                    task.status === 'completed' ? 'text-green-400' :
                    task.status === 'in_progress' ? 'text-blue-400' :
                    task.status === 'pending' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{task.name}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-semibold border ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>

              {/* Progress Bar */}
              {typeof task.progress_percentage === 'number' && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">Progress</span>
                    <span className="text-xs font-semibold text-gray-300">{task.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${task.progress_percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex gap-4 text-xs text-gray-400">
                {task.agent_id && (
                  <div>
                    <span className="text-gray-500">Agent:</span> {task.agent_id}
                  </div>
                )}
                {task.due_date && (
                  <div>
                    <span className="text-gray-500">Due:</span> {task.due_date}
                    {task.due_time && ` at ${task.due_time}`}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-sm text-gray-400 text-center">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </div>
    </div>
  );
}
