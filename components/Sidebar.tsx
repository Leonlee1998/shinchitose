
import React from 'react';
import { ICONS } from '../constants';
import { User } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  currentUser: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, currentUser, onLoginClick, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: '總覽', icon: ICONS.Dashboard },
    { id: 'project-list', label: '我的專案', icon: ICONS.Project },
    { id: 'task-overview', label: '任務總覽', icon: ICONS.Task },
  ];

  return (
    <aside className="w-20 md:w-64 bg-slate-900 text-slate-400 flex flex-col transition-all duration-300">
      <div className="p-6 text-white font-bold text-xl flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-xs">SC</div>
        <span className="hidden md:block truncate">Shinchitose</span>
      </div>

      <nav className="flex-1 mt-6 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-1 transition-colors ${currentView === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'hover:bg-slate-800 hover:text-slate-200'
              }`}
          >
            <item.icon className="w-5 h-5 min-w-[20px]" />
            <span className="hidden md:block font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800 hidden md:block">
        {currentUser ? (
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=3b82f6&color=fff`}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold truncate">{currentUser.name}</p>
                <p className="text-slate-400 text-xs truncate">{currentUser.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-bold transition-colors"
            >
              登出
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 font-bold text-sm transition-colors shadow-lg shadow-blue-500/20"
          >
            登入
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
