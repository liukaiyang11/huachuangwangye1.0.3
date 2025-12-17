import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, LayoutGrid, Zap, Sparkles, MessageSquare, Briefcase, Mic, Presentation, TrendingUp, Award, Megaphone, Newspaper, Table, ArrowRight, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FULL_AGENTS_LIST } from '../constants/data';

const CATEGORIES = ['全部', '通用', 'HR', '文案', '办公', '市场', '营销', '销售', '财务', '工具', '资讯', '生活', '政务'];

export const Marketplace = () => {
    const { startNewChat, pinnedAgentIds, setPinnedAgentIds } = useApp();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("全部");

    const filteredAgents = FULL_AGENTS_LIST.filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || agent.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === '全部' || agent.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleStartChat = (agent: any) => {
        startNewChat(agent);
        navigate('/workspace');
    };

    const togglePin = (e: React.MouseEvent, agentId: string) => {
        e.stopPropagation();
        if (pinnedAgentIds.includes(agentId)) {
            setPinnedAgentIds(prev => prev.filter(id => id !== agentId));
        } else {
            setPinnedAgentIds(prev => [agentId, ...prev]);
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                    <LayoutGrid size={32} className="text-brand-600" />
                    助手广场
                </h1>
                <p className="text-slate-500 dark:text-slate-400">发现并使用企业级 AI 智能体，提升您的工作效率。</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center sticky top-0 z-20 py-4 bg-white/0 backdrop-blur-sm">
                <div className="relative flex-1 w-full group">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={20} />
                     <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="搜索助手名称或功能描述..." 
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 rounded-2xl pl-11 pr-4 py-3 outline-none shadow-sm transition-all"
                     />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                                activeCategory === cat 
                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' 
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAgents.map(agent => (
                    <div 
                        key={agent.id}
                        onClick={() => handleStartChat(agent)}
                        className="group relative bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-800 rounded-[2rem] p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/20 overflow-hidden"
                    >
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent dark:from-brand-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-14 h-14 rounded-2xl ${agent.avatarBg} flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform duration-500`}>
                                    {agent.customIcon ? <agent.customIcon size={28} /> : <span className="text-xl font-bold">{agent.name[0]}</span>}
                                </div>
                                <button 
                                    onClick={(e) => togglePin(e, agent.id)}
                                    className={`p-2 rounded-full transition-colors ${pinnedAgentIds.includes(agent.id) ? 'text-amber-400 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-300 hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                >
                                    <Star size={18} fill={pinnedAgentIds.includes(agent.id) ? "currentColor" : "none"} />
                                </button>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{agent.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 h-10 leading-relaxed">{agent.description}</p>

                            <div className="flex items-center justify-between mt-auto">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-500 dark:text-slate-300">
                                    {agent.category}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-slate-700 flex items-center justify-center text-brand-500 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredAgents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">未找到相关助手</p>
                    <p className="text-sm">尝试更换搜索词或分类</p>
                </div>
            )}
        </div>
    );
};
