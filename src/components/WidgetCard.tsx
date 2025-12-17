import React from 'react';
import { MoreVertical, RefreshCcw, EyeOff, Settings, GripHorizontal, Loader2 } from 'lucide-react';
import { WidgetSize } from '../types';

interface WidgetCardProps {
    id: string;
    title: string;
    children: React.ReactNode;
    className?: string;
    icon?: any;
    action?: React.ReactNode;
    isCustomizing: boolean;
    onResize: (size: WidgetSize) => void;
    menuOpen?: boolean;
    onActionClick?: (e: React.MouseEvent) => void;
    onHide: () => void;
    onRefresh: () => void;
    onSettings?: () => void;
    size: WidgetSize;
    isLoading?: boolean;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({ 
    id, title, children, className, icon: Icon, action, isCustomizing, 
    onResize, menuOpen, onActionClick, onHide, onRefresh, onSettings, size, isLoading 
}) => {
  return (
    <div className={`glass-panel glass-panel-hover rounded-[2rem] flex flex-col relative transition-all duration-500 ease-out border border-white/30 dark:border-white/5 shadow-suspended dark:shadow-suspended-dark overflow-hidden group/card ${isCustomizing ? 'ring-4 ring-brand-400 ring-dashed bg-brand-50/20 scale-[0.99] cursor-move' : ''} ${className}`}>
      <div className="flex justify-between items-center mb-4 px-6 pt-6 relative z-10">
        <div className="flex items-center space-x-3">
           <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-50/80 to-white/50 dark:from-brand-900/30 dark:to-slate-800/50 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-inner border border-white/50 dark:border-white/10 group-hover/card:scale-110 transition-transform duration-300">
              {Icon && <Icon size={20} strokeWidth={2.5}/>}
           </div>
           <h3 className="font-extrabold text-slate-800 dark:text-slate-100 eye-care:text-sepia-900 text-lg tracking-tight">{title}</h3>
        </div>
        <div className="flex items-center space-x-2 relative">
            {isCustomizing ? (
                <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-1 gap-1">
                    <button onClick={() => onResize('small')} className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${size === 'small' ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:bg-slate-100'}`} title="Small">S</button>
                    <button onClick={() => onResize('medium')} className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${size === 'medium' ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:bg-slate-100'}`} title="Medium">M</button>
                    <button onClick={() => onResize('wide')} className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${size === 'wide' ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:bg-slate-100'}`} title="Wide">W</button>
                    <button onClick={() => onResize('large')} className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${size === 'large' ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:bg-slate-100'}`} title="Large">L</button>
                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                    <div className="w-8 h-8 flex items-center justify-center text-slate-400 cursor-move"><GripHorizontal size={18}/></div>
                </div>
            ) : (
               <div className="relative flex items-center">
                   {action}
                   {!action && (
                      <>
                          <button onClick={onActionClick} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-full transition-all ml-1"><MoreVertical size={18} /></button>
                          {menuOpen && (
                              <div className="absolute right-0 top-full mt-2 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl w-36 py-2 origin-top-right animate-fade-in" onClick={(e) => e.stopPropagation()}>
                                  <button onClick={(e) => { e.stopPropagation(); onRefresh(); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"><RefreshCcw size={14}/> 刷新数据</button>
                                  <button onClick={(e) => { e.stopPropagation(); onHide(); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"><EyeOff size={14}/> 隐藏组件</button>
                                  <button onClick={(e) => { e.stopPropagation(); if(onSettings) onSettings(); }} className={`w-full text-left px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 ${!onSettings ? 'opacity-50 cursor-not-allowed' : ''}`}><Settings size={14}/> 设置</button>
                              </div>
                          )}
                      </>
                   )}
               </div>
            )}
        </div>
      </div>
      <div className="flex-1 relative z-0 flex flex-col h-full overflow-hidden">{children}</div>
      {isLoading && <div className="absolute inset-0 z-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex items-center justify-center rounded-[2rem] transition-all duration-300 animate-in fade-in"><Loader2 size={32} className="animate-spin text-brand-600 dark:text-brand-400" /></div>}
    </div>
  );
};