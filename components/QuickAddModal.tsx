import React, { useState } from 'react';
import { Project, Task, Meeting, Document, SocialContent, TaskStatus, Priority, SocialStatus, DocumentType } from '../types';
import { ICONS } from '../constants';

interface QuickAddModalProps {
    projects: Project[];
    onClose: () => void;
    onAddTask: (task: Omit<Task, 'id'>) => void;
    onAddMeeting: (meeting: Omit<Meeting, 'id'>) => void;
    onAddDoc: (doc: Omit<Document, 'id'>) => void;
    onAddSocial: (social: Omit<SocialContent, 'id'>) => void;
}

type QuickAddType = 'task' | 'meeting' | 'document' | 'social';

const QuickAddModal: React.FC<QuickAddModalProps> = ({
    projects,
    onClose,
    onAddTask,
    onAddMeeting,
    onAddDoc,
    onAddSocial
}) => {
    const [activeType, setActiveType] = useState<QuickAddType>('task');
    const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');

    // Task form state
    const [taskForm, setTaskForm] = useState({
        name: '',
        description: '',
        priority: Priority.MEDIUM,
        dueDate: '',
        assignee: ''
    });

    // Meeting form state
    const [meetingForm, setMeetingForm] = useState({
        title: '',
        time: '',
        duration: '60 min',
        link: '',
        attendees: '',
        type: '專案同步',
        remarks: ''
    });

    // Document form state
    const [docForm, setDocForm] = useState({
        name: '',
        documentType: '',
        fileUrl: ''
    });

    // Social form state
    const [socialForm, setSocialForm] = useState({
        title: '',
        content: '',
        platform: 'Facebook',
        publishTime: '',
        hashtags: '',
        theme: '',
        materialLink: '',
        budget: 0
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProjectId) {
            alert('請選擇專案');
            return;
        }

        switch (activeType) {
            case 'task':
                onAddTask({
                    projectId: selectedProjectId,
                    name: taskForm.name,
                    description: taskForm.description,
                    status: TaskStatus.TODO,
                    priority: taskForm.priority,
                    dueDate: taskForm.dueDate,
                    assignee: taskForm.assignee || undefined
                });
                break;

            case 'meeting':
                onAddMeeting({
                    projectId: selectedProjectId,
                    title: meetingForm.title,
                    time: meetingForm.time,
                    duration: meetingForm.duration,
                    link: meetingForm.link,
                    attendees: meetingForm.attendees.split(',').map(a => a.trim()).filter(a => a),
                    type: meetingForm.type,
                    remarks: meetingForm.remarks,
                    decisionContent: '',
                    decisionReason: '',
                    decisionMaker: '',
                    decisionTime: '',
                    isCompleted: false
                });
                break;

            case 'document':
                onAddDoc({
                    projectId: selectedProjectId,
                    name: docForm.name,
                    documentType: docForm.documentType,
                    fileUrl: docForm.fileUrl
                });
                break;

            case 'social':
                onAddSocial({
                    projectId: selectedProjectId,
                    title: socialForm.title,
                    content: socialForm.content,
                    platform: socialForm.platform,
                    status: SocialStatus.DRAFT,
                    publishTime: socialForm.publishTime,
                    hashtags: socialForm.hashtags,
                    theme: socialForm.theme,
                    materialLink: socialForm.materialLink,
                    budget: socialForm.budget
                });
                break;
        }

        onClose();
    };

    const tabs = [
        { id: 'task', label: '任務', icon: ICONS.Task },
        { id: 'meeting', label: '會議', icon: ICONS.Meeting },
        { id: 'document', label: '文件', icon: ICONS.Doc },
        { id: 'social', label: '社群', icon: ICONS.Social }
    ];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 border border-slate-100 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-slate-900">快速新增</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Type Tabs */}
                <div className="flex gap-2 mb-6 p-1 bg-slate-50 rounded-xl">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveType(tab.id as QuickAddType)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${activeType === tab.id
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Project Selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">
                            選擇專案 <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        >
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Task Form */}
                    {activeType === 'task' && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">任務名稱 <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    value={taskForm.name}
                                    onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
                                    placeholder="輸入任務名稱..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">描述</label>
                                <textarea
                                    value={taskForm.description}
                                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                    placeholder="任務描述..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-20 resize-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-2">優先序</label>
                                    <select
                                        value={taskForm.priority}
                                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Priority })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold outline-none focus:border-blue-500 transition-all"
                                    >
                                        <option value={Priority.LOW}>低</option>
                                        <option value={Priority.MEDIUM}>中</option>
                                        <option value={Priority.HIGH}>高</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-2">到期日 <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="date"
                                        value={taskForm.dueDate}
                                        onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">負責人 Email</label>
                                <input
                                    type="email"
                                    value={taskForm.assignee}
                                    onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                                    placeholder="assignee@example.com"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </>
                    )}

                    {/* Meeting Form */}
                    {activeType === 'meeting' && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">會議標題 <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    value={meetingForm.title}
                                    onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                                    placeholder="輸入會議標題..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-2">時間 <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="datetime-local"
                                        value={meetingForm.time}
                                        onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-2">時長</label>
                                    <input
                                        type="text"
                                        value={meetingForm.duration}
                                        onChange={(e) => setMeetingForm({ ...meetingForm, duration: e.target.value })}
                                        placeholder="60 min"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">會議連結</label>
                                <input
                                    type="url"
                                    value={meetingForm.link}
                                    onChange={(e) => setMeetingForm({ ...meetingForm, link: e.target.value })}
                                    placeholder="https://meet.google.com/..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">參與者 (逗號分隔)</label>
                                <input
                                    type="text"
                                    value={meetingForm.attendees}
                                    onChange={(e) => setMeetingForm({ ...meetingForm, attendees: e.target.value })}
                                    placeholder="user1@example.com, user2@example.com"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </>
                    )}

                    {/* Document Form */}
                    {activeType === 'document' && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">文件名稱 <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    value={docForm.name}
                                    onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                                    placeholder="輸入文件名稱..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">文件類型</label>
                                <input
                                    type="text"
                                    value={docForm.documentType}
                                    onChange={(e) => setDocForm({ ...docForm, documentType: e.target.value })}
                                    placeholder="例：提案、規格、簡報"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">文件連結</label>
                                <input
                                    type="url"
                                    value={docForm.fileUrl}
                                    onChange={(e) => setDocForm({ ...docForm, fileUrl: e.target.value })}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </>
                    )}

                    {/* Social Form */}
                    {activeType === 'social' && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">貼文標題 <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    value={socialForm.title}
                                    onChange={(e) => setSocialForm({ ...socialForm, title: e.target.value })}
                                    placeholder="輸入貼文標題..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">內容 <span className="text-red-500">*</span></label>
                                <textarea
                                    required
                                    value={socialForm.content}
                                    onChange={(e) => setSocialForm({ ...socialForm, content: e.target.value })}
                                    placeholder="貼文內容..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-24 resize-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-2">平台</label>
                                    <select
                                        value={socialForm.platform}
                                        onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold outline-none focus:border-blue-500 transition-all"
                                    >
                                        <option>Facebook</option>
                                        <option>Instagram</option>
                                        <option>Twitter</option>
                                        <option>LinkedIn</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-2">發布時間</label>
                                    <input
                                        type="datetime-local"
                                        value={socialForm.publishTime}
                                        onChange={(e) => setSocialForm({ ...socialForm, publishTime: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">Hashtags</label>
                                <input
                                    type="text"
                                    value={socialForm.hashtags}
                                    onChange={(e) => setSocialForm({ ...socialForm, hashtags: e.target.value })}
                                    placeholder="#hashtag1 #hashtag2"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-xl font-bold hover:bg-slate-100 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-4 bg-blue-600 text-white rounded-xl font-black shadow-xl hover:bg-blue-700 transition-colors"
                        >
                            新增{tabs.find(t => t.id === activeType)?.label}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuickAddModal;
