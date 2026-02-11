
import React, { useState, useEffect, useMemo } from 'react';
import {
  Project, Task, Meeting, SocialContent, Document, AppState,
  ProjectStatus, TaskStatus, SocialStatus, Priority, UserRole
} from './types';
import { ICONS } from './constants';
import { dataService } from './services/dataService';
import { authService } from './services/authService';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import TaskOverview from './components/TaskOverview';
import LoginModal from './components/LoginModal';

enum View {
  DASHBOARD = 'dashboard',
  PROJECT_LIST = 'project-list',
  PROJECT_DETAIL = 'project-detail',
  TASK_OVERVIEW = 'task-overview'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [data, setData] = useState<AppState>({
    projects: [],
    tasks: [],
    meetings: [],
    documents: [],
    socialContents: [],
    currentUser: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loadedData = await dataService.loadData();
        setData({
          ...loadedData,
          currentUser: authService.getCurrentUser()
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        console.error('Failed to load data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleNavigateToProject = (id: string) => {
    setSelectedProjectId(id);
    setCurrentView(View.PROJECT_DETAIL);
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'members'> & { memberEmails: string[] }) => {
    const newProject: Project = {
      id: `p-${Date.now()}`,
      ...projectData,
      progress: 0,
      members: projectData.memberEmails.map(gmail => ({
        gmail,
        role: UserRole.EDITOR,
        status: 'Active'
      }))
    };

    try {
      await dataService.createProject(newProject);
      setData(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('Failed to create project. Please try again.');
    }
  };

  const updateProject = async (id: string, updatedData: Partial<Project> & { memberEmails?: string[] }) => {
    const project = data.projects.find(p => p.id === id);
    if (!project) return;

    let members = project.members;
    if (updatedData.memberEmails) {
      members = updatedData.memberEmails.map(gmail => {
        const existing = project.members.find(m => m.gmail === gmail);
        return existing || { gmail, role: UserRole.EDITOR, status: 'Active' };
      });
    }

    const { memberEmails, ...rest } = updatedData;
    const updatedProject = { ...rest, members };

    try {
      await dataService.updateProject(id, updatedProject);
      setData(prev => ({
        ...prev,
        projects: prev.projects.map(p => p.id === id ? { ...p, ...updatedProject } : p)
      }));
    } catch (err) {
      console.error('Failed to update project:', err);
      alert('Failed to update project. Please try again.');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await dataService.deleteProject(id);
      setData(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== id),
        tasks: prev.tasks.filter(t => t.projectId !== id),
        meetings: prev.meetings.filter(m => m.projectId !== id),
        documents: prev.documents.filter(d => d.projectId !== id),
        socialContents: prev.socialContents.filter(s => s.projectId !== id)
      }));
      setCurrentView(View.PROJECT_LIST);
      setSelectedProjectId(null);
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('Failed to delete project. Please try again.');
    }
  };

  const addMember = (projectId: string, gmail: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;
        if (p.members.find(m => m.gmail === gmail)) return p;
        return {
          ...p,
          members: [...p.members, { gmail, role: UserRole.EDITOR, status: 'Active' }]
        };
      })
    }));
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: `t-${Date.now()}` };
    try {
      await dataService.createTask(newTask);
      setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await dataService.updateTask(taskId, updates);
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
      }));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await dataService.deleteTask(taskId);
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskId)
      }));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const toggleTaskStatus = (taskId: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id !== taskId) return t;
        const nextStatus = t.status === TaskStatus.TODO ? TaskStatus.DOING : t.status === TaskStatus.DOING ? TaskStatus.DONE : TaskStatus.TODO;
        return { ...t, status: nextStatus };
      })
    }));
  };

  const addMeeting = (meeting: Omit<Meeting, 'id'>) => {
    setData(prev => ({ ...prev, meetings: [...prev.meetings, { ...meeting, id: `m-${Date.now()}` }] }));
  };

  const updateMeeting = (meetingId: string, updates: Partial<Meeting>) => {
    setData(prev => ({
      ...prev,
      meetings: prev.meetings.map(m => m.id === meetingId ? { ...m, ...updates } : m)
    }));
  };

  const deleteMeeting = (meetingId: string) => {
    setData(prev => ({
      ...prev,
      meetings: prev.meetings.filter(m => m.id !== meetingId)
    }));
  };

  const addDoc = (doc: Omit<Document, 'id'>) => {
    setData(prev => ({ ...prev, documents: [...prev.documents, { ...doc, id: `d-${Date.now()}` }] }));
  };

  const updateDoc = (docId: string, updates: Partial<Document>) => {
    setData(prev => ({
      ...prev,
      documents: prev.documents.map(d => d.id === docId ? { ...d, ...updates } : d)
    }));
  };

  const deleteDoc = (docId: string) => {
    setData(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== docId)
    }));
  };

  const addSocial = (social: Omit<SocialContent, 'id'>) => {
    setData(prev => ({ ...prev, socialContents: [...prev.socialContents, { ...social, id: `s-${Date.now()}` }] }));
  };

  const updateSocial = (socialId: string, updates: Partial<SocialContent>) => {
    setData(prev => ({
      ...prev,
      socialContents: prev.socialContents.map(s => s.id === socialId ? { ...s, ...updates } : s)
    }));
  };

  const deleteSocial = (socialId: string) => {
    setData(prev => ({
      ...prev,
      socialContents: prev.socialContents.filter(s => s.id !== socialId)
    }));
  };

  // Login handlers
  const handleLogin = (email: string, password: string) => {
    const user = authService.loginWithEmail(email, password);
    if (user) {
      setData(prev => ({ ...prev, currentUser: user }));
      setShowLoginModal(false);
    }
  };

  const handleLineLogin = () => {
    const user = authService.loginWithLine();
    setData(prev => ({ ...prev, currentUser: user }));
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    authService.logout();
    setData(prev => ({ ...prev, currentUser: null }));
  };

  const selectedProject = useMemo(() =>
    data.projects.find(p => p.id === selectedProjectId),
    [data.projects, selectedProjectId]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        currentUser={data.currentUser}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto bg-[#FBFBFB]">
        <div className="max-w-7xl mx-auto p-4 md:p-10">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600">載入資料中...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="max-w-2xl mx-auto mt-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-red-800 font-semibold mb-2">⚠️ 載入失敗</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  重新載入
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          {!isLoading && !error && (
            <>
              {currentView === View.DASHBOARD && (
                <Dashboard
                  tasks={data.tasks}
                  meetings={data.meetings}
                  socials={data.socialContents}
                  projects={data.projects}
                  onToggleTask={toggleTaskStatus}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onUpdateMeeting={updateMeeting}
                  onDeleteMeeting={deleteMeeting}
                  onAddTask={addTask}
                  onAddMeeting={addMeeting}
                  onAddDoc={addDoc}
                  onAddSocial={addSocial}
                />
              )}

              {currentView === View.PROJECT_LIST && (
                <ProjectList
                  projects={data.projects}
                  onSelectProject={handleNavigateToProject}
                  onAddProject={addProject}
                />
              )}

              {currentView === View.PROJECT_DETAIL && selectedProject && (
                <ProjectDetail
                  project={selectedProject}
                  tasks={data.tasks.filter(t => t.projectId === selectedProject.id)}
                  meetings={data.meetings.filter(m => m.projectId === selectedProject.id)}
                  socials={data.socialContents.filter(s => s.projectId === selectedProject.id)}
                  docs={data.documents.filter(d => d.projectId === selectedProject.id)}
                  onAddTask={addTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onAddMeeting={addMeeting}
                  onUpdateMeeting={updateMeeting}
                  onDeleteMeeting={deleteMeeting}
                  onAddSocial={addSocial}
                  onUpdateSocial={updateSocial}
                  onDeleteSocial={deleteSocial}
                  onAddDoc={addDoc}
                  onUpdateDoc={updateDoc}
                  onDeleteDoc={deleteDoc}
                  onToggleTask={toggleTaskStatus}
                  onUpdateProject={updateProject}
                  onDeleteProject={deleteProject}
                  onInviteMember={addMember}
                />
              )}

              {currentView === View.TASK_OVERVIEW && (
                <TaskOverview
                  tasks={data.tasks}
                  projects={data.projects}
                  onToggleTask={toggleTaskStatus}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          onLineLogin={handleLineLogin}
        />
      )}
    </div>
  );
};

export default App;
