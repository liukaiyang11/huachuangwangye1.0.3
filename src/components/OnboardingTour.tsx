
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, X, Check } from 'lucide-react';

interface Step {
    targetId: string;
    title: string;
    content: string;
    position: 'right' | 'bottom' | 'left' | 'top';
}

const TOUR_STEPS: Step[] = [
    {
        targetId: 'tour-sidebar-new',
        title: '开始新对话',
        content: '这是您的工作起点。点击这里可以快速创建新的聊天会话，或者通过“组建团队”功能让多个 AI 智能体协同为您工作。',
        position: 'right'
    },
    {
        targetId: 'tour-global-search',
        title: '全局搜索',
        content: '强大的 AI 搜索入口。您不仅可以搜索智能助手和功能，还可以直接搜索知识库中的文档内容。',
        position: 'bottom'
    },
    {
        targetId: 'tour-widgets',
        title: '个性化看板',
        content: '这是您的个人仪表盘。您可以添加天气、日程、快捷指令等小组件，点击“自定义看板”可调整布局。',
        position: 'top'
    },
    {
        targetId: 'tour-sidebar-nav',
        title: '功能导航',
        content: '快速切换不同模块：工作区处理任务，知识空间管理文档，助手广场发现更多 AI 能力。',
        position: 'right'
    }
];

export const OnboardingTour = () => {
    const { isTourActive, completeTour } = useApp();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });

    // Handle Resize
    useEffect(() => {
        const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Locate Target
    useEffect(() => {
        if (!isTourActive) return;

        const updateTarget = () => {
            const step = TOUR_STEPS[currentStepIndex];
            const element = document.getElementById(step.targetId);
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect(rect);
                // Ensure element is in view
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // If element not found (e.g., hidden in mobile), skip or finish
                console.warn(`Tour element not found: ${step.targetId}`);
            }
        };

        // Small delay to allow UI transitions
        const timer = setTimeout(updateTarget, 300);
        return () => clearTimeout(timer);
    }, [currentStepIndex, isTourActive, windowSize]);

    if (!isTourActive || !targetRect) return null;

    const step = TOUR_STEPS[currentStepIndex];
    const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

    // SVG Path to create the "hole" (Spotlight effect)
    const padding = 8;
    const rX = targetRect.left - padding;
    const rY = targetRect.top - padding;
    const rW = targetRect.width + (padding * 2);
    const rH = targetRect.height + (padding * 2);
    
    // SVG path string: Outer rectangle (screen) minus Inner rectangle (target)
    // M = Move to, L = Line to, h = horizontal, v = vertical, a = arc (rounded corners)
    // Using simple rectangle subtraction for the mask
    const radius = 16; // Corner radius for the highlight box

    // Calculate Tooltip Position
    let tooltipStyle: React.CSSProperties = {};
    const tooltipGap = 20;

    switch (step.position) {
        case 'right':
            tooltipStyle = { top: rY, left: rX + rW + tooltipGap };
            break;
        case 'left':
            tooltipStyle = { top: rY, right: windowSize.w - rX + tooltipGap };
            break;
        case 'bottom':
            tooltipStyle = { top: rY + rH + tooltipGap, left: rX };
            break;
        case 'top':
            tooltipStyle = { bottom: windowSize.h - rY + tooltipGap, left: rX };
            break;
    }

    // Boundary checks to keep tooltip on screen
    if (step.position === 'top' || step.position === 'bottom') {
         // Center horizontally relative to target, but clamp to screen
         const centeredLeft = rX + (rW / 2) - 160; // 160 is half of max-width roughly
         tooltipStyle.left = Math.max(20, Math.min(windowSize.w - 340, centeredLeft));
    }

    return (
        <div className="fixed inset-0 z-[999] overflow-hidden pointer-events-auto transition-opacity duration-500 animate-fade-in">
            {/* SVG Overlay Mask */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <mask id="tour-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <rect 
                            x={rX} y={rY} width={rW} height={rH} rx={radius} 
                            fill="black" 
                            className="transition-all duration-500 ease-in-out"
                        />
                    </mask>
                </defs>
                <rect 
                    x="0" y="0" width="100%" height="100%" 
                    fill="rgba(0,0,0,0.65)" 
                    mask="url(#tour-mask)" 
                />
                {/* Glowing border ring around target */}
                <rect 
                    x={rX} y={rY} width={rW} height={rH} rx={radius}
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="8 4"
                    className="animate-pulse opacity-50 transition-all duration-500 ease-in-out"
                />
            </svg>

            {/* Tooltip Card */}
            <div 
                className="absolute w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 border border-white/20 animate-slide-up transition-all duration-500 ease-in-out flex flex-col"
                style={tooltipStyle}
            >
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded-lg uppercase tracking-wider">
                        Step {currentStepIndex + 1}/{TOUR_STEPS.length}
                    </span>
                    <button onClick={completeTour} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    {step.content}
                </p>

                <div className="flex justify-between items-center mt-auto">
                    <button 
                        onClick={completeTour} 
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        跳过引导
                    </button>
                    <button 
                        onClick={() => {
                            if (isLastStep) {
                                completeTour();
                            } else {
                                setCurrentStepIndex(prev => prev + 1);
                            }
                        }}
                        className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-transform active:scale-95"
                    >
                        {isLastStep ? '开始体验' : '下一步'}
                        {isLastStep ? <Check size={16} /> : <ArrowRight size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
