import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, BookOpen, Database, Puzzle, Box, GitFork, Server, ArrowRight, PenTool, Layers, Zap, Network } from 'lucide-react';

export const Creation = () => {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'agent',
            title: '智能体编排',
            description: '设计并发布专属 AI 智能体，配置人设、提示词与编排逻辑。',
            icon: Bot,
            color: 'bg-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            text: 'text-blue-600 dark:text-blue-400',
            path: '/workspace' // Example link
        },
        {
            id: 'knowledge',
            title: '知识库管理',
            description: '上传企业私有文档，自动分段向量化，构建 RAG 检索增强能力。',
            icon: BookOpen,
            color: 'bg-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            text: 'text-emerald-600 dark:text-emerald-400',
            path: '/knowledge'
        },
        {
            id: 'database',
            title: '数据连接',
            description: '连接 MySQL、PostgreSQL 等业务数据库，赋予 AI 查询分析能力。',
            icon: Database,
            color: 'bg-indigo-600',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            text: 'text-indigo-600 dark:text-indigo-400',
            path: '#'
        },
        {
            id: 'plugins',
            title: '插件中心',
            description: '集成第三方 API 工具，如搜索、天气、办公软件，扩展 AI 执行边界。',
            icon: Puzzle,
            color: 'bg-violet-600',
            bg: 'bg-violet-50 dark:bg-violet-900/20',
            text: 'text-violet-600 dark:text-violet-400',
            path: '#'
        },
        {
            id: 'datasets',
            title: '数据集中心',
            description: '管理微调（Fine-tuning）与评估数据集，持续优化模型表现。',
            icon: Box, // Using Box to represent "Data Cubes" or sets
            color: 'bg-sky-600',
            bg: 'bg-sky-50 dark:bg-sky-900/20',
            text: 'text-sky-600 dark:text-sky-400',
            path: '#'
        },
        {
            id: 'workflow',
            title: '工作流引擎',
            description: '通过可视化画布编排复杂的业务流程，串联多个 AI 节点与操作。',
            icon: GitFork,
            color: 'bg-orange-600',
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            text: 'text-orange-600 dark:text-orange-400',
            path: '#'
        },
        {
            id: 'mcp',
            title: 'MCP 服务',
            description: '配置 Model Context Protocol 服务，实现跨应用的上下文互通与控制。',
            icon: Server,
            color: 'bg-slate-600',
            bg: 'bg-slate-100 dark:bg-slate-800',
            text: 'text-slate-600 dark:text-slate-400',
            path: '#'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-600 to-indigo-700 text-white p-10 mb-10 shadow-xl shadow-brand-500/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                            <PenTool size={24} className="text-white" />
                        </div>
                        <span className="font-bold tracking-wide text-brand-100 uppercase text-sm">Creation Studio</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">创作中心</h1>
                    <p className="text-brand-100 text-lg max-w-2xl leading-relaxed">
                        一站式 AI 资产构建平台。在这里，您可以编排智能体、管理知识库、配置插件与工作流，将企业的业务逻辑与数据转化为强大的 AI 生产力。
                    </p>
                </div>
            </div>

            {/* Quick Stats / Sub-nav (Visual Only as per screenshot hints) */}
            <div className="flex flex-wrap gap-4 mb-8">
                {['全部', '最近使用', '我的创建', '团队共享'].map((filter, idx) => (
                    <button 
                        key={filter} 
                        className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${idx === 0 ? 'bg-white dark:bg-slate-800 text-brand-600 shadow-sm' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Functional Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tools.map((tool) => (
                    <div 
                        key={tool.id}
                        onClick={() => tool.path !== '#' && navigate(tool.path)}
                        className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-[2rem] p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/5 flex flex-col h-64"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-14 h-14 rounded-2xl ${tool.bg} flex items-center justify-center ${tool.text} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                                <tool.icon size={28} />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
                                <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"/>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{tool.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-1">
                            {tool.description}
                        </p>

                        {/* Subtle Tag or Status */}
                        <div className="flex items-center gap-2">
                             <div className={`h-1.5 w-1.5 rounded-full ${tool.color}`}></div>
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available</span>
                        </div>
                    </div>
                ))}

                {/* Coming Soon Card */}
                <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] p-6 flex flex-col items-center justify-center text-slate-400 text-center h-64 group cursor-default">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Layers size={28} />
                    </div>
                    <h3 className="font-bold text-slate-500 dark:text-slate-400 mb-1">更多功能</h3>
                    <p className="text-xs">敬请期待</p>
                </div>
            </div>
        </div>
    );
};