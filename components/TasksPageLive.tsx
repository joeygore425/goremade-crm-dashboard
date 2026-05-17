'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Task {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  due_date?: string;
  due_time?: string;
  progress_percentage?: number;
  agent_id: string;
  description?: string;
}

export default function TasksPageLive() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    const sub = supabase
      .channel('tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchTasks())
      .subscribe();
    return () => { sub.unsubscribe(); };
  }, []);

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*').order('due_date');
    if (data) setTasks(data);
    setLoading(false);
  };

  const tasksByStatus = {
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed'),
    failed: tasks.filter(t => t.status === 'failed'),
  };

  if (loading) return <div className="text-gray-400">Loading tasks...</div>;

  const TaskCard = ({ task }: { task: Task }) => (
    <div className="border border-gray-700 rounded-lg p-4 mb-3 bg-gray-900/50">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-white">{task.name}</h3>
        <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
          {task.agent_id === 'ricky' ? '🤖 Ricky' : task.agent_id}
        </span>
      </div>
      {task.description && <p className="text-sm text-gray-400 mb-2">{task.description}</p>}
      {task.due_date && (
        <p className="text-sm text-gray-500 mb-2">
          Due: {new Date(task.due_date).toLocaleDateString()} {task.due_time || ''}
        </p>
      )}
      {task.status === 'in_progress' && (
        <div className="w-full bg-gray-700 rounded h-2 mt-2">
          <div
            className="bg-blue-500 h-2 rounded transition-all"
            style={{ width: `${task.progress_percentage || 0}%` }}
          ></div>
        </div>
      )}
      {task.status === 'in_progress' && (
        <p className="text-xs text-gray-400 mt-2">{task.progress_percentage}% complete</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {tasksByStatus.in_progress.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">●</span> In Progress ({tasksByStatus.in_progress.length})
          </h2>
          {tasksByStatus.in_progress.map(t => <TaskCard key={t.id} task={t} />)}
        </section>
      )}

      {tasksByStatus.completed.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-green-400">●</span> Completed ({tasksByStatus.completed.length})
          </h2>
          {tasksByStatus.completed.map(t => <TaskCard key={t.id} task={t} />)}
        </section>
      )}

      {tasksByStatus.failed.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-red-400">●</span> Failed ({tasksByStatus.failed.length})
          </h2>
          {tasksByStatus.failed.map(t => <TaskCard key={t.id} task={t} />)}
        </section>
      )}

      {tasks.length === 0 && (
        <p className="text-gray-500">No tasks yet. Check back soon!</p>
      )}
    </div>
  );
}
