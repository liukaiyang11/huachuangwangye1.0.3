import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar as CalendarIcon, Quote } from 'lucide-react';
import { DAILY_QUOTES } from '../constants/data';

export const StandbyOverlay = () => {
    const { isStandbyMode, setIsStandbyMode, currentWallpaper } = useApp();
    const [time, setTime] = useState(new Date());
    const [quote, setQuote] = useState("");

    useEffect(() => {
        if (!isStandbyMode) return;
        const timer = setInterval(() => setTime(new Date()), 1000);
        setQuote(DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)]);
        return () => clearInterval(timer);
    }, [isStandbyMode]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isStandbyMode) setIsStandbyMode(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isStandbyMode, setIsStandbyMode]);

    if (!isStandbyMode) return null;

    const formattedTime = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const dateString = time.toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div 
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white overflow-hidden animate-fade-in"
            style={{ 
                background: currentWallpaper.type === 'image' 
                    ? `url(${currentWallpaper.value}) center/cover no-repeat` 
                    : currentWallpaper.value 
            }}
            onClick={() => setIsStandbyMode(false)}
        >
            {/* Blur Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-5xl px-8">
                {/* Clock */}
                <div className="text-[12rem] leading-none font-bold tracking-tighter drop-shadow-2xl font-mono mb-4 select-none">
                    {formattedTime}
                </div>
                
                {/* Date */}
                <div className="text-3xl font-light tracking-widest opacity-90 mb-20 uppercase flex items-center gap-3">
                    <CalendarIcon size={28} />
                    {dateString}
                </div>

                {/* Calendar & Quote Split */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Mini Calendar */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl mx-auto w-full max-w-sm hover:bg-white/15 transition-colors">
                        <div className="text-center text-lg font-bold mb-4 border-b border-white/10 pb-2">{time.getFullYear()}年 {time.getMonth() + 1}月</div>
                        <div className="grid grid-cols-7 gap-2 text-center text-sm">
                            {['日', '一', '二', '三', '四', '五', '六'].map(d => <div key={d} className="opacity-60">{d}</div>)}
                            {Array.from({length: 35}).map((_, i) => {
                                const day = i - new Date(time.getFullYear(), time.getMonth(), 1).getDay() + 1;
                                const isToday = day === time.getDate();
                                return (
                                    <div key={i} className={`aspect-square flex items-center justify-center rounded-full text-sm font-medium ${isToday ? 'bg-brand-500 shadow-lg font-bold' : 'opacity-80'} ${day > 0 && day <= 31 ? '' : 'opacity-20'}`}>
                                        {day > 0 && day <= 31 ? day : ''}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Quote */}
                    <div className="flex flex-col justify-center items-start space-y-4">
                        <Quote size={48} className="opacity-50 rotate-180" />
                        <p className="text-4xl font-serif leading-snug tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70">
                            {quote}
                        </p>
                        <div className="w-20 h-1 bg-brand-500 rounded-full mt-6"></div>
                        <p className="text-sm opacity-60 mt-2">点击任意位置或按键盘退出待机</p>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => setIsStandbyMode(false)}
                className="absolute top-8 right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all group"
            >
                <X size={24} className="group-hover:rotate-90 transition-transform"/>
            </button>
        </div>
    );
};
