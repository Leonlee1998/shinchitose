
import React, { useState } from 'react';
import { Document, DocumentType } from '../types';
import { ICONS } from '../constants';

interface DocumentDetailModalProps {
    doc: Document;
    projectName: string;
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<Document>) => void;
    onDelete: (id: string) => void;
}

const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({ doc, projectName, onClose, onUpdate, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: doc.name,
        documentType: doc.documentType || '',
        type: doc.type || '',
        uploadedBy: doc.uploadedBy || '',
        version: doc.version || '',
        relatedTaskIds: doc.relatedTaskIds || ''
    });

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(doc.id, {
            ...editForm,
            type: editForm.type as DocumentType
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDelete(doc.id);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <ICONS.Doc className="w-6 h-6" />
                                {!isEditing ? (
                                    <h2 className="text-2xl font-black">{doc.name}</h2>
                                ) : (
                                    <input
                                        className="text-2xl font-black text-white bg-transparent border-b-2 border-white/50 w-full outline-none placeholder-blue-200"
                                        value={editForm.name}
                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                        autoFocus
                                    />
                                )}
                            </div>
                            <p className="text-blue-100 text-sm font-medium">專案: {projectName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[60vh] overflow-y-auto">
                    {!isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {doc.type && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">類型</label>
                                    <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold">
                                        {doc.type}
                                    </span>
                                </div>
                            )}

                            {doc.documentType && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">文件類型</label>
                                    <p className="text-slate-900 font-bold">{doc.documentType}</p>
                                </div>
                            )}

                            {doc.fileSize && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">文件大小</label>
                                    <p className="text-slate-900 font-bold">{doc.fileSize}</p>
                                </div>
                            )}

                            {doc.uploadedBy && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">上傳者</label>
                                    <p className="text-slate-900 font-bold">{doc.uploadedBy}</p>
                                </div>
                            )}

                            {doc.version && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">版本</label>
                                    <p className="text-slate-900 font-bold">{doc.version}</p>
                                </div>
                            )}

                            {doc.relatedTaskIds && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">相關任務 ID</label>
                                    <p className="text-slate-900 font-bold">{doc.relatedTaskIds}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <form id="edit-doc-form" onSubmit={handleSaveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Document Type</label>
                                <input
                                    type="text"
                                    value={editForm.documentType}
                                    onChange={e => setEditForm({ ...editForm, documentType: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Type</label>
                                <select
                                    value={editForm.type}
                                    onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold"
                                >
                                    <option value="">請選擇...</option>
                                    <option value="提案">提案</option>
                                    <option value="規格">規格</option>
                                    <option value="簡報">簡報</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Uploaded By</label>
                                <input
                                    type="text"
                                    value={editForm.uploadedBy}
                                    onChange={e => setEditForm({ ...editForm, uploadedBy: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Version</label>
                                <input
                                    type="text"
                                    value={editForm.version}
                                    onChange={e => setEditForm({ ...editForm, version: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Related Task Ids</label>
                                <input
                                    type="text"
                                    value={editForm.relatedTaskIds}
                                    onChange={e => setEditForm({ ...editForm, relatedTaskIds: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold"
                                />
                            </div>
                        </form>
                    )}

                    {/* File Preview/Download Section */}
                    {doc.fileUrl && !isEditing && (
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-3">文件操作</label>
                            <div className="flex gap-3">
                                <a
                                    href={doc.fileUrl}
                                    download={doc.name}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    下載文件
                                </a>
                                <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    預覽
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-6 border-t border-slate-100 flex gap-3 mt-6">
                        {!isDeleting ? (
                            <>
                                {!isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                        >
                                            編輯文件資訊
                                        </button>
                                        <button
                                            onClick={() => setIsDeleting(true)}
                                            className="w-14 h-14 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all"
                                        >
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold text-sm">取消</button>
                                        <button type="submit" form="edit-doc-form" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20">儲存變更</button>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="flex-1 bg-red-50 p-5 rounded-2xl border border-red-100 flex items-center justify-between animate-in slide-in-from-bottom-2">
                                <div>
                                    <p className="text-sm font-black text-red-600">確定刪除此文件？</p>
                                    <p className="text-[10px] text-red-400">刪除後將無法恢復。</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white text-xs font-black rounded-xl">確認</button>
                                    <button onClick={() => setIsDeleting(false)} className="px-4 py-2 bg-white text-slate-500 text-xs font-black rounded-xl border border-slate-200">取消</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentDetailModal;

