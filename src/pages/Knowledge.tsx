import React, { useState, useRef } from 'react';
import { Database, Folder, FileText, Search, Plus, Upload, ChevronRight, File as FileIcon, Download, Trash2, Table, Presentation, User, Building2, Globe, Eye, X, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { KnowledgeItem } from '../types';

export const Knowledge = () => {
    const { knowledgeDb, setKnowledgeDb, currentUser } = useApp();
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSpace, setActiveSpace] = useState<'personal' | 'department' | 'shared'>('personal');
    const [previewItem, setPreviewItem] = useState<KnowledgeItem | null>(null);
    
    // Modal & Upload States
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // CSS Grid Template for strict alignment
    // Name (flexible), Owner (fixed), Date (fixed), Size (fixed), Actions (fixed right)
    const GRID_TEMPLATE = "grid-cols-[minmax(200px,1fr)_120px_140px_100px_100px]";

    // Filter Items based on Space and Folder
    const currentItems = knowledgeDb.filter(item => {
        const itemSpace = item.space || 'personal';
        const matchesSpace = itemSpace === activeSpace;
        const matchesParent = item.parentId === (currentFolderId || null);
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSpace) return false;
        return searchQuery ? matchesSearch : matchesParent; 
    });

    const spaces = [
        { id: 'personal', name: '个人空间', icon: User, desc: '私有文件' },
        { id: 'department', name: '部门空间', icon: Building2, desc: '部门协作' },
        { id: 'shared', name: '共享空间', icon: Globe, desc: '项目组可见' },
    ];

    const canEdit = activeSpace !== 'shared';

    const breadcrumbs = () => {
        const crumbs = [{ id: null, name: '根目录' }];
        let curr = currentFolderId;
        const path = [];
        while (curr) {
            const folder = knowledgeDb.find(k => k.id === curr);
            if (folder) {
                path.unshift({ id: folder.id, name: folder.name });
                curr = folder.parentId || null;
            } else {
                break;
            }
        }
        return [...crumbs, ...path];
    };

    const confirmCreateFolder = () => {
        if (!newFolderName.trim()) return;
        const newFolder: KnowledgeItem = {
            id: `folder-${Date.now()}`,
            name: newFolderName,
            type: 'folder',
            owner: currentUser?.name || 'User',
            date: new Date().toISOString().split('T')[0],
            parentId: currentFolderId,
            space: activeSpace
        };
        setKnowledgeDb([newFolder, ...knowledgeDb]);
        setNewFolderName("");
        setShowFolderModal(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsUploading(true);
            const file = e.target.files[0];
            
            // Simulate upload delay
            setTimeout(() => {
                const newFile: KnowledgeItem = {
                    id: `file-${Date.now()}`,
                    name: file.name,
                    type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.docx') ? 'word' : 'txt',
                    owner: currentUser?.name || 'User',
                    date: new Date().toISOString().split('T')[0],
                    size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                    parentId: currentFolderId,
                    space: activeSpace
                };
                setKnowledgeDb([newFile, ...knowledgeDb]);
                setIsUploading(false);
                if(fileInputRef.current) fileInputRef.current.value = '';
            }, 1500);
        }
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!canEdit) return;
        if (confirm("确定要删除此项目吗？")) {
            setKnowledgeDb(prev => prev.filter(k => k.id !== id));
        }
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'folder': return <Folder className="text-brand-500 fill-brand-100" size={24} />;
            case 'pdf': return <FileText className="text-red-500" size={24} />;
            case 'word': return <FileText className="text-blue-500" size={24} />;
            case 'excel': return <Table className="text-emerald-500" size={24} />;
            case 'ppt': return <Presentation className="text-orange-500" size={24} />;
            default: return <FileIcon className="text-slate-400" size={24} />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col relative">
             {/* Header */}
             <div className="mb-6 flex-shrink-0 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <Database size={32} className="text-brand-600" />
                        知识空间
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">集中管理企业文档、数据与知识资产。</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-white/50 dark:bg-slate-800/50 rounded-[2rem] border border-white/30 dark:border-white/5 backdrop-blur-xl overflow-hidden flex flex-col shadow-xl">
                
                {/* Top Bar: Breadcrumbs + Space Tabs */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:px-6 md:py-4 border-b border-slate-200/50 dark:border-slate-700/50 gap-4 bg-white/40 dark:bg-slate-900/40">
                    {/* Breadcrumbs (Left) */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full">
                        <span className="text-slate-400 font-bold text-sm mr-2 whitespace-nowrap">当前目录:</span>
                        {breadcrumbs().map((crumb, index, arr) => (
                            <React.Fragment key={crumb.id || 'root'}>
                                <button 
                                    onClick={() => setCurrentFolderId(crumb.id as string)}
                                    className={`whitespace-nowrap font-bold text-sm px-2 py-1 rounded-lg transition-colors ${index === arr.length - 1 ? 'text-slate-900 dark:text-white cursor-default bg-white/50 dark:bg-slate-800 shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-brand-600'}`}
                                >
                                    {crumb.name}
                                </button>
                                {index < arr.length - 1 && <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Space Tabs (Right) */}
                    <div className="flex p-1 bg-slate-200/50 dark:bg-slate-900/50 rounded-xl flex-shrink-0 self-end md:self-auto">
                        {spaces.map(space => {
                            const Icon = space.icon;
                            const isActive = activeSpace === space.id;
                            return (
                                <button
                                    key={space.id}
                                    onClick={() => { setActiveSpace(space.id as any); setCurrentFolderId(null); }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                        isActive 
                                        ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                                >
                                    <Icon size={16} />
                                    {space.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between px-6 py-4 gap-4">
                     <div className="relative w-full md:w-80">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                         <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="搜索文件名、所有者..." 
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
                         />
                     </div>
                     {canEdit && (
                        <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => setShowFolderModal(true)} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors" title="新建文件夹">
                                <Plus size={20} />
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                            <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-500/30 hover:bg-brand-700 flex items-center gap-2 whitespace-nowrap transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-wait">
                                {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                                <span className="hidden sm:inline">{isUploading ? '上传中...' : '上传文件'}</span>
                            </button>
                        </div>
                     )}
                </div>

                {/* Table Header - Using Strict Grid */}
                <div className={`grid ${GRID_TEMPLATE} gap-4 px-6 py-3 border-b border-t border-slate-200/50 dark:border-slate-700/50 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/80 dark:bg-slate-900/40`}>
                    <div className="pl-2">名称</div>
                    <div className="hidden md:block">拥有者</div>
                    <div className="hidden md:block">修改日期</div>
                    <div className="hidden md:block text-right pr-4">大小</div>
                    <div className="text-right pr-2">操作</div>
                </div>

                {/* List - Using Same Grid */}
                <div className="flex-1 overflow-y-auto p-2">
                    {currentItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <Folder size={64} className="mb-4 opacity-10" />
                            <p className="font-medium">暂无文件</p>
                            {canEdit && <p className="text-sm mt-1 opacity-70">点击上方按钮上传或新建</p>}
                        </div>
                    ) : (
                        currentItems.map(item => (
                            <div 
                                key={item.id}
                                onClick={() => item.type === 'folder' ? setCurrentFolderId(item.id) : null}
                                onDoubleClick={() => item.type !== 'folder' && setPreviewItem(item)}
                                className={`grid ${GRID_TEMPLATE} gap-4 px-6 py-4 rounded-2xl hover:bg-white dark:hover:bg-slate-700/50 transition-colors items-center group cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-600 select-none`}
                            >
                                <div className="flex items-center gap-4 overflow-hidden pl-2">
                                    <div className="flex-shrink-0 transition-transform group-hover:scale-110">{getFileIcon(item.type)}</div>
                                    <span className="font-bold text-slate-700 dark:text-slate-200 truncate">{item.name}</span>
                                </div>
                                <div className="hidden md:flex items-center text-sm text-slate-500">
                                    <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-slate-600 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-bold mr-2 border border-white dark:border-slate-700 shadow-sm">
                                        {item.owner[0]}
                                    </div>
                                    <span className="truncate">{item.owner}</span>
                                </div>
                                <div className="hidden md:block text-sm text-slate-500 font-mono">{item.date}</div>
                                <div className="hidden md:block text-sm text-slate-500 text-right font-mono pr-4">{item.size || '-'}</div>
                                <div className="flex justify-end gap-1">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); item.type !== 'folder' && setPreviewItem(item); }}
                                        className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all" 
                                        title="预览"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    {canEdit && (
                                        <button 
                                            onClick={(e) => handleDelete(item.id, e)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            title="删除"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Create Folder Modal */}
            {showFolderModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowFolderModal(false)}>
                    <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">新建文件夹</h3>
                        <input 
                            type="text" 
                            autoFocus
                            value={newFolderName}
                            onChange={e => setNewFolderName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && confirmCreateFolder()}
                            placeholder="文件夹名称" 
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/20 mb-6"
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowFolderModal(false)} className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm">取消</button>
                            <button onClick={confirmCreateFolder} className="px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 font-bold text-sm shadow-lg shadow-brand-500/20">确定</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewItem && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setPreviewItem(null)}>
                    <div className="bg-white dark:bg-slate-800 w-full max-w-4xl h-[80vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600">
                                    {getFileIcon(previewItem.type)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{previewItem.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                        <span>{previewItem.size}</span>
                                        <span className="text-slate-300">•</span>
                                        <span>{previewItem.date}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="flex items-center gap-1"><User size={12}/> {previewItem.owner}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 flex items-center gap-2 shadow-lg shadow-brand-500/20">
                                    <Download size={16} /> 下载
                                </button>
                                <button onClick={() => setPreviewItem(null)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-8 overflow-y-auto relative">
                            {/* Watermark */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none overflow-hidden">
                                <div className="transform -rotate-45 text-9xl font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                    CONFIDENTIAL  CONFIDENTIAL
                                </div>
                            </div>

                            {previewItem.type === 'pdf' || previewItem.type === 'word' || previewItem.type === 'txt' ? (
                                <div className="w-full h-full max-w-3xl bg-white dark:bg-slate-900 shadow-2xl rounded-xl p-12 text-slate-300 flex flex-col items-center justify-start border border-slate-200 dark:border-slate-800 relative z-10">
                                    <div className="w-full border-b border-slate-100 dark:border-slate-800 pb-8 mb-8 text-center">
                                         <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{previewItem.name}</h1>
                                         <p className="text-sm text-slate-400 mt-2">文档预览模式</p>
                                    </div>
                                    
                                    <div className="w-full space-y-6 opacity-60">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-11/12"></div>
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                                        <div className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 text-sm">
                                            [图表占位符]
                                        </div>
                                         <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-slate-400 z-10">
                                    <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        {getFileIcon(previewItem.type)}
                                    </div>
                                    <p className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">无法在线预览此文件类型</p>
                                    <p className="text-sm">请下载后使用本地应用打开</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};