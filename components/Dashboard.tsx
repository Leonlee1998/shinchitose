
import React, { useState, useMemo } from 'react';
import { Task, Meeting, SocialContent, Project, TaskStatus, Priority } from '../types';
import { ICONS, COLORS } from '../constants';
import TaskDetailModal from './TaskDetailModal';
import MeetingDetailModal from './MeetingDetailModal';
import QuickAddModal from './QuickAddModal';

interface DashboardProps {
  tasks: Task[];
  meetings: Meeting[];
  socials: SocialContent[];
  projects: Project[];
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onUpdateMeeting: (id: string, updates: Partial<Meeting>) => void;
  onDeleteMeeting: (id: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onAddMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  onAddDoc: (doc: any) => void;
  onAddSocial: (social: Omit<SocialContent, 'id'>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  tasks, meetings, socials, projects,
  onToggleTask, onUpdateTask, onDeleteTask,
  onUpdateMeeting, onDeleteMeeting,
  onAddTask, onAddMeeting, onAddDoc, onAddSocial
}) => {
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  const activeTask = useMemo(() =>
    tasks.find(t => t.id === selectedTaskId),
    [tasks, selectedTaskId]
  );

  const activeMeeting = useMemo(() =>
    meetings.find(m => m.id === selectedMeetingId),
    [meetings, selectedMeetingId]
  );

  const upcomingTasks = useMemo(() =>
    tasks.filter(t => t.status !== TaskStatus.DONE)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5),
    [tasks]
  );

  const upcomingMeetings = meetings.filter(m => !m.isCompleted).sort((a, b) => a.time.localeCompare(b.time)).slice(0, 3);
  const socialPending = socials.filter(s => s.status !== '已發布');

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">總覽</h1>
          <p className="text-slate-500 font-medium mt-1">追蹤所有專案的關鍵進度</p>
        </div>
        <div>
          <button
            onClick={() => setShowQuickAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 hover:-translate-y-0.5"
          >
            <ICONS.Plus className="w-5 h-5" />
            快速新增
          </button>
        </div>
      </header>

      {/* 任務詳情彈窗 */}
      {activeTask && (
        <TaskDetailModal
          task={activeTask}
          projectName={projects.find(p => p.id === activeTask.projectId)?.name || '未知專案'}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
        />
      )}

      {/* 會議詳情彈窗 */}
      {activeMeeting && (
        <MeetingDetailModal
          meeting={activeMeeting}
          projectName={projects.find(p => p.id === activeMeeting.projectId)?.name || '未知專案'}
          onClose={() => setSelectedMeetingId(null)}
          onUpdate={onUpdateMeeting}
          onDelete={onDeleteMeeting}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="待辦任務" count={tasks.filter(t => t.status !== TaskStatus.DONE).length} icon={ICONS.Task} color="blue" />
        <StatCard title="即將舉行會議" count={upcomingMeetings.length} icon={ICONS.Meeting} color="purple" />
        <StatCard title="社群草稿" count={socialPending.length} icon={ICONS.Social} color="green" />
        <StatCard title="活躍專案" count={projects.length} icon={ICONS.Project} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <SectionHeader title="近期任務" icon={ICONS.Task} />
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-50">
              {upcomingTasks.map(task => (
                <div
                  key={task.id}
                  className="p-5 flex items-center justify-between group hover:bg-slate-50 transition-all cursor-pointer"
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                      className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${task.status === TaskStatus.DONE ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20' :
                        task.status === TaskStatus.DOING ? 'bg-blue-50 border-blue-400' : 'bg-white border-slate-200'
                        }`}
                    >
                      {task.status === TaskStatus.DONE && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      {task.status === TaskStatus.DOING && <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></div>}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold transition-colors ${task.status === TaskStatus.DONE ? 'text-slate-400 line-through' : 'text-slate-800 group-hover:text-blue-600'}`}>{task.name}</h4>
                        {task.status === TaskStatus.DOING && <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-black uppercase">進行中</span>}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        到期: {task.dueDate} • <span className="text-slate-500 font-bold">{projects.find(p => p.id === task.projectId)?.name}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${task.priority === Priority.HIGH ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}>
                      {task.priority}
                    </span>
                    <ICONS.ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
              {upcomingTasks.length === 0 && (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <ICONS.Task className="w-8 h-8" />
                  </div>
                  <p className="text-slate-400 font-bold text-sm">目前沒有待辦任務，休息一下吧！</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader title="近期會議" icon={ICONS.Meeting} />
          <div className="space-y-4">
            {upcomingMeetings.map(m => (
              <div
                key={m.id}
                onClick={() => setSelectedMeetingId(m.id)}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <p className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-widest">{m.time}</p>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                </div>
                <h4 className="font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{m.title}</h4>
                <p className="text-xs text-slate-400 font-medium mb-4">{projects.find(p => p.id === m.projectId)?.name}</p>
                <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 text-slate-600 text-xs font-black rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  查看詳情與決策
                </div>
              </div>
            ))}
            {upcomingMeetings.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 italic text-sm">
                目前沒有會議
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ADD MODAL */}
      {showQuickAddModal && (
        <QuickAddModal
          projects={projects}
          onClose={() => setShowQuickAddModal(false)}
          onAddTask={onAddTask}
          onAddMeeting={onAddMeeting}
          onAddDoc={onAddDoc}
          onAddSocial={onAddSocial}
        />
      )}
    </div>
  );
};

const StatCard = ({ title, count, icon: Icon, color }: any) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600'
  };
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-lg transition-all hover:-translate-y-1">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorMap[color]}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">{title}</p>
        <p className="text-3xl font-black text-slate-900">{count}</p>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, icon: Icon }: any) => (
  <div className="flex items-center gap-3 mb-2 px-2">
    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/10">
      <Icon className="w-4 h-4" />
    </div>
    <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
  </div>
);

export default Dashboard;
