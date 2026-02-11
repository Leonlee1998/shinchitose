
import React, { useState } from 'react';
import { Meeting } from '../types';

interface MeetingDetailModalProps {
  meeting: Meeting;
  projectName: string;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Meeting>) => void;
  onDelete: (id: string) => void;
}

const MeetingDetailModal: React.FC<MeetingDetailModalProps> = ({ meeting, projectName, onClose, onUpdate, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: meeting.title,
    time: meeting.time,
    duration: meeting.duration,
    link: meeting.link,
    type: meeting.type,
    remarks: meeting.remarks,
    decisionContent: meeting.decisionContent,
    decisionReason: meeting.decisionReason,
    decisionMaker: meeting.decisionMaker,
    decisionTime: meeting.decisionTime,
    attendees: meeting.attendees.join(', ')
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(meeting.id, {
      ...editForm,
      attendees: editForm.attendees.split(',').map(a => a.trim()).filter(a => a)
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(meeting.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-200">
        <div className="p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-lg mb-2 inline-block">
                {projectName} • 會議紀錄
              </span>
              {!isEditing ? (
                <h3 className="text-2xl font-black text-slate-900 leading-tight pr-8">{meeting.title}</h3>
              ) : (
                <input 
                  className="text-2xl font-black text-slate-900 w-full border-b-2 border-purple-500 outline-none"
                  value={editForm.title}
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">時間</h4>
                  <p className="text-sm font-bold text-slate-700">{meeting.time}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">類型</h4>
                  <p className="text-sm font-bold text-slate-700">{meeting.type}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">時長</h4>
                  <p className="text-sm font-bold text-slate-700">{meeting.duration}</p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">會議連結</h4>
                <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 inline-block hover:bg-blue-100 transition-colors">
                  {meeting.link || '未設定連結'}
                </a>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">與會人員</h4>
                <div className="flex flex-wrap gap-2">
                  {meeting.attendees.map(a => (
                    <span key={a} className="px-3 py-1 bg-slate-100 text-[11px] font-bold text-slate-600 rounded-lg border border-slate-200">
                      {a}
                    </span>
                  ))}
                  {meeting.attendees.length === 0 && <span className="text-slate-400 text-xs italic">無指定與會者</span>}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">會議備註 (Remarks)</h4>
                <div className="bg-slate-50/50 p-5 rounded-2xl text-sm text-slate-600 leading-relaxed whitespace-pre-line border border-slate-100/50 min-h-[80px]">
                  {meeting.remarks || '尚無備註'}
                </div>
              </div>

              <div className="bg-purple-50/30 p-6 rounded-3xl border border-purple-100">
                <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-3">關鍵決策 (Decisions)</h4>
                <p className="text-slate-900 font-black text-lg mb-3">
                  {meeting.decisionContent || '尚未錄入任何決策'}
                </p>
                {meeting.decisionReason && (
                  <div className="bg-white/60 p-3 rounded-xl mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">決策原因</p>
                    <p className="text-xs text-slate-500 italic">{meeting.decisionReason}</p>
                  </div>
                )}
                <div className="flex justify-between items-center text-[10px] font-black text-purple-400 uppercase tracking-widest">
                  <span>決策者: {meeting.decisionMaker || '-'}</span>
                  <span>時間: {meeting.decisionTime || '會中'}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-3">
                {!isDeleting ? (
                  <>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      編輯紀錄內容
                    </button>
                    <button 
                      onClick={() => setIsDeleting(true)}
                      className="w-14 h-14 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </>
                ) : (
                  <div className="flex-1 bg-red-50 p-5 rounded-2xl border border-red-100 flex items-center justify-between animate-in slide-in-from-bottom-2">
                    <div>
                       <p className="text-sm font-black text-red-600">確定刪除此會議紀錄？</p>
                       <p className="text-[10px] text-red-400">刪除後將無法恢復決策紀錄內容。</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white text-xs font-black rounded-xl">確認</button>
                      <button onClick={() => setIsDeleting(false)} className="px-4 py-2 bg-white text-slate-500 text-xs font-black rounded-xl border border-slate-200">取消</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveEdit} className="space-y-5 animate-in fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">日期與時間</label>
                  <input type="datetime-local" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold" value={editForm.time} onChange={e => setEditForm({...editForm, time: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">時長 / 類型</label>
                  <div className="flex gap-2">
                    <input className="w-1/2 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold" value={editForm.duration} onChange={e => setEditForm({...editForm, duration: e.target.value})} />
                    <input className="w-1/2 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold" value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">會議連結 (URL)</label>
                <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold" value={editForm.link} onChange={e => setEditForm({...editForm, link: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">備註內容</label>
                <textarea className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold h-24" value={editForm.remarks} onChange={e => setEditForm({...editForm, remarks: e.target.value})} />
              </div>

              <div className="bg-purple-50 p-5 rounded-3xl space-y-4">
                <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-widest">決策內容編輯</h4>
                <textarea className="w-full bg-white border border-purple-100 rounded-xl p-3 text-xs font-bold h-20" placeholder="決策內容..." value={editForm.decisionContent} onChange={e => setEditForm({...editForm, decisionContent: e.target.value})} />
                <input className="w-full bg-white border border-purple-100 rounded-xl p-3 text-xs font-bold" placeholder="決策人" value={editForm.decisionMaker} onChange={e => setEditForm({...editForm, decisionMaker: e.target.value})} />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold text-sm">取消</button>
                <button type="submit" className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-purple-500/20">儲存會議變更</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailModal;
