import React, { useState, useRef } from 'react';
import { User, Image as ImageIcon, Monitor, LogOut, Save, Mail, Briefcase, Building2, Check, Moon, Sun, Eye, Loader2, Upload, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WALLPAPERS } from '../constants/data';
import { Wallpaper, ThemeMode } from '../types';

export const Settings = () => {
    const { currentUser, setCurrentUser, currentWallpaper, setCurrentWallpaper, themeMode, setThemeMode, logout } = useApp();
    const [name, setName] = useState(currentUser?.name || "");
    const [title, setTitle] = useState(currentUser?.title || "");
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Image compression utility
    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 256;
                    const MAX_HEIGHT = 256;
                    let width = img.width;
                    let height = img.height;

                    // Scale while maintaining aspect ratio
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL(file.type));
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSaveProfile = () => {
        if (currentUser) {
            setIsSaving(true);
            setTimeout(() => {
                // Update global state, which triggers sync to localStorage in AppContext
                setCurrentUser({ ...currentUser, name, title });
                setIsSaving(false);
                alert("个人信息已更新");
            }, 800);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && currentUser) {
            try {
                // Resize image before saving to avoid LocalStorage 5MB limit
                const resizedImage = await resizeImage(file);
                setCurrentUser({ ...currentUser, avatar: resizedImage });
            } catch (error) {
                console.error("Image processing failed", error);
                alert("头像上传失败，请重试");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                <SettingsIcon size={32} className="text-brand-600" />
                设置
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">管理您的个人资料、外观偏好及系统设置。</p>

            {/* Profile Section */}
            <section className="bg-white/60 dark:bg-slate-900/90 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-[2.5rem] p-8 mb-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <User size={24} className="text-brand-500" /> 个人资料
                </h2>
                
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar Upload */}
                    <div className="flex-shrink-0 text-center">
                        <div className="relative group w-32 h-32 mx-auto cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-32 h-32 rounded-full p-1 border-2 border-dashed border-slate-300 dark:border-slate-600 overflow-hidden bg-white dark:bg-slate-800">
                                <img src={currentUser?.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" size={24}/>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="text-sm font-bold text-slate-500 mt-3">点击更换头像</div>
                        <p className="text-xs text-slate-400 mt-1">支持 JPG, PNG (自动压缩)</p>
                    </div>

                    {/* Form */}
                    <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">姓名</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900 dark:text-white" />
                            </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">职位</label>
                                <div className="relative">
                                    <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900 dark:text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">邮箱 (不可修改)</label>
                                <div className="relative opacity-70">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="email" value={currentUser?.email} readOnly className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-9 pr-4 py-3 text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">所属组织</label>
                                <div className="relative opacity-70">
                                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" value={currentUser?.orgName} readOnly className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-9 pr-4 py-3 text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button onClick={handleSaveProfile} disabled={isSaving} className="px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all flex items-center gap-2 disabled:opacity-70">
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {isSaving ? '保存中...' : '保存修改'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Appearance Section */}
            <section className="bg-white/60 dark:bg-slate-900/90 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-[2.5rem] p-8 mb-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <Monitor size={24} className="text-brand-500" /> 外观设置
                </h2>

                {/* Theme Mode */}
                <div className="mb-8">
                    <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-4">界面主题</label>
                    <div className="flex gap-4">
                        {[
                            { id: 'light', name: '浅色模式', icon: Sun },
                            { id: 'dark', name: '深色模式', icon: Moon },
                            { id: 'eye-care', name: '护眼模式', icon: Eye }
                        ].map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => setThemeMode(mode.id as ThemeMode)}
                                className={`flex-1 py-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${themeMode === mode.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400' : 'border-transparent bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                <mode.icon size={24} />
                                <span className="font-bold text-sm">{mode.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Wallpaper */}
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-4">桌面壁纸</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {WALLPAPERS.map(wp => (
                            <button
                                key={wp.id}
                                onClick={() => setCurrentWallpaper(wp)}
                                className={`group relative aspect-video rounded-xl overflow-hidden shadow-sm transition-all ${currentWallpaper.id === wp.id ? 'ring-4 ring-brand-500 scale-95' : 'hover:scale-105'}`}
                            >
                                <div 
                                    className="absolute inset-0" 
                                    style={{ background: wp.type === 'image' ? `url(${wp.value}) center/cover` : wp.thumbColor || wp.value }} 
                                ></div>
                                {currentWallpaper.id === wp.id && (
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full bg-white text-brand-600 flex items-center justify-center shadow-lg"><Check size={20} strokeWidth={3} /></div>
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    {wp.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

             {/* System Section */}
             <section className="bg-white/60 dark:bg-slate-900/90 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">账号安全</h2>
                    <p className="text-slate-500 text-sm">当前登录版本 v1.0.0 (Enterprise)</p>
                </div>
                <button onClick={logout} className="px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-all flex items-center gap-2">
                    <LogOut size={18} /> 退出登录
                </button>
             </section>
        </div>
    );
};

const SettingsIcon = ({size, className}: any) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;