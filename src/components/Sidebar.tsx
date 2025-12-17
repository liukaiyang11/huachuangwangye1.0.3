
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Database, LayoutGrid, PenTool, Bell, Settings, ChevronLeft, ChevronRight, Plus, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FULL_AGENTS_LIST } from '../constants/data';

export const CubeLogo = () => (
  <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 50 L95 25 V75 L50 100 V50 Z" fill="url(#grad_right)" />
    <path d="M50 50 L5 25 V75 L50 100 V50 Z" fill="url(#grad_left)" />
    <path d="M50 50 L95 25 L50 0 L5 25 L50 50 Z" fill="url(#grad_top)" />
    <defs>
      <linearGradient id="grad_top" x1="5" y1="25" x2="95" y2="25" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C4B5FD" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      <linearGradient id="grad_right" x1="50" y1="50" x2="95" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#4C1D95" />
      </linearGradient>
      <linearGradient id="grad_left" x1="5" y1="50" x2="50" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
  </svg>
);

const SidebarItem = ({ icon: Icon, label, path, collapsed }: any) => {
    const navigate = useNavigate();
    const location = useLocation();
    const active = location.pathname === path;

    return (
        <button
            onClick={() => navigate(path)}
            className={`w-full flex items-center px-5 py-4 my-2 rounded-2xl transition-all duration-200 group relative outline-none ${
            active
                ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25 font-bold"
                : "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
            } ${collapsed ? 'justify-center' : 'space-x-4'}`}
        >
            <div className={`relative flex items-center justify-center transition-all ${active ? '' : 'scale-100'}`}>
                <Icon size={22} className={active ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"} strokeWidth={active ? 2.5 : 2} />
            </div>
            {!collapsed && <span className={`text-base font-bold ${active ? 'tracking-wide' : ''} truncate`}>{label}</span>}
            {collapsed && (
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 text-slate-700 dark:text-white text-sm font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-75 pointer-events-none shadow-xl z-[100] whitespace-nowrap scale-95 group-hover:scale-100 origin-left">
                    {label}
                </div>
            )}
        </button>
    );
};

export const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { startNewChat, isStandbyMode, setIsStandbyMode } = useApp();
    const navigate = useNavigate();

    const handleNewChat = () => {
        const generalAgent = FULL_AGENTS_LIST.find(a => a.id === 'agent-general');
        if (generalAgent) {
            startNewChat(generalAgent);
            navigate('/workspace');
        }
    };

    return (
        <aside className={`${collapsed ? 'w-24' : 'w-64'} bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border-r border-white/20 dark:border-white/5 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] z-50 relative shadow-2xl shadow-brand-900/5`}>
            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 w-8 h-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all hover:scale-110 outline-none"
                title={collapsed ? "展开" : "折叠"}
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Logo */}
            <div className="h-28 flex items-center justify-center px-4 relative flex-shrink-0 group/logo">
                <div 
                    className={`flex items-center gap-4 cursor-pointer transition-all duration-500 p-3 rounded-2xl hover:bg-white/30 dark:hover:bg-white/5 ${collapsed ? 'justify-center' : ''}`} 
                    onClick={() => navigate('/')}
                >
                    <div className={`transition-transform duration-[1.5s] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/logo:rotate-[360deg] ${collapsed ? '' : ''} scale-110`}>
                        <CubeLogo />
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col animate-fade-in">
                            <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white leading-none mb-0.5">
                                元立方
                            </span>
                            <span className="text-brand-600 font-medium text-xs tracking-wide leading-none uppercase">
                                OmniCube
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* New Chat */}
            <div className="px-5 py-4 flex-shrink-0" id="tour-sidebar-new">
                <button
                    onClick={handleNewChat}
                    className={`w-full flex items-center ${collapsed ? 'justify-center p-4 aspect-square' : 'px-6 py-4 space-x-3'} bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-[1.2rem] hover:brightness-110 hover:translate-y-[-2px] transition-all duration-500 group overflow-visible relative shadow-lg shadow-brand-500/20`}
                    title="新建对话"
                >
                    <Plus size={collapsed ? 28 : 22} strokeWidth={3} className={`relative z-10 transition-transform duration-700 ease-out group-hover:rotate-180`} />
                    {!collapsed && <span className="font-bold text-base tracking-wide relative z-10">新建对话</span>}
                    {collapsed && (
                        <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 text-slate-700 dark:text-white text-sm font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-75 pointer-events-none shadow-xl z-[100] whitespace-nowrap scale-95 group-hover:scale-100 origin-left">
                            新建对话
                        </div>
                    )}
                </button>
            </div>

            {/* Navigation */}
            <div className={`flex-1 px-5 space-y-2 ${collapsed ? 'overflow-visible' : 'overflow-y-auto'} no-scrollbar py-2`} id="tour-sidebar-nav">
                <SidebarItem icon={LayoutDashboard} label="工作台" path="/" collapsed={collapsed} />
                <SidebarItem icon={MessageSquare} label="工作区" path="/workspace" collapsed={collapsed} />
                <SidebarItem icon={Database} label="知识空间" path="/knowledge" collapsed={collapsed} />
                <SidebarItem icon={LayoutGrid} label="助手广场" path="/marketplace" collapsed={collapsed} />
                <SidebarItem icon={PenTool} label="创作中心" path="/creation" collapsed={collapsed} />
            </div>

            {/* Bottom Actions */}
            <div className="p-5 mt-auto space-y-2 flex-shrink-0">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-4"></div>
                <SidebarItem icon={Bell} label="消息" path="/notifications" collapsed={collapsed} />
                <SidebarItem icon={Settings} label="设置" path="/settings" collapsed={collapsed} />
                
                <button 
                    onClick={() => setIsStandbyMode(!isStandbyMode)} 
                    className={`w-full flex items-center px-5 py-4 my-2 rounded-2xl transition-all duration-200 group relative outline-none ${
                        collapsed ? 'justify-center' : 'space-x-4'
                    } ${isStandbyMode ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                >
                    <div className="relative flex items-center justify-center">
                        <Leaf size={22} strokeWidth={2} />
                    </div>
                    {!collapsed && <span className="text-base font-bold truncate">待机</span>}
                    {collapsed && (
                        <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 text-slate-700 dark:text-white text-sm font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-75 pointer-events-none shadow-xl z-[100] whitespace-nowrap scale-95 group-hover:scale-100 origin-left">
                            待机
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};
