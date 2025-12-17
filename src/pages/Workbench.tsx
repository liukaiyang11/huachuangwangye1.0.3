
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle2, LayoutTemplate, Sparkles, ArrowRight, LayoutGrid, CloudRain, Edit3, Sun, Droplets, Wind, Leaf, Star, Plus, StickyNote, Upload, PenTool, Database, MessageSquare, Calendar as CalendarIcon, Zap, X, Pin, ChevronLeft, ChevronRight, FileText, Command, Bot } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FEATURED_APPS, FULL_AGENTS_LIST } from '../constants/data';
import { WidgetSize } from '../types';
import { WidgetCard } from '../components/WidgetCard';

export const Workbench = () => {
    const { widgets, setWidgets, pinnedAgentIds, setPinnedAgentIds, startNewChat, sessions, currentUser, knowledgeDb } = useApp();
    const navigate = useNavigate();
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [activeWidgetMenu, setActiveWidgetMenu] = useState<string | null>(null);
    const [refreshingWidgets, setRefreshingWidgets] = useState<string[]>([]);
    const [greeting, setGreeting] = useState("早安");
    
    // Manage Pinned Agents Modal
    const [showPinModal, setShowPinModal] = useState(false);
    const [pinSearchQuery, setPinSearchQuery] = useState("");

    // Global Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [searchResults, setSearchResults] = useState<{type: string, data: any}[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<Record<string, string[]>>({});
    
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("早安");
        else if (hour < 18) setGreeting("下午好");
        else setGreeting("晚上好");
    }, []);

    // Global Search Logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const q = searchQuery.toLowerCase();
        
        // 1. Search Agents
        const agentResults = FULL_AGENTS_LIST.filter(a => 
            a.name.toLowerCase().includes(q) || 
            a.description.toLowerCase().includes(q) || 
            a.category.toLowerCase().includes(q)
        ).slice(0, 3).map(a => ({ type: 'agent', data: a }));

        // 2. Search Knowledge
        const knowledgeResults = knowledgeDb.filter(k => 
            k.name.toLowerCase().includes(q)
        ).slice(0, 3).map(k => ({ type: 'knowledge', data: k }));

        // 3. Search Navigation/Features
        const navItems = [
            { name: '工作台', path: '/', icon: LayoutDashboardIcon },
            { name: '工作区 (对话)', path: '/workspace', icon: MessageSquare },
            { name: '知识空间', path: '/knowledge', icon: Database },
            { name: '助手广场', path: '/marketplace', icon: LayoutGrid },
            { name: '创作中心', path: '/creation', icon: PenTool },
            { name: '个人设置', path: '/settings', icon: SettingsIcon },
        ];
        // Simple mock icons for nav
        function LayoutDashboardIcon(props: any) { return <LayoutGrid {...props}/> }
        function SettingsIcon(props: any) { return <Zap {...props}/> }

        const navResults = navItems.filter(n => n.name.includes(q)).map(n => ({ type: 'nav', data: n }));

        setSearchResults([...agentResults, ...knowledgeResults, ...navResults]);
    }, [searchQuery, knowledgeDb]);

    // Close search on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchResultClick = (result: {type: string, data: any}) => {
        if (result.type === 'agent') {
            startNewChat(result.data);
            navigate('/workspace');
        } else if (result.type === 'knowledge') {
            navigate('/knowledge');
            // In a real app, you might pass a query param to open the file
        } else if (result.type === 'nav') {
            navigate(result.data.path);
        }
        setShowSearchDropdown(false);
        setSearchQuery("");
    };

    const getWidgetClass = (size: WidgetSize) => {
        switch (size) {
            case 'small': return 'col-span-12 md:col-span-3 h-48';
            case 'medium': return 'col-span-12 md:col-span-4 h-48'; 
            case 'wide': return 'col-span-12 md:col-span-8 h-48';
            case 'large': return 'col-span-12 md:col-span-6 h-[26rem]';
            case 'wide-large': return 'col-span-12 md:col-span-8 row-span-2 h-[26rem]';
            default: return 'col-span-12 md:col-span-4 h-48';
        }
    };

    const handleWidgetResize = (id: string, newSize: WidgetSize) => {
        setWidgets(prev => prev.map(w => w.id === id ? { ...w, size: newSize } : w));
    };

    const handleWidgetRefresh = (id: string) => {
        setRefreshingWidgets(prev => [...prev, id]);
        setTimeout(() => setRefreshingWidgets(prev => prev.filter(wid => wid !== id)), 1500);
    };
    
    const handleStartChat = (agent: any, sessionId?: string) => {
        startNewChat(agent, sessionId);
        navigate('/workspace');
    };

    const togglePinAgent = (agentId: string) => {
        if (pinnedAgentIds.includes(agentId)) {
            setPinnedAgentIds(prev => prev.filter(id => id !== agentId));
        } else {
            setPinnedAgentIds(prev => [...prev, agentId]);
        }
    };

    const filteredPinAgents = FULL_AGENTS_LIST.filter(agent => 
        agent.name.toLowerCase().includes(pinSearchQuery.toLowerCase()) || 
        agent.category.includes(pinSearchQuery)
    );

    // Calendar Helpers
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
    
    const handleAddEvent = (day: number) => {
        const eventText = window.prompt("添加日程:", "");
        if (eventText) {
            const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
            setEvents(prev => ({ ...prev, [key]: [...(prev[key] || []), eventText] }));
        }
    };

    const changeMonth = (delta: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const startDay = getFirstDayOfMonth(year, month);
        const today = new Date();
        const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

        const calendarDays = [];
        // Empty slots for previous month
        for (let i = 0; i < startDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="h-8"></div>);
        }
        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = isCurrentMonth && d === today.getDate();
            const key = `${year}-${month}-${d}`;
            const hasEvents = events[key] && events[key].length > 0;

            calendarDays.push(
                <div 
                    key={d} 
                    onClick={() => handleAddEvent(d)}
                    className={`h-8 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all relative group hover:bg-slate-100 dark:hover:bg-slate-700/50 ${isToday ? 'bg-brand-600 text-white shadow-md font-bold hover:bg-brand-700' : 'text-slate-700 dark:text-slate-300'}`}
                >
                    <span className="text-sm font-medium">{d}</span>
                    {hasEvents && <div className={`w-1 h-1 rounded-full mt-0.5 ${isToday ? 'bg-white' : 'bg-brand-500'}`}></div>}
                </div>
            );
        }
        return calendarDays;
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Top Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                {/* Left: Welcome Message */}
                <div className="w-full md:w-auto text-left">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                        {greeting}，{currentUser?.name || '开发者'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base">
                        {currentUser?.title ? `${currentUser.title} | ` : ''} 今天也要保持高效工作状态。
                    </p>
                </div>

                {/* Right: Search Box */}
                <div className="relative w-full md:w-[480px] group z-30" ref={searchRef} id="tour-global-search">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={22} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSearchDropdown(true);
                        }}
                        onFocus={() => setShowSearchDropdown(true)}
                        placeholder="搜索助手、知识库或功能..." 
                        className="w-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 focus:bg-white/95 dark:focus:bg-slate-800 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/50 outline-none rounded-[2rem] pl-14 pr-12 py-4 text-lg transition-all font-medium placeholder:text-slate-500/70 shadow-sm hover:shadow-md focus:shadow-xl" 
                    />
                    {searchQuery && (
                         <button 
                            onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X size={18} />
                        </button>
                    )}

                    {/* Search Dropdown */}
                    {showSearchDropdown && searchQuery && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-fade-in max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {searchResults.length > 0 ? (
                                <div className="py-2">
                                    {/* Group by type roughly via mapping order */}
                                    {searchResults.some(r => r.type === 'agent') && (
                                        <div className="mb-2">
                                            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Bot size={12}/> 智能助手</div>
                                            {searchResults.filter(r => r.type === 'agent').map(result => (
                                                <button key={result.data.id} onClick={() => handleSearchResultClick(result)} className="w-full px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 text-left transition-colors">
                                                    <div className={`w-8 h-8 rounded-lg ${result.data.avatarBg} flex items-center justify-center text-white`}>
                                                        {result.data.customIcon ? <result.data.customIcon size={16}/> : result.data.name[0]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{result.data.name}</div>
                                                        <div className="text-xs text-slate-500 truncate">{result.data.description}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {searchResults.some(r => r.type === 'knowledge') && (
                                        <div className="mb-2 border-t border-slate-100 dark:border-slate-800 pt-2">
                                            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><FileText size={12}/> 知识库</div>
                                            {searchResults.filter(r => r.type === 'knowledge').map((result, idx) => (
                                                <button key={idx} onClick={() => handleSearchResultClick(result)} className="w-full px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 text-left transition-colors">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-800">
                                                        <FileText size={16}/>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{result.data.name}</div>
                                                        <div className="text-xs text-slate-500">{result.data.date}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                     {searchResults.some(r => r.type === 'nav') && (
                                        <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                                            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Command size={12}/> 系统功能</div>
                                            {searchResults.filter(r => r.type === 'nav').map((result, idx) => (
                                                <button key={idx} onClick={() => handleSearchResultClick(result)} className="w-full px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 text-left transition-colors">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                                                        <result.data.icon size={16}/>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{result.data.name}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-400">
                                    <Search size={32} className="mx-auto mb-2 opacity-20"/>
                                    <p className="text-sm">未找到相关结果</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Featured Apps Section */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight mb-6 px-2 flex items-center gap-2"><Sparkles size={24} className="text-brand-500"/> 精选应用</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {FEATURED_APPS.map(app => (
                        <div key={app.id} className="group relative overflow-hidden rounded-[2rem] p-1 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10">
                            <div className="absolute inset-0 bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-white/5 rounded-[2rem]"></div>
                            <div className="relative p-6 flex items-center space-x-4 z-10 h-full">
                                <div className={`w-14 h-14 rounded-2xl ${app.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500 ease-out flex-shrink-0`}><app.icon size={28}/></div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1 truncate">{app.name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed text-xs">{app.description}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 flex-shrink-0"><ArrowRight size={16}/></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* My Dashboard Header */}
            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                    <LayoutGrid size={24} className="text-brand-500"/> 我的看板
                </h2>
                <button 
                    onClick={() => setIsCustomizing(!isCustomizing)} 
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                        isCustomizing 
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' 
                        : 'bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600'
                    }`}
                >
                    {isCustomizing ? <CheckCircle2 size={16} /> : <LayoutTemplate size={16} />}
                    {isCustomizing ? '完成布局' : '自定义看板'}
                </button>
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-12 gap-6 pb-12 auto-rows-min" id="tour-widgets">
                {widgets.filter(w => w.enabled).sort((a, b) => a.order - b.order).map(widget => (
                    <WidgetCard 
                        key={widget.id} 
                        id={widget.id}
                        title={widget.title} 
                        className={getWidgetClass(widget.size)} 
                        icon={widget.type === 'weather' ? CloudRain : widget.type === 'calendar' ? CalendarIcon : widget.type === 'pinned-agents' ? Star : widget.type === 'recent-chats' ? MessageSquare : Zap} 
                        isCustomizing={isCustomizing} 
                        size={widget.size} 
                        onResize={(s: WidgetSize) => handleWidgetResize(widget.id, s)}
                        menuOpen={activeWidgetMenu === widget.id} 
                        onActionClick={(e: any) => { e.stopPropagation(); setActiveWidgetMenu(activeWidgetMenu === widget.id ? null : widget.id); }} 
                        onHide={() => {}} 
                        onRefresh={() => handleWidgetRefresh(widget.id)} 
                        isLoading={refreshingWidgets.includes(widget.id)}
                    >
                        {/* Widget content */}
                        <div className="h-full overflow-hidden flex flex-col">
                            {widget.type === 'weather' && (
                                <div className="flex flex-col h-full justify-between p-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-col"><div className="text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tighter drop-shadow-sm">26°</div><button className="text-base font-bold text-slate-500 dark:text-slate-400 hover:text-brand-600 flex items-center gap-1 group mt-2">北京市, 朝阳区 <Edit3 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/></button></div>
                                        <Sun size={widget.size === 'small' ? 56 : 72} className="text-amber-400 animate-pulse-slow drop-shadow-lg"/>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 mt-auto rounded-2xl p-4 bg-white/30 dark:bg-slate-800/30">
                                        <div className="flex flex-col items-center"><span className="text-xs text-slate-400 font-bold uppercase mb-1">湿度</span><div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-bold text-sm"><Droplets size={16} className="text-blue-400"/> 45%</div></div>
                                        <div className="flex flex-col items-center border-l border-slate-200/50 dark:border-slate-700/50"><span className="text-xs text-slate-400 font-bold uppercase mb-1">风速</span><div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-bold text-sm"><Wind size={16} className="text-slate-400"/> 2级</div></div>
                                        <div className="flex flex-col items-center border-l border-slate-200/50 dark:border-slate-700/50"><span className="text-xs text-slate-400 font-bold uppercase mb-1">空气</span><div className="flex items-center gap-1 text-emerald-500 font-bold text-sm"><Leaf size={16}/> 优</div></div>
                                    </div>
                                </div>
                            )}
                            
                            {widget.type === 'pinned-agents' && (
                                <div className={`grid gap-6 h-full content-start pt-2 ${widget.size === 'small' ? 'grid-cols-2' : widget.size === 'medium' ? 'grid-cols-3' : widget.size === 'wide' ? 'grid-cols-6' : 'grid-cols-4'}`}>
                                    {pinnedAgentIds.slice(0, widget.size === 'small' ? 3 : widget.size === 'medium' ? 5 : widget.size === 'wide' ? 11 : 7).map(id => { 
                                        const agent = FULL_AGENTS_LIST.find(a => a.id === id); 
                                        if (!agent) return null; 
                                        return (
                                            <div key={id} onClick={() => handleStartChat(agent)} className="flex flex-col items-center justify-center gap-2 group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                                                <div className={`${widget.size === 'small' ? 'w-16 h-16' : 'w-20 h-20'} rounded-[1.2rem] ${agent.avatarBg} flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform`}>
                                                    {agent.customIcon ? <agent.customIcon size={widget.size === 'small' ? 28 : 36}/> : <span className="text-2xl font-bold">{agent.name[0]}</span>}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center line-clamp-1 w-full group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{agent.name}</span>
                                            </div>
                                        ) 
                                    })}
                                    
                                    {/* Add Button */}
                                    <button 
                                        onClick={() => setShowPinModal(true)}
                                        className="flex flex-col items-center justify-center gap-2 group cursor-pointer"
                                    >
                                        <div className={`${widget.size === 'small' ? 'w-16 h-16' : 'w-20 h-20'} rounded-[1.2rem] border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-400 flex items-center justify-center group-hover:border-brand-400 group-hover:text-brand-500 group-hover:bg-brand-50/50 transition-all duration-300 shadow-sm hover:shadow-md`}>
                                            <Plus size={28} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-500 group-hover:text-brand-600 transition-colors">添加</span>
                                    </button>
                                </div>
                            )}

                            {widget.type === 'recent-chats' && (
                                <div className="h-full flex flex-col">
                                    {sessions.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                            <MessageSquare size={56} className="mb-4 opacity-10"/>
                                            <span className="text-base font-medium">暂无最近会话</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1 flex-1">
                                            {sessions.slice(0, widget.size === 'small' ? 2 : widget.size === 'wide' ? 6 : 4).map(session => (
                                                <div key={session.id} onClick={() => handleStartChat(FULL_AGENTS_LIST.find(a=>a.id===session.agentId)!, session.id)} className="flex items-center justify-between p-4 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-2xl cursor-pointer group transition-all border border-transparent hover:border-white/50 dark:hover:border-slate-600 hover:shadow-sm">
                                                    <div className="flex items-center gap-4 overflow-hidden">
                                                        <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-slate-700 flex items-center justify-center text-brand-600 dark:text-slate-300 flex-shrink-0 shadow-sm"><MessageSquare size={24}/></div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-base font-bold text-slate-800 dark:text-slate-200 truncate">{session.title}</span>
                                                            <span className="text-sm text-slate-500 font-medium truncate opacity-80 mt-0.5">{session.messages[session.messages.length - 1]?.text || '无消息'}</span>
                                                        </div>
                                                    </div>
                                                    <ArrowRight size={20} className="text-brand-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"/>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                             {widget.type === 'calendar' && (
                                <div className="h-full flex flex-col p-2">
                                    <div className="flex items-center justify-between mb-4 px-1">
                                        <div className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={(e) => { e.stopPropagation(); changeMonth(-1)}} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><ChevronLeft size={20}/></button>
                                            <button onClick={(e) => { e.stopPropagation(); changeMonth(1)}} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><ChevronRight size={20}/></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                        {['日', '一', '二', '三', '四', '五', '六'].map(day => (<div key={day} className="text-xs font-bold text-slate-400 uppercase">{day}</div>))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center flex-1 content-start">
                                        {renderCalendar()}
                                    </div>
                                    <div className="mt-2 text-center text-xs text-slate-400">点击日期添加日程</div>
                                </div>
                             )}
                             
                            {widget.type === 'quick-actions' && (
                                <div className={`grid gap-4 h-full content-start pt-2 ${widget.size === 'small' ? 'grid-cols-2' : widget.size === 'medium' ? 'grid-cols-3' : widget.size === 'wide' ? 'grid-cols-6' : 'grid-cols-4'}`}>
                                    <div onClick={() => navigate('/creation')} className="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all cursor-pointer group hover:-translate-y-1">
                                        <div className={`w-16 h-16 rounded-[1.2rem] bg-purple-100/80 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3 border border-purple-200/50 dark:border-purple-700/30`}><PenTool size={32}/></div>
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center">创作助手</span>
                                    </div>
                                    <div onClick={() => navigate('/knowledge')} className="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all cursor-pointer group hover:-translate-y-1">
                                        <div className={`w-16 h-16 rounded-[1.2rem] bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3 border border-emerald-200/50 dark:border-emerald-700/30`}><Database size={32}/></div>
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center">构建知识</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </WidgetCard>
                ))}
            </div>

            {/* Pin Agents Modal */}
            {showPinModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowPinModal(false)}>
                    <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-white/20" onClick={e => e.stopPropagation()}>
                        <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-md">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Star className="text-amber-400 fill-amber-400" size={28}/> 编辑常用助手</h3>
                                <p className="text-base text-slate-500 mt-1">点击助手即可添加到看板，拖拽可排序（暂未实装拖拽）。</p>
                            </div>
                            <button onClick={() => setShowPinModal(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"><X size={24}/></button>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input 
                                    type="text" 
                                    value={pinSearchQuery}
                                    onChange={(e) => setPinSearchQuery(e.target.value)}
                                    placeholder="搜索助手名称..." 
                                    className="w-full bg-white dark:bg-slate-800 border-0 rounded-xl pl-12 pr-4 py-4 shadow-sm text-base focus:ring-2 focus:ring-brand-500/20"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {filteredPinAgents.map(agent => {
                                    const isPinned = pinnedAgentIds.includes(agent.id);
                                    return (
                                        <button 
                                            key={agent.id}
                                            onClick={() => togglePinAgent(agent.id)}
                                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${
                                                isPinned 
                                                ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800 ring-1 ring-brand-500/30' 
                                                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-lg ${agent.avatarBg} flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
                                                {agent.customIcon ? <agent.customIcon size={24}/> : agent.name[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-base font-bold text-slate-900 dark:text-white truncate">{agent.name}</div>
                                                <div className="text-sm text-slate-500 truncate">{agent.category}</div>
                                            </div>
                                            {isPinned && <CheckCircle2 size={20} className="text-brand-600 dark:text-brand-400 flex-shrink-0"/>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
                            <button onClick={() => setShowPinModal(false)} className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition-all">完成</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
