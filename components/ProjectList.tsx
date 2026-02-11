
import React, { useState } from 'react';
import { Project, ProjectStatus, Priority } from '../types';
import { ICONS } from '../constants';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
  onAddProject: (projectData: any) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelectProject, onAddProject }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: ProjectStatus.PLANNING,
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
    priority: Priority.MEDIUM,
    ownerId: 'admin@gmail.com',
    memberEmails: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    onAddProject({
      ...formData,
      memberEmails: formData.memberEmails.split(',').map(m => m.trim()).filter(m => m)
    });

    setFormData({
      name: '',
      description: '',
      status: ProjectStatus.PLANNING,
      startDate: new Date().toISOString().split('T')[0],
      deadline: '',
      priority: Priority.MEDIUM,
      ownerId: 'admin@gmail.com',
      memberEmails: ''
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">我的專案</h1>
          <p className="text-slate-500 mt-1">管理您所有的活躍專案</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          <ICONS.Plus className="w-5 h-5" />
          <span>建立新專案</span>
        </button>
      </header>

      {/* Project Creation Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsAdding(false)}
          ></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">建立新專案</h3>
                  <p className="text-slate-400 text-sm font-medium mt-1">填寫以下資訊以啟動新專案</p>
                </div>
                <button 
                  onClick={() => setIsAdding(false)} 
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">專案名稱 (Project Name)</label>
                  <input 
                    required
                    autoFocus
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="輸入專案名稱..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">描述 (Description)</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="專案目標與細節說明..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">開始日期 (Start Date)</label>
                    <input 
                      type="date" 
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">截止日期 (Due Date)</label>
                    <input 
                      required
                      type="date" 
                      value={formData.deadline}
                      onChange={e => setFormData({...formData, deadline: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">優先序 (Priority)</label>
                    <select 
                      value={formData.priority}
                      onChange={e => setFormData({...formData, priority: e.target.value as Priority})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold appearance-none"
                    >
                      {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">負責人 (Owner ID)</label>
                    <input 
                      type="email" 
                      value={formData.ownerId}
                      onChange={e => setFormData({...formData, ownerId: e.target.value})}
                      placeholder="admin@gmail.com"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">團隊成員 (Gmail, 以逗號分隔)</label>
                  <input 
                    type="text" 
                    value={formData.memberEmails}
                    onChange={e => setFormData({...formData, memberEmails: e.target.value})}
                    placeholder="user1@gmail.com, user2@gmail.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
                  >
                    確認建立 (Progress: 0%)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div 
            key={project.id} 
            onClick={() => onSelectProject(project.id)}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                project.status === ProjectStatus.ONGOING ? 'bg-green-50 text-green-600' : 
                project.status === ProjectStatus.PLANNING ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {project.status}
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                <ICONS.ChevronRight className="w-4 h-4" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{project.name}</h3>
            <p className="text-sm text-slate-400 mt-1 line-clamp-2 min-h-[40px]">{project.description}</p>
            
            <div className="mt-6 pt-4 border-t border-slate-50 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Progress</span>
                <span className="text-slate-900 font-black">{project.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center -space-x-2">
                  {project.members.map((m, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500" title={m.gmail}>
                      {m.gmail.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {project.members.length === 0 && <span className="text-[10px] text-slate-300 italic">No members</span>}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Team: {project.members.length}
                </div>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 italic">目前無任何專案，請點擊上方按鈕建立。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
