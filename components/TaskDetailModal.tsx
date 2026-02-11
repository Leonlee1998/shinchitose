
import React, { useState } from 'react';
import { Task, TaskStatus, Priority } from '../types';

interface TaskDetailModalProps {
  task: Task;
  projectName: string;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, projectName, onClose, onUpdate, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: task.name,
    description: task.description || '',
    priority: task.priority,
    dueDate: task.dueDate
  });

  const handleUpdateStatus = (status: TaskStatus) => {
    onUpdate(task.id, { status });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(task.id, editForm);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-200">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg mb-2 inline-block">
                {projectName}
              </span>
              {!isEditing ? (
                <h3 className="text-2xl font-black text-slate-900 leading-tight pr-8">{task.name}</h3>
              ) : (
                <input 
                  className="text-2xl font-black text-slate-900 w-full border-b-2 border-blue-500 outline-none"
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  autoFocus
                />
              )}
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">詳細說明</h4>
                <p className="text-slate-600 font-medium text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                  {task.description || '無詳細說明'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">優先序</h4>
                  <p className={`text-sm font-bold ${task.priority === Priority.HIGH ? 'text-red-500' : 'text-slate-700'}`}>{task.priority}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">截止日期</h4>
                  <p className="text-sm font-bold text-slate-700">{task.dueDate}</p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">任務狀態 (Status)</h4>
                <div className="flex gap-2">
                  {Object.values(TaskStatus).map(status => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(status)}
                      className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border ${
                        task.status === status 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                          : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-3">
                {!isDeleting ? (
                  <>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      編輯內容
                    </button>
                    <button 
                      onClick={() => setIsDeleting(true)}
                      className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </>
                ) : (
                  <div className="flex-1 bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center justify-between animate-in slide-in-from-bottom-2">
                    <p className="text-xs font-bold text-red-600">確定要刪除此任務？</p>
                    <div className="flex gap-2">
                      <button onClick={handleDelete} className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-black rounded-lg">確認</button>
                      <button onClick={() => setIsDeleting(false)} className="px-3 py-1.5 bg-white text-slate-500 text-[10px] font-black rounded-lg border border-slate-200">取消</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveEdit} className="space-y-4 animate-in fade-in">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">任務說明</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium h-32 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                  value={editForm.description}
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">優先序</label>
                   <select 
                     className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold"
                     value={editForm.priority}
                     onChange={e => setEditForm({...editForm, priority: e.target.value as Priority})}
                   >
                     {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">截止日</label>
                   <input 
                     type="date"
                     className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold"
                     value={editForm.dueDate}
                     onChange={e => setEditForm({...editForm, dueDate: e.target.value})}
                   />
                 </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-slate-50 text-slate-400 rounded-2xl font-bold text-xs">取消</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-blue-500/20">儲存更新</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
