import React from 'react';
import { Bell, CheckCircle2, Info, AlertCircle, Clock, Trash2, Check } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../constants/data';

export const Notifications = () => {
    // In a real app, this state would be in AppContext
    const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'system': return <AlertCircle className="text-red-500" size={24} />;
            case 'task': return <CheckCircle2 className="text-emerald-500" size={24} />;
            case 'alert': return <Clock className="text-amber-500" size={24} />;
            default: return <Info className="text-blue-500" size={24} />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
             <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <Bell size={32} className="text-brand-600" />
                        消息中心
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">查看系统通知、任务提醒及重要公告。</p>
                </div>
                <button 
                    onClick={markAllRead}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all text-sm font-bold"
                >
                    <Check size={16} /> 全部已读
                </button>
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <Bell size={48} className="mx-auto mb-4 opacity-20" />
                        <p>暂无新消息</p>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div 
                            key={notification.id} 
                            className={`group relative flex gap-6 p-6 rounded-[2rem] border transition-all duration-300 ${
                                notification.read 
                                ? 'bg-white/40 dark:bg-slate-800/40 border-slate-100 dark:border-slate-700/50' 
                                : 'bg-white dark:bg-slate-800 border-brand-100 dark:border-brand-900/30 shadow-lg shadow-brand-500/5'
                            }`}
                        >
                            {!notification.read && <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-100 dark:ring-red-900/30"></div>}
                            
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600`}>
                                {getIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1">
                                <h3 className={`text-lg font-bold mb-1 ${notification.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                                    {notification.title}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                                    {notification.content}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400">{notification.date}</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.read && (
                                            <button 
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-xs font-bold text-brand-600 hover:text-brand-700 px-3 py-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-slate-700"
                                            >
                                                标为已读
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteNotification(notification.id)}
                                            className="text-slate-400 hover:text-red-500 px-2 py-1.5"
                                            title="删除"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
