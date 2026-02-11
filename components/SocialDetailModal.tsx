import React, { useState } from 'react';
import { SocialContent, SocialStatus } from '../types';
import { ICONS } from '../constants';

interface SocialDetailModalProps {
    social: SocialContent;
    projectName: string;
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<SocialContent>) => void;
    onDelete: (id: string) => void;
}

const SocialDetailModal: React.FC<SocialDetailModalProps> = ({ social, projectName, onClose, onUpdate, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        title: social.title,
        content: social.content,
        platform: social.platform,
        status: social.status,
        publishTime: social.publishTime,
        hashtags: social.hashtags,
        theme: social.theme,
        materialLink: social.materialLink,
        budget: social.budget,
        date: social.date || new Date().toISOString().split('T')[0],
        postLink: social.postLink || '',
        type: social.type || '',
        collaborator: social.collaborator || ''
    });

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(social.id, { ...editForm });
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDelete(social.id);
        onClose();
    };

    if (isDeleting) {
        return (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsDeleting(false)}></div>
                <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 animate-in zoom-in-95 border border-red-100 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">確定要刪除此貼文？</h3>
                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                        貼文 <span className="text-red-600 font-black">"{social.title}"</span> 將被永久移除。
                    </p>
                    <div className="flex flex-col gap-3">
                        <button onClick={handleDelete} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-200">確認刪除</button>
                        <button onClick={() => setIsDeleting(false)} className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold">取消</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
            <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className={`p-8 text-white relative overflow-hidden shrink-0 ${editForm.platform === 'Instagram' ? 'bg-gradient-to-r from-pink-600 to-purple-600' :
                        editForm.platform === 'Facebook' ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
                            'bg-gradient-to-r from-slate-700 to-slate-800'
                    }`}>
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ICONS.Social className="w-64 h-64 -mr-10 -mt-10 transform rotate-12" />
                    </div>

                    <div className="relative z-10 flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <ICONS.Social className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-wider opacity-80 mb-0.5">Social Content</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.title}
                                            onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                            className="text-2xl font-black bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 w-full"
                                        />
                                    ) : (
                                        <h2 className="text-3xl font-black tracking-tight">{social.title}</h2>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm font-bold opacity-90">
                                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-lg">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                    專案: {projectName}
                                </span>
                                <span className={`px-3 py-1 rounded-lg ${social.status === '已發布' ? 'bg-green-500/20 text-white border border-green-400/30' :
                                        social.status === '排程' ? 'bg-blue-500/20 text-white border border-blue-400/30' :
                                            'bg-white/10 text-white/70 border border-white/10'
                                    }`}>
                                    {social.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                                    title="編輯"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            )}
                            <button
                                onClick={() => setIsDeleting(true)}
                                className="p-3 bg-white/10 hover:bg-red-500/80 text-white rounded-xl backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                                title="刪除"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-white/20 text-white rounded-xl transition-colors ml-2"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    {isEditing ? (
                        <form onSubmit={handleSaveEdit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">日期</label>
                                    <input type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">狀態</label>
                                    <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value as SocialStatus })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none">
                                        <option value="草稿">草稿</option>
                                        <option value="排程">排程</option>
                                        <option value="已發布">已發布</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">內容</label>
                                <textarea value={editForm.content} onChange={e => setEditForm({ ...editForm, content: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 min-h-[120px] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-y" placeholder="貼文內容..." />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">貼文連結</label>
                                <input type="url" value={editForm.postLink} onChange={e => setEditForm({ ...editForm, postLink: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" placeholder="https://..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Hashtags</label>
                                    <input type="text" value={editForm.hashtags} onChange={e => setEditForm({ ...editForm, hashtags: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">發布時間</label>
                                    <input type="datetime-local" value={editForm.publishTime} onChange={e => setEditForm({ ...editForm, publishTime: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">發布平台</label>
                                    <input type="text" value={editForm.platform} onChange={e => setEditForm({ ...editForm, platform: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">類型</label>
                                    <input type="text" value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">主題分類</label>
                                    <input type="text" value={editForm.theme} onChange={e => setEditForm({ ...editForm, theme: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">協作帳號</label>
                                    <input type="text" value={editForm.collaborator} onChange={e => setEditForm({ ...editForm, collaborator: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">素材檔案連結</label>
                                <input type="url" value={editForm.materialLink} onChange={e => setEditForm({ ...editForm, materialLink: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">廣告預算</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                    <input type="number" value={editForm.budget} onChange={e => setEditForm({ ...editForm, budget: Number(e.target.value) })} className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-3 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-200">
                                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors">取消編輯</button>
                                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">儲存變更</button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-8">
                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">貼文內容</h3>
                                    <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{social.content || '未填寫內容...'}</p>
                                </div>

                                {social.postLink && (
                                    <a href={social.postLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 group hover:bg-blue-100 transition-colors cursor-pointer">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs font-bold text-blue-500 uppercase mb-0.5">Post Link</p>
                                            <p className="text-blue-900 font-bold truncate">{social.postLink}</p>
                                        </div>
                                    </a>
                                )}

                                {social.materialLink && (
                                    <a href={social.materialLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100 group hover:bg-orange-100 transition-colors cursor-pointer">
                                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-200 transition-colors">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs font-bold text-orange-500 uppercase mb-0.5">Material Link</p>
                                            <p className="text-orange-900 font-bold truncate">{social.materialLink}</p>
                                        </div>
                                    </a>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">日期</label>
                                        <p className="text-slate-900 font-bold text-lg">{social.date || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">發布平台</label>
                                        <p className="text-slate-900 font-bold">{social.platform}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">發布時間</label>
                                        <p className="text-slate-900 font-bold">{social.publishTime ? new Date(social.publishTime).toLocaleString() : '-'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">類型</label>
                                        <p className="text-slate-900 font-bold">{social.type || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">主題分類</label>
                                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">{social.theme || '-'}</span>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">協作帳號</label>
                                        <p className="text-slate-900 font-bold">{social.collaborator || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Hashtags</label>
                                        <p className="text-blue-500 font-bold text-sm">{social.hashtags || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">廣告預算</label>
                                        <p className="text-green-600 font-black text-xl">${social.budget?.toLocaleString() || '0'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SocialDetailModal;
