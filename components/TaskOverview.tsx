
import React, { useState, useMemo } from 'react';
import { Task, Project, TaskStatus, Priority } from '../types';
import { ICONS } from '../constants';
import TaskDetailModal from './TaskDetailModal';

interface TaskOverviewProps {
  tasks: Task[];
  projects: Project[];
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

enum TaskFilter {
  ALL = '全部',
  ONGOING = '進行中',
  COMPLETED = '已完成'
}

const TaskOverview: React.FC<TaskOverviewProps> = ({ tasks, projects, onToggleTask, onUpdateTask, onDeleteTask }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<TaskFilter>(TaskFilter.ALL);

  // 任務過濾邏輯
  const filteredTasks = useMemo(() => {
    switch (activeFilter) {
      case TaskFilter.ONGOING:
        return tasks.filter(t => t.status !== TaskStatus.DONE);
      case TaskFilter.COMPLETED:
        return tasks.filter(t => t.status === TaskStatus.DONE);
      default:
        return tasks;
    }
  }, [tasks, activeFilter]);

  // 各類別計數
  const counts = useMemo(() => ({
    all: tasks.length,
    ongoing: tasks.filter(t => t.status !== TaskStatus.DONE).length,
    completed: tasks.filter(t => t.status === TaskStatus.DONE).length
  }), [tasks]);

  const activeTask = useMemo(() => 
    tasks.find(t => t.id === selectedTaskId), 
    [tasks, selectedTaskId]
  );

  const getProjectName = (pid: string) => projects.find(p => p.id === pid)?.name || '未知專案';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">任務總覽</h1>
          <p className="text-slate-500 mt-1 font-medium">跨專案追蹤所有待辦與已完成事項</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-1 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm w-fit">
          {[
            { id: TaskFilter.ALL, label: '全部', count: counts.all },
            { id: TaskFilter.ONGOING, label: '進行中', count: counts.ongoing },
            { id: TaskFilter.COMPLETED, label: '已完成', count: counts.completed },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeFilter === tab.id 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${
                activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* 詳情彈窗 */}
      {activeTask && (
        <TaskDetailModal 
          task={activeTask}
          projectName={getProjectName(activeTask.projectId)}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
        />
      )}

      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 w-20 text-center">狀態</th>
              <th className="px-8 py-5">任務標題與說明</th>
              <th className="px-8 py-5">專案</th>
              <th className="px-8 py-5">優先序</th>
              <th className="px-8 py-5">截止日期</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredTasks.length > 0 ? filteredTasks.map(task => (
              <tr 
                key={task.id} 
                className="hover:bg-slate-50/80 transition-all group cursor-pointer"
                onClick={() => setSelectedTaskId(task.id)}
              >
                <td className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
                   <button 
                    onClick={() => onToggleTask(task.id)} 
                    className={`w-7 h-7 mx-auto rounded-xl border-2 flex items-center justify-center transition-all ${
                      task.status === TaskStatus.DONE ? 'bg-green-500 border-green-500' : 
                      task.status === TaskStatus.DOING ? 'bg-blue-50 border-blue-400' : 'bg-white border-slate-200 hover:border-blue-500'
                    }`}
                  >
                    {task.status === TaskStatus.DONE && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    {task.status === TaskStatus.DOING && <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></div>}
                  </button>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold transition-colors ${task.status === TaskStatus.DONE ? 'text-slate-400 line-through' : 'text-slate-800 group-hover:text-blue-600'}`}>
                      {task.name}
                    </span>
                    {task.description && <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 font-medium">{task.description}</span>}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-[10px] font-black bg-blue-50 px-2.5 py-1 rounded-lg text-blue-600 border border-blue-100/50">
                    {getProjectName(task.projectId)}
                  </span>
                </td>
                <td className="px-8 py-5">
                   <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                     task.priority === Priority.HIGH ? 'text-red-500' : task.priority === Priority.MEDIUM ? 'text-blue-500' : 'text-slate-400'
                   }`}>
                     {task.priority}
                   </span>
                </td>
                <td className="px-8 py-5 text-xs text-slate-500 font-bold">
                  {task.dueDate}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="p-24 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <ICONS.Task className="w-10 h-10" />
                  </div>
                  <p className="text-slate-400 font-bold text-lg">此類別目前沒有任務</p>
                  <p className="text-slate-300 text-sm">更換過濾條件或前往專案頁面新增任務。</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskOverview;
