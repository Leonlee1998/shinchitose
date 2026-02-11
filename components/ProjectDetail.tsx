
import React, { useState, useEffect, useMemo } from 'react';
import {
  Project, Task, Meeting, SocialContent, Document,
  TaskStatus, Priority, UserRole, ProjectStatus
} from '../types';
import { ICONS, COLORS } from '../constants';
import TaskDetailModal from './TaskDetailModal';
import MeetingDetailModal from './MeetingDetailModal';
import DocumentDetailModal from './DocumentDetailModal';
import SocialDetailModal from './SocialDetailModal';
import TimelineCalendar from './TimelineCalendar';

interface ProjectDetailProps {
  project: Project;
  tasks: Task[];
  meetings: Meeting[];
  socials: SocialContent[];
  docs: Document[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onAddMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  onUpdateMeeting: (id: string, updates: Partial<Meeting>) => void;
  onDeleteMeeting: (id: string) => void;
  onAddSocial: (social: Omit<SocialContent, 'id'>) => void;
  onUpdateSocial: (id: string, updates: Partial<SocialContent>) => void;
  onDeleteSocial: (id: string) => void;
  onAddDoc: (doc: Omit<Document, 'id'>) => void;
  onUpdateDoc: (id: string, updates: Partial<Document>) => void;
  onDeleteDoc: (id: string) => void;
  onToggleTask: (id: string) => void;
  onUpdateProject: (id: string, data: any) => void;
  onDeleteProject: (id: string) => void;
  onInviteMember: (projectId: string, gmail: string) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project, tasks, meetings, socials, docs,
  onAddTask, onUpdateTask, onDeleteTask,
  onAddMeeting, onUpdateMeeting, onDeleteMeeting,
  onAddSocial, onUpdateSocial, onDeleteSocial, onAddDoc, onUpdateDoc, onDeleteDoc, onToggleTask,
  onUpdateProject, onDeleteProject, onInviteMember
}) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showQuickAction, setShowQuickAction] = useState<string | null>(null);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const activeTask = useMemo(() =>
    tasks.find(t => t.id === selectedTaskId),
    [tasks, selectedTaskId]
  );

  const activeMeeting = useMemo(() =>
    meetings.find(m => m.id === selectedMeetingId),
    [meetings, selectedMeetingId]
  );

  const activeDoc = useMemo(() =>
    docs.find(d => d.id === selectedDocId),
    [docs, selectedDocId]
  );

  // Form State for Task
  const [taskForm, setTaskForm] = useState({
    name: '',
    description: '',
    priority: Priority.MEDIUM,
    assignee: '',
    dueDate: new Date().toISOString().split('T')[0]
  });

  // Form State for Meeting
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    time: new Date().toISOString().slice(0, 16),
    duration: '60 min',
    link: '',
    attendees: project.members.map(m => m.gmail).join(', '),
    type: '週會',
    remarks: '',
    decisionContent: '',
    decisionReason: '',
    decisionMaker: project.ownerId,
    decisionTime: ''
  });

  // Form State for Document Upload
  const [docForm, setDocForm] = useState({
    name: '',
    documentType: '',
    type: '',
    uploadedBy: '',
    version: '',
    relatedTaskIds: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Selected Social ID
  const [selectedSocialId, setSelectedSocialId] = useState<string | null>(null);
  const activeSocial = useMemo(() => socials.find(s => s.id === selectedSocialId), [socials, selectedSocialId]);

  // Form State for Social
  const [socialForm, setSocialForm] = useState({
    date: new Date().toISOString().split('T')[0],
    status: '草稿',
    postLink: '',
    title: '',
    content: '',
    hashtags: '',
    publishTime: '',
    platform: 'Instagram',
    type: '',
    theme: '',
    materialLink: '',
    collaborator: '',
    budget: 0
  });

  // Form State for Editing Project
  const [editProjectForm, setEditProjectForm] = useState({
    name: project.name,
    description: project.description,
    status: project.status,
    startDate: project.startDate,
    deadline: project.deadline,
    priority: project.priority,
    ownerId: project.ownerId,
    progress: project.progress,
    memberEmails: project.members.map(m => m.gmail).join(', ')
  });

  useEffect(() => {
    setEditProjectForm({
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      deadline: project.deadline,
      priority: project.priority,
      ownerId: project.ownerId,
      progress: project.progress,
      memberEmails: project.members.map(m => m.gmail).join(', ')
    });
  }, [project]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowQuickAction(null);
        setIsEditingProject(false);
        setShowInviteModal(false);
        setShowDeleteModal(false);
        setSelectedTaskId(null);
        setSelectedMeetingId(null);
        setSelectedDocId(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.name) return;
    onAddTask({
      ...taskForm,
      projectId: project.id,
      status: TaskStatus.TODO
    });
    setTaskForm({
      name: '',
      description: '',
      priority: Priority.MEDIUM,
      assignee: '',
      dueDate: new Date().toISOString().split('T')[0]
    });
    setShowQuickAction(null);
  };

  const handleMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingForm.title) return;
    onAddMeeting({
      ...meetingForm,
      projectId: project.id,
      attendees: meetingForm.attendees.split(',').map(a => a.trim()).filter(a => a),
      isCompleted: false
    });
    setMeetingForm({
      title: '',
      time: new Date().toISOString().slice(0, 16),
      duration: '60 min',
      link: '',
      attendees: project.members.map(m => m.gmail).join(', '),
      type: '週會',
      remarks: '',
      decisionContent: '',
      decisionReason: '',
      decisionMaker: project.ownerId,
      decisionTime: ''
    });
    setShowQuickAction(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.name) return;

    let fileUrl = '';
    let fileSize = '';

    if (selectedFile) {
      // Create a local URL for the file
      fileUrl = URL.createObjectURL(selectedFile);
      // Calculate file size in KB or MB
      const sizeInBytes = selectedFile.size;
      fileSize = sizeInBytes < 1024 * 1024
        ? `${(sizeInBytes / 1024).toFixed(2)} KB`
        : `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    onAddDoc({
      name: docForm.name,
      projectId: project.id,
      documentType: docForm.documentType,
      type: docForm.type as any,
      fileUrl,
      fileSize,
      uploadedBy: docForm.uploadedBy,
      version: docForm.version,
      relatedTaskIds: docForm.relatedTaskIds
    });

    // Reset form
    setDocForm({
      name: '',
      documentType: '',
      type: '',
      uploadedBy: '',
      version: '',
      relatedTaskIds: ''
    });
    setSelectedFile(null);
    setShowQuickAction(null);
  };

  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialForm.title) return;
    onAddSocial({
      ...socialForm,
      projectId: project.id,
      status: socialForm.status as any,
    });
    setSocialForm({
      date: new Date().toISOString().split('T')[0],
      status: '草稿',
      postLink: '',
      title: '',
      content: '',
      hashtags: '',
      publishTime: '',
      platform: 'Instagram',
      type: '',
      theme: '',
      materialLink: '',
      collaborator: '',
      budget: 0
    });
    setShowQuickAction(null);
  };

  const handleUpdateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProject(project.id, {
      ...editProjectForm,
      memberEmails: editProjectForm.memberEmails.split(',').map(m => m.trim()).filter(m => m)
    });
    setIsEditingProject(false);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail && inviteEmail.includes('@')) {
      onInviteMember(project.id, inviteEmail);
      setInviteEmail('');
      setShowInviteModal(false);
    }
  };

  const tabs = ['Overview', 'Tasks', 'Meetings', 'Docs', 'Timeline', 'Social'];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700 relative">
      <header className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl font-black text-slate-900 leading-tight">{project.name}</h1>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${project.status === ProjectStatus.ONGOING ? 'bg-green-500 text-white' :
                project.status === ProjectStatus.PLANNING ? 'bg-blue-600 text-white' : 'bg-slate-400 text-white'
                }`}>
                {project.status}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${project.priority === Priority.HIGH ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-600 border border-slate-100'
                }`}>
                {project.priority} 優先序
              </span>
            </div>
            <p className="text-slate-500 font-medium max-w-2xl text-sm leading-relaxed">{project.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  {project.members.map((m, i) => (
                    <div key={i} className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm" title={`${m.gmail} (${m.role})`}>
                      {m.gmail.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 p-1 bg-blue-50 hover:bg-blue-100 rounded-lg px-2 py-1 transition-colors"
                >
                  + 邀請成員
                </button>
              </div>
              <div className="h-6 w-px bg-slate-100"></div>
              <div className="flex gap-2">
                <button onClick={() => setIsEditingProject(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-100">
                  編輯專案
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors border border-red-100"
                >
                  刪除專案
                </button>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 self-start lg:self-center border border-slate-100 min-w-[280px]">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">整體進度</p>
                <p className="text-sm font-black text-slate-900">{project.progress}%</p>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>
            <div className="sm:border-l border-slate-200 sm:pl-6 text-center sm:text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">截止日期</p>
              <p className="text-sm font-black text-slate-900">{project.deadline || '未設定'}</p>
            </div>
          </div>
        </div>
      </header>

      {/* TASK DETAIL MODAL */}
      {activeTask && (
        <TaskDetailModal
          task={activeTask}
          projectName={project.name}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
        />
      )}

      {/* MEETING DETAIL MODAL */}
      {activeMeeting && (
        <MeetingDetailModal
          meeting={activeMeeting}
          projectName={project.name}
          onClose={() => setSelectedMeetingId(null)}
          onUpdate={onUpdateMeeting}
          onDelete={onDeleteMeeting}
        />
      )}

      {/* DOCUMENT DETAIL MODAL */}
      {activeDoc && (
        <DocumentDetailModal
          doc={activeDoc}
          projectName={project.name}
          onClose={() => setSelectedDocId(null)}
          onUpdate={onUpdateDoc}
          onDelete={onDeleteDoc}
        />
      )}

      {/* ... (Other modals like delete, invite stay same) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 animate-in zoom-in-95 border border-red-100 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">確定要刪除專案？</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              專案 <span className="text-red-600 font-black">"{project.name}"</span> 將被永久移除。
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => onDeleteProject(project.id)} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black">確認刪除</button>
              <button onClick={() => setShowDeleteModal(false)} className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold">取消</button>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-2">邀請成員</h3>
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <input required type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="example@gmail.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold outline-none" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 py-3.5 bg-slate-50 text-slate-500 rounded-2xl font-bold">取消</button>
                <button type="submit" className="flex-1 py-3.5 bg-blue-600 text-white rounded-2xl font-black">確認邀請</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROJECT MODAL */}
      {isEditingProject && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEditingProject(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-slate-900 mb-6">編輯專案</h3>
            <form onSubmit={handleUpdateProjectSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">專案名稱 <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  value={editProjectForm.name}
                  onChange={e => setEditProjectForm({ ...editProjectForm, name: e.target.value })}
                  placeholder="專案名稱..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">專案描述</label>
                <textarea
                  value={editProjectForm.description}
                  onChange={e => setEditProjectForm({ ...editProjectForm, description: e.target.value })}
                  placeholder="專案描述..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 h-24 resize-none outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">狀態</label>
                  <select
                    value={editProjectForm.status}
                    onChange={e => setEditProjectForm({ ...editProjectForm, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="規劃中">規劃中</option>
                    <option value="進行中">進行中</option>
                    <option value="完成">完成</option>
                    <option value="暫停">暫停</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">優先序</label>
                  <select
                    value={editProjectForm.priority}
                    onChange={e => setEditProjectForm({ ...editProjectForm, priority: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="低">低</option>
                    <option value="中">中</option>
                    <option value="高">高</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">開始日期</label>
                  <input
                    type="date"
                    value={editProjectForm.startDate}
                    onChange={e => setEditProjectForm({ ...editProjectForm, startDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">截止日期</label>
                  <input
                    type="date"
                    value={editProjectForm.deadline}
                    onChange={e => setEditProjectForm({ ...editProjectForm, deadline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">進度 (%)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editProjectForm.progress}
                    onChange={e => setEditProjectForm({ ...editProjectForm, progress: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-lg font-black text-slate-900 min-w-[60px] text-right">{editProjectForm.progress}%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">成員 Email (逗號分隔)</label>
                <input
                  type="text"
                  value={editProjectForm.memberEmails}
                  onChange={e => setEditProjectForm({ ...editProjectForm, memberEmails: e.target.value })}
                  placeholder="email1@example.com, email2@example.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsEditingProject(false)} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-colors">取消</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-colors">儲存變更</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'task', label: '新增任務', icon: ICONS.Task },
          { id: 'meet', label: '建立會議', icon: ICONS.Meeting },
          { id: 'doc', label: '上傳文件', icon: ICONS.Doc },
          { id: 'social', label: '發想社群', icon: ICONS.Social },
        ].map(btn => (
          <button key={btn.id} onClick={() => setShowQuickAction(btn.id)} className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-100 rounded-2xl text-sm font-bold shadow-sm transition-all hover:-translate-y-1">
            <btn.icon className="w-4 h-4 text-blue-500" /> {btn.label}
          </button>
        ))}
      </div>

      {/* QUICK ADD MODALS */}
      {showQuickAction === 'task' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowQuickAction(null)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 p-8">
            <h3 className="text-2xl font-black mb-6">建立新任務</h3>
            <form onSubmit={handleTaskSubmit} className="space-y-6">
              <input required type="text" value={taskForm.name} onChange={e => setTaskForm({ ...taskForm, name: e.target.value })} placeholder="任務名稱..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />
              <textarea value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="詳細說明..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 h-32 resize-none" />
              <div className="grid grid-cols-2 gap-4">
                <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value as Priority })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold">
                  {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowQuickAction(null)} className="flex-1 py-4 bg-slate-50 rounded-2xl font-bold">取消</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl">儲存任務</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQuickAction === 'meet' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowQuickAction(null)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 p-8">
            <h3 className="text-2xl font-black mb-6">建立新會議</h3>
            <form onSubmit={handleMeetingSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
              <input required type="text" value={meetingForm.title} onChange={e => setMeetingForm({ ...meetingForm, title: e.target.value })} placeholder="會議標題..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />
              <div className="grid grid-cols-2 gap-4">
                <input type="datetime-local" value={meetingForm.time} onChange={e => setMeetingForm({ ...meetingForm, time: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />
                <input type="text" value={meetingForm.duration} onChange={e => setMeetingForm({ ...meetingForm, duration: e.target.value })} placeholder="時長 (例如: 60 min)" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />
              </div>
              <input type="url" value={meetingForm.link} onChange={e => setMeetingForm({ ...meetingForm, link: e.target.value })} placeholder="連結 (https://...)" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />
              <textarea value={meetingForm.remarks} onChange={e => setMeetingForm({ ...meetingForm, remarks: e.target.value })} placeholder="備註紀錄..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 h-32" />
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowQuickAction(null)} className="flex-1 py-4 bg-slate-50 rounded-2xl font-bold">取消</button>
                <button type="submit" className="flex-[2] py-4 bg-purple-600 text-white rounded-2xl font-black shadow-xl">建立會議</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQuickAction === 'doc' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowQuickAction(null)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 p-8">
            <h3 className="text-2xl font-black mb-6">上傳文件</h3>
            <form onSubmit={handleDocSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={docForm.name}
                  onChange={e => setDocForm({ ...docForm, name: e.target.value })}
                  placeholder="文件名稱..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Document Type</label>
                <input
                  type="text"
                  value={docForm.documentType}
                  onChange={e => setDocForm({ ...docForm, documentType: e.target.value })}
                  placeholder="文件類型..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Type</label>
                <select
                  value={docForm.type}
                  onChange={e => setDocForm({ ...docForm, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold"
                >
                  <option value="">請選擇...</option>
                  <option value="提案">提案</option>
                  <option value="規格">規格</option>
                  <option value="簡報">簡報</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">選擇文件</label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 file:cursor-pointer"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-slate-600 font-medium">
                    已選擇: <span className="font-bold text-blue-600">{selectedFile.name}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">Uploaded By</label>
                  <input
                    type="text"
                    value={docForm.uploadedBy}
                    onChange={e => setDocForm({ ...docForm, uploadedBy: e.target.value })}
                    placeholder="上傳者..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">Version</label>
                  <input
                    type="text"
                    value={docForm.version}
                    onChange={e => setDocForm({ ...docForm, version: e.target.value })}
                    placeholder="版本..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Related Task Ids</label>
                <input
                  type="text"
                  value={docForm.relatedTaskIds}
                  onChange={e => setDocForm({ ...docForm, relatedTaskIds: e.target.value })}
                  placeholder="相關任務 ID..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold"
                />
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setShowQuickAction(null)} className="flex-1 py-4 bg-slate-50 rounded-2xl font-bold">取消</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl">上傳文件</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQuickAction === 'social' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowQuickAction(null)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 p-8">
            <h3 className="text-2xl font-black mb-6">發想社群內容</h3>
            <form onSubmit={handleSocialSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">日期</label>
                  <input type="date" value={socialForm.date} onChange={e => setSocialForm({ ...socialForm, date: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">狀態</label>
                  <select value={socialForm.status} onChange={e => setSocialForm({ ...socialForm, status: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold">
                    <option value="草稿">草稿</option>
                    <option value="排程">排程</option>
                    <option value="已發布">已發布</option>
                  </select>
                </div>
              </div>

              <input required type="text" value={socialForm.title} onChange={e => setSocialForm({ ...socialForm, title: e.target.value })} placeholder="標題..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />

              <textarea value={socialForm.content} onChange={e => setSocialForm({ ...socialForm, content: e.target.value })} placeholder="內容..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 h-24 resize-none" />

              <input type="url" value={socialForm.postLink} onChange={e => setSocialForm({ ...socialForm, postLink: e.target.value })} placeholder="貼文連結..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />

              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={socialForm.hashtags} onChange={e => setSocialForm({ ...socialForm, hashtags: e.target.value })} placeholder="Hashtags..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />
                <input type="datetime-local" value={socialForm.publishTime} onChange={e => setSocialForm({ ...socialForm, publishTime: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">發布平台</label>
                  <input type="text" value={socialForm.platform} onChange={e => setSocialForm({ ...socialForm, platform: e.target.value })} placeholder="Platform..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">類型</label>
                  <input type="text" value={socialForm.type} onChange={e => setSocialForm({ ...socialForm, type: e.target.value })} placeholder="Type..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">主題分類</label>
                  <input type="text" value={socialForm.theme} onChange={e => setSocialForm({ ...socialForm, theme: e.target.value })} placeholder="Theme..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">協作帳號</label>
                  <input type="text" value={socialForm.collaborator} onChange={e => setSocialForm({ ...socialForm, collaborator: e.target.value })} placeholder="Collaborator..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />
                </div>
              </div>

              <input type="url" value={socialForm.materialLink} onChange={e => setSocialForm({ ...socialForm, materialLink: e.target.value })} placeholder="素材檔案連結..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">廣告預算</label>
                <input type="number" value={socialForm.budget} onChange={e => setSocialForm({ ...socialForm, budget: Number(e.target.value) })} placeholder="Budget..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold" />
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setShowQuickAction(null)} className="flex-1 py-4 bg-slate-50 rounded-2xl font-bold">取消</button>
                <button type="submit" className="flex-[2] py-4 bg-pink-600 text-white rounded-2xl font-black shadow-xl">建立貼文</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-white border border-slate-100 rounded-2xl shadow-sm w-fit">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <ICONS.Task className="w-5 h-5 text-blue-500" /> 任務分布
              </h3>
              <div className="space-y-4">
                <ProgressItem label="Todo" count={tasks.filter(t => t.status === TaskStatus.TODO).length} color="bg-slate-200" />
                <ProgressItem label="Doing" count={tasks.filter(t => t.status === TaskStatus.DOING).length} color="bg-blue-400" />
                <ProgressItem label="Done" count={tasks.filter(t => t.status === TaskStatus.DONE).length} color="bg-green-400" />
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <ICONS.Meeting className="w-5 h-5 text-purple-500" /> 最近會議
              </h3>
              <div className="space-y-4">
                {meetings.slice(0, 3).map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMeetingId(m.id)}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group"
                  >
                    <span className="text-sm font-bold truncate pr-4 group-hover:text-purple-600 transition-colors">{m.title}</span>
                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap bg-white px-2 py-1 rounded-lg border border-slate-200">
                      {m.isCompleted ? '已結束' : '進行中'}
                    </span>
                  </div>
                ))}
                {meetings.length === 0 && <p className="text-slate-400 text-sm text-center py-4 italic">目前沒有會議紀錄</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Tasks' && (
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-8 py-5">狀態</th>
                  <th className="px-8 py-5">內容</th>
                  <th className="px-8 py-5">優先序</th>
                  <th className="px-8 py-5">截止日</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tasks.length > 0 ? tasks.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => setSelectedTaskId(t.id)}>
                    <td className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => onToggleTask(t.id)} className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${t.status === TaskStatus.DONE ? 'bg-green-500 border-green-500' : 'bg-white border-slate-200 hover:border-blue-500'
                        }`}>
                        {t.status === TaskStatus.DONE && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        {t.status === TaskStatus.DOING && <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></div>}
                      </button>
                    </td>
                    <td className="px-8 py-5">
                      <p className={`text-sm font-bold group-hover:text-blue-600 transition-colors ${t.status === TaskStatus.DONE ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{t.name}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${t.priority === Priority.HIGH ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'}`}>{t.priority}</span>
                    </td>
                    <td className="px-8 py-5 text-xs text-slate-500 font-medium">{t.dueDate}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center text-slate-400 italic">尚無任務</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Meetings' && (
          <div className="space-y-6">
            {meetings.map(m => (
              <div
                key={m.id}
                onClick={() => setSelectedMeetingId(m.id)}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col gap-6 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors">{m.title}</h4>
                      <span className="px-3 py-1 bg-purple-50 rounded-full text-[10px] font-black text-purple-600 uppercase tracking-widest">{m.type}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                      {m.time} ({m.duration})
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xs font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-all">點擊查看詳情</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-slate-50 pt-6">
                  <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">備註摘要</h5>
                    <p className="text-sm text-slate-600 line-clamp-2 italic">{m.remarks || '未輸入備註'}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black text-purple-600 uppercase mb-3 tracking-widest">關鍵決策</h5>
                    <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100/50">
                      <p className="text-sm font-black text-slate-900">{m.decisionContent || '無決策紀錄'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {meetings.length === 0 && <div className="p-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 italic">目前無會議紀錄</div>}
          </div>
        )}

        {activeTab === 'Docs' && (
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            {docs.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-8 py-5">文件名稱</th>
                    <th className="px-8 py-5">類型</th>
                    <th className="px-8 py-5">大小</th>
                    <th className="px-8 py-5">上傳者</th>
                    <th className="px-8 py-5">版本</th>
                    <th className="px-8 py-5">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {docs.map(doc => (
                    <tr
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <ICONS.Doc className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{doc.name}</p>
                            {doc.documentType && (
                              <p className="text-xs text-slate-400 font-medium">{doc.documentType}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {doc.type && (
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                            {doc.type}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                        {doc.fileSize || '-'}
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                        {doc.uploadedBy || '-'}
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                        {doc.version || '-'}
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                          查看詳情 →
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-20 text-center text-slate-400 italic">
                <ICONS.Doc className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                <p className="text-lg font-bold">目前沒有文件</p>
                <p className="text-sm mt-2">點擊上方「上傳文件」按鈕新增文件</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Social' && (
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            {socials.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-8 py-5">標題</th>
                    <th className="px-8 py-5">狀態</th>
                    <th className="px-8 py-5">平台</th>
                    <th className="px-8 py-5">日期</th>
                    <th className="px-8 py-5">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {socials.map(social => (
                    <tr
                      key={social.id}
                      onClick={() => setSelectedSocialId(social.id)}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{social.title}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${social.status === '已發布' ? 'bg-green-50 text-green-600' :
                          social.status === '排程' ? 'bg-blue-50 text-blue-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                          {social.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                        {social.platform}
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                        {social.date}
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                          查看詳情 →
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-20 text-center text-slate-400 italic">
                <ICONS.Social className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                <p className="text-lg font-bold">目前沒有貼文</p>
                <p className="text-sm mt-2">點擊上方「發想社群」按鈕新增貼文</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Timeline' && (
          <TimelineCalendar
            tasks={tasks}
            meetings={meetings}
            socials={socials}
            onTaskClick={setSelectedTaskId}
            onMeetingClick={setSelectedMeetingId}
            onSocialClick={setSelectedSocialId}
          />
        )}
      </div>

      {/* SOCIAL DETAIL MODAL */}
      {activeSocial && (
        <SocialDetailModal
          social={activeSocial}
          projectName={project.name}
          onClose={() => setSelectedSocialId(null)}
          onUpdate={onUpdateSocial}
          onDelete={onDeleteSocial}
        />
      )}
    </div>
  );
};

const ProgressItem = ({ label, count, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-bold">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-900 font-black">{count}</span>
    </div>
    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${Math.min(100, count > 0 ? (count / 10) * 100 : 0)}%` }}></div>
    </div>
  </div>
);

export default ProjectDetail;
