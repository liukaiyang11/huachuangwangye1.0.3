
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Bot, User, Loader2, Plus, X, MessageSquare, Briefcase, Zap, Search, UploadCloud, FileText, CheckCircle2, BookOpen, Building2, Globe, Folder, Check, File as FileIcon, ChevronDown, Users, ChevronUp, Upload, Paperclip, Database, Download, Printer, Share2, Terminal, AlertCircle, Copy, MessageCircle, FileImage, FileSpreadsheet, FileType } from 'lucide-react';
import { FULL_AGENTS_LIST } from '../constants/data';
import { Agent, ChatSession, Message } from '../types';
import { CubeLogo } from '../components/Sidebar';
import { llmService, LLMMessage } from '../services/llm'; // Updated Import

// --- Types & Constants ---
type AgentFormState = Record<string, any>;

interface AgentConfig {
    id: string;
    title: string;
    description: string;
    formType: 'mock-interview' | 'sales' | 'competitor' | 'speech' | 'host' | 'ppt' | 'brand' | 'promo' | 'doc-read' | 'optimizer' | 'translate' | 'general';
}

const AGENT_CONFIGS: Record<string, AgentConfig> = {
    'mock-interviewer': { id: 'mock-interviewer', title: '模拟面试官', description: '根据您上传的岗位说明和简历，智能生成技术/业务/综合面试题、参考答案及面试总结', formType: 'mock-interview' },
    'sales-script': { id: 'sales-script', title: '销售话术&一纸禅', description: '基于华为实战模板，智能生成高转化话术与一页纸方案，对准客户需求，让销售一击即中。', formType: 'sales' },
    'competitor-analysis': { id: 'competitor-analysis', title: '竞对分析', description: '依据法律法规及各平台公开的数据使用政策，自动监测竞品官网/社媒/专利数据，通过大模型提取公司和产品策略信息，生成标准的竞争分析报告。', formType: 'competitor' },
    'leader-speech': { id: 'leader-speech', title: '领导致辞生成器', description: '依据历史致辞稿，结合不同场合为领导致辞稿，辅助高效完成致辞内容创作', formType: 'speech' },
    'host-script': { id: 'host-script', title: '主持稿生成器', description: '点石成金，创意无限。只需简单描述你的活动主题、流程和要求，我就能迅速为你打造主持稿，助你每一次登台都光芒四射！', formType: 'host' },
    'ppt-outline': { id: 'ppt-outline', title: 'PPT大纲助手', description: '为您提供内容丰富、高有用性、逻辑结构严密的PPT大纲。', formType: 'ppt' },
    'brand-expert': { id: 'brand-expert', title: '品牌策划专家', description: '资深专业的品牌策划专家，对市场和受众用户有敏锐的洞察，能够为各个行业的品牌量身定制行之有效的品牌策划案。', formType: 'brand' },
    'product-promo': { id: 'product-promo', title: '产品推广文案', description: '资深产品营销文案专家，为产品定制化提供突出卖点、吸引目标受众的专业营销推广文案。', formType: 'promo' },
    'doc-reader': { id: 'doc-reader', title: '文档阅读助手', description: '上传文档，快速总结核心内容、提炼关键信息。', formType: 'doc-read' },
    'text-optimizer': { id: 'text-optimizer', title: '文本优化助手', description: '基于大模型优化引擎，提供论文、邮件、法律文书等多种文章类型，专业、简洁、标准等写作风格切换，可检测冗余内容并重构逻辑结构，提升内容专业度。', formType: 'optimizer' },
    'text-translate': { id: 'text-translate', title: '文本翻译', description: '精准的多语言互译，支持专业术语保留。', formType: 'translate' },
};

// --- Report Markdown Renderer ---
const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

const ReportMarkdown = ({ content }: { content: string }) => {
    const lines = content.split('\n');
    return (
        <div className="font-serif text-slate-800 text-[15px] leading-relaxed text-justify">
            {lines.map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={i} className="h-4" />;
                if (trimmed.startsWith('# ')) return <div key={i} className="mt-8 mb-6 pb-2 border-b-2 border-slate-900 break-after-avoid"><h1 className="text-2xl font-bold uppercase tracking-widest text-slate-900">{trimmed.slice(2)}</h1></div>;
                if (trimmed.startsWith('## ')) return <div key={i} className="mt-6 mb-3 flex items-center gap-2 break-after-avoid"><div className="w-1.5 h-5 bg-brand-700 rounded-full"></div><h2 className="text-lg font-bold text-brand-800">{trimmed.slice(3)}</h2></div>;
                if (trimmed.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-slate-900 mt-4 mb-2">{trimmed.slice(4)}</h3>;
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return <div key={i} className="flex gap-3 pl-2 mb-2"><span className="text-brand-700 font-bold">•</span><span className="flex-1">{parseBold(trimmed.slice(2))}</span></div>;
                if (/^\d+\.\s/.test(trimmed)) { const match = trimmed.match(/^(\d+)\.\s(.*)/); if (match) return <div key={i} className="flex gap-3 pl-2 mb-2"><span className="text-brand-700 font-bold font-mono">{match[1]}.</span><span className="flex-1">{parseBold(match[2])}</span></div>; }
                if (trimmed.startsWith('|') && trimmed.endsWith('|')) { const cols = trimmed.split('|').filter(c => c.trim() !== ''); if (trimmed.includes('---')) return null; return <div key={i} className="grid grid-flow-col auto-cols-fr gap-4 border-b border-slate-300 py-2 bg-slate-50/50 px-3 text-sm font-medium">{cols.map((col, idx) => <div key={idx}>{col.trim()}</div>)}</div> }
                return <p key={i} className="mb-2">{parseBold(trimmed)}</p>;
            })}
        </div>
    );
};

// --- Log Renderer ---
const LogRenderer = ({ content }: { content: string }) => (
    <div className="font-mono text-xs sm:text-sm text-green-400 bg-slate-950 p-8 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner border border-white/10 min-h-[500px]">
        {content}
    </div>
);

// --- Helpers ---
const getFileIcon = (name: string, type: string) => {
    if (type === 'knowledge') return <Database className="text-emerald-500" size={20} />;
    if (name.endsWith('.pdf')) return <FileText className="text-red-500" size={20} />;
    if (name.endsWith('.xlsx') || name.endsWith('.csv')) return <FileSpreadsheet className="text-green-500" size={20} />;
    if (name.match(/\.(jpg|jpeg|png|gif)$/i)) return <FileImage className="text-purple-500" size={20} />;
    return <FileIcon className="text-blue-500" size={20} />;
};

export const Workspace = () => {
    const { activeTabs, activeTabId, setActiveTabId, setActiveTabs, sessions, setSessions, startNewChat, knowledgeDb } = useApp();
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [workflowStep, setWorkflowStep] = useState<string>(""); 
    
    // Agent Selector State
    const [showAgentSelector, setShowAgentSelector] = useState(false);
    const [selectorMode, setSelectorMode] = useState<'create' | 'add'>('create');
    const [agentSearch, setAgentSearch] = useState("");
    const [selectedAgentsForGroup, setSelectedAgentsForGroup] = useState<string[]>(['agent-general']); 

    // Knowledge Modal States
    const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
    const [knowledgeSearch, setKnowledgeSearch] = useState("");
    const [knowledgeSpace, setKnowledgeSpace] = useState<'personal' | 'department' | 'shared'>('personal');
    const [tempSelectedKnowledge, setTempSelectedKnowledge] = useState<string[]>([]);
    
    // Chat Attachments
    const [chatAttachments, setChatAttachments] = useState<{type: string, name: string, size?: string, id?: string}[]>([]);
    const [showAttachMenu, setShowAttachMenu] = useState(false);

    // File Preview State
    const [previewFile, setPreviewFile] = useState<{name: string, content: string, type: 'pdf'|'txt', date: string} | null>(null);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatFileInputRef = useRef<HTMLInputElement>(null);

    const currentTab = activeTabs.find(t => t.id === activeTabId);
    const currentSession = sessions.find(s => s.id === currentTab?.sessionId);
    
    const currentAgent = currentSession 
        ? FULL_AGENTS_LIST.find(a => a.id === currentSession.agentId) 
        : null;

    const groupMembers = useMemo(() => {
        if (!currentSession || currentSession.type !== 'group') return [];
        return currentSession.members.map(mid => FULL_AGENTS_LIST.find(a => a.id === mid)).filter(Boolean) as Agent[];
    }, [currentSession]);
    
    const agentConfig = (currentAgent && currentSession?.type === 'single') ? AGENT_CONFIGS[currentAgent.id] : null;
    const isSplitLayout = !!agentConfig; 
    const messageCount = currentSession?.messages?.length || 0;

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentSession?.messages, activeTabId, isGenerating, workflowStep]);

    useEffect(() => {
        const handleClickOutside = () => setShowAttachMenu(false);
        if (showAttachMenu) window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [showAttachMenu]);

    // --- Weighted Recommendation Logic ---
    const sortedAgents = useMemo(() => {
        if (!agentSearch.trim()) return FULL_AGENTS_LIST;
        const q = agentSearch.toLowerCase();
        
        return [...FULL_AGENTS_LIST].sort((a, b) => {
            let scoreA = 0;
            let scoreB = 0;
            if (a.keywords?.some(k => q.includes(k.toLowerCase()))) scoreA += 10;
            if (b.keywords?.some(k => q.includes(k.toLowerCase()))) scoreB += 10;
            if (a.name.toLowerCase().includes(q)) scoreA += 5;
            if (b.name.toLowerCase().includes(q)) scoreB += 5;
            if (a.category.toLowerCase().includes(q)) scoreA += 3;
            if (b.category.toLowerCase().includes(q)) scoreB += 3;
            if (a.description.toLowerCase().includes(q)) scoreA += 1;
            if (b.description.toLowerCase().includes(q)) scoreB += 1;
            return scoreB - scoreA; 
        });
    }, [agentSearch]);

    // --- Helper: Message Converter ---
    const getStandardMessages = (msgs: Message[], currentUserInput?: string): LLMMessage[] => {
        const standardMsgs: LLMMessage[] = msgs.map(m => ({
            role: m.role,
            content: m.text
        }));
        if (currentUserInput) {
            standardMsgs.push({ role: 'user', content: currentUserInput });
        }
        return standardMsgs;
    };

    // --- Enhanced Workflow ---
    const runGroupWorkflow = async (session: ChatSession, userInput: string) => {
        if (!process.env.API_KEY) {
             const errorMsg = { role: "model" as const, text: "错误: 未配置 API Key。", isError: true, agentId: 'agent-general' };
             updateSessionMessages(session.id, errorMsg);
             return;
        }

        setIsGenerating(true);
        const pmAgent = FULL_AGENTS_LIST.find(a => a.id === 'agent-general');
        if (!pmAgent) return;

        const teamContext = groupMembers.filter(m => m.id !== 'agent-general').map(m => `${m.name} (${m.description})`).join(', ');
        let internalLogBuffer = `项目启动: ${new Date().toLocaleString()}\n项目目标: ${userInput}\n协作团队: PM, ${teamContext}\n\n`;

        try {
            setWorkflowStep("PM 正在拆解任务...");
            const pmSystemPrompt = `你是项目经理(PM)。你的团队成员有: ${teamContext}。
用户的目标是: "${userInput}"。
你的职责：
1. 分析用户需求。
2. 制定详细的执行计划，将任务分配给合适的成员。
3. 请以JSON格式输出你的决策:
{
  "action": "ASK" | "DELEGATE",
  "content": "内容 (如果是ASK，请填写问题；如果是DELEGATE，请填写任务分工)"
}`;

            const pmResponse = await llmService.chat({
                model: pmAgent.model,
                messages: getStandardMessages(session.messages, userInput),
                systemInstruction: pmSystemPrompt,
                jsonMode: true
            });

            let decision;
            try {
                decision = JSON.parse(pmResponse.text || '{}');
            } catch (e) {
                decision = { action: 'DELEGATE', content: pmResponse.text };
            }

            if (decision.action === 'ASK') {
                updateSessionMessages(session.id, { role: "model" as const, text: decision.content || "请提供更多信息", agentId: pmAgent.id });
                setIsGenerating(false);
                setWorkflowStep("");
                return;
            }

            internalLogBuffer += `[阶段一：任务规划]\n${decision.content}\n\n`;
            updateSessionMessages(session.id, { role: "model" as const, text: `任务规划已完成，团队开始执行。\n\n${decision.content}`, agentId: pmAgent.id });

            setWorkflowStep("团队成员正在撰写初稿...");
            const workers = groupMembers.filter(m => m.id !== 'agent-general');
            let workerDrafts: Record<string, string> = {};

            for (const worker of workers) {
                await new Promise(r => setTimeout(r, 800));
                const workerSystemPrompt = `你是 ${worker.name}。职责: ${worker.description}。
PM任务: "${decision.content}"。
用户需求: "${userInput}"。
请基于你的专业角色完成初稿。`;
                
                try {
                    const workerRes = await llmService.chat({
                        model: worker.model,
                        messages: [{ role: 'user', content: "开始任务" }], 
                        systemInstruction: workerSystemPrompt
                    });
                    const outputText = workerRes.text || "无产出";
                    workerDrafts[worker.id] = outputText;
                    internalLogBuffer += `[阶段二：${worker.name} 初稿]\n${outputText}\n\n`;
                    setSessions(prev => prev.map(s => s.id === session.id ? { ...s, messages: [...s.messages, { role: "model" as const, text: `【初稿】\n${outputText}`, agentId: worker.id, isCollapsed: true }] } : s));
                } catch (err) {}
            }

            setWorkflowStep("PM 发起圆桌讨论与质询...");
            const draftsText = workers.map(w => `[${w.name}]: ${workerDrafts[w.id]}`).join('\n\n');
            const critiquePrompt = `你是项目经理。现在进行“圆桌质询”环节。
用户需求: "${userInput}"。
团队初稿:
${draftsText}

请进行犀利的点评与质询：
1. 指出每个成员初稿中的逻辑漏洞或不完善之处。
2. 如果成员之间的观点有冲突，请指出来并要求统合。
3. 提出具体的修改要求。
请直接输出你的质询发言。`;

             const critiqueRes = await llmService.chat({
                model: pmAgent.model,
                messages: [{ role: 'user', content: "开始质询" }],
                systemInstruction: critiquePrompt
            });
            const critiqueText = critiqueRes.text;
            internalLogBuffer += `[阶段三：圆桌质询]\n${critiqueText}\n\n`;
            
            setSessions(prev => prev.map(s => s.id === session.id ? { ...s, messages: [...s.messages, { role: "model" as const, text: `🔥 圆桌质询：\n${critiqueText}\n\n请各成员根据意见进行修订。`, agentId: pmAgent.id }] } : s));

            setWorkflowStep("团队成员正在修订...");
            for (const worker of workers) {
                await new Promise(r => setTimeout(r, 1000));
                const refinePrompt = `你是 ${worker.name}。
PM 的质询意见: "${critiqueText}"。
你的初稿: "${workerDrafts[worker.id]}"。
请根据 PM 的意见，为你刚才的方案进行辩护或修正，输出最终完善的内容。`;

                 try {
                    const refineRes = await llmService.chat({
                        model: worker.model,
                        messages: [{ role: 'user', content: "请修订" }], 
                        systemInstruction: refinePrompt
                    });
                    const refinedText = refineRes.text;
                    workerDrafts[worker.id] = refinedText;
                    internalLogBuffer += `[阶段四：${worker.name} 修订稿]\n${refinedText}\n\n`;
                    setSessions(prev => prev.map(s => s.id === session.id ? { ...s, messages: [...s.messages, { role: "model" as const, text: `【修订稿】\n${refinedText}`, agentId: worker.id, isCollapsed: true }] } : s));
                } catch (err) {}
            }

            setWorkflowStep("PM 正在生成双重交付物...");
            const finalContext = workers.map(w => `[${w.name} 最终产出]: ${workerDrafts[w.id]}`).join('\n\n');
            
            const minutesPrompt = `你是项目经理。任务已完成。请基于以下过程记录，生成一份**精炼的会议纪要（Meeting Minutes）**。
上下文记录:
${internalLogBuffer}

要求：
1. 仅总结要点，不要罗列所有对话。
2. 包含：项目背景、关键决策、主要冲突与解决方案、后续待办(Action Items)。
3. 风格：专业、简洁、结构化（无需Markdown标题，用分隔线或缩进）。`;

            const minutesRes = await llmService.chat({
                model: pmAgent.model,
                messages: [{ role: 'user', content: "生成会议纪要" }],
                systemInstruction: minutesPrompt
            });
            const minutesContent = minutesRes.text;

            const reportPrompt = `你是项目经理。基于团队最终产出，生成一份**纯净的最终报告**。
用户需求: "${userInput}"。
团队最终产出: ${finalContext}

要求：
1. 报告结构清晰（背景、深度分析、方案详情、结论）。
2. **严禁**包含“讨论过程”、“审核意见”、“修正了...”等过程性描述。只展示最终结果。
3. 语气专业，适合企业交付。
4. 使用Markdown格式。`;

            const reportRes = await llmService.chat({
                model: pmAgent.model,
                messages: [{ role: 'user', content: "生成最终报告" }],
                systemInstruction: reportPrompt
            });
            const reportContent = reportRes.text;

            const dateStr = new Date().toISOString().slice(0,10);

            const logMsg: Message = { 
                role: "model", 
                text: "已整理协作过程纪要，包含关键决策路径与待办事项。", 
                agentId: pmAgent.id, 
                generatedFile: {
                    name: `协作过程纪要_${dateStr}.txt`,
                    type: 'txt',
                    content: minutesContent,
                    date: new Date().toLocaleString()
                }
            };

            const reportMsg: Message = { 
                role: "model", 
                text: "最终项目报告已生成，请查阅。", 
                agentId: pmAgent.id, 
                generatedFile: {
                    name: `项目报告_${dateStr}.pdf`,
                    type: 'pdf',
                    content: reportContent,
                    date: new Date().toLocaleString()
                }
            };

            setSessions(prev => prev.map(s => s.id === session.id ? { ...s, messages: [...s.messages, logMsg, reportMsg], updatedAt: new Date() } : s));
            
        } catch (error: any) {
             updateSessionMessages(session.id, { role: "model" as const, text: "团队协作出现异常: " + error.message, isError: true, agentId: pmAgent.id });
        } finally {
            setIsGenerating(false);
            setWorkflowStep("");
        }
    };

    const updateSessionMessages = (sessionId: string, newMsg: any) => {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, newMsg], updatedAt: new Date() } : s));
    };

    const handleSendMessage = async () => {
        if (!input.trim() || !currentSession || !currentAgent) return;
        
        let textToSend = input;
        if (chatAttachments.length > 0) {
             const attachInfo = chatAttachments.map(f => `[附件: ${f.name} (ID: ${f.id || 'local'})]`).join('\n');
             textToSend = `${textToSend}\n\n${attachInfo}`;
        }

        const userMsg = { role: "user" as const, text: textToSend };
        const updatedSession = { ...currentSession, messages: [...currentSession.messages, userMsg], updatedAt: new Date() };
        setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
        setInput("");
        setChatAttachments([]); 
        
        if (currentSession.type === 'group') {
            await runGroupWorkflow(updatedSession, textToSend);
            return;
        }

        if (!process.env.API_KEY) {
            updateSessionMessages(currentSession.id, { role: "model" as const, text: "错误: 未配置 API Key。", isError: true, agentId: currentAgent.id });
            return;
        }

        setIsGenerating(true);
        setWorkflowStep("正在思考...");

        try {
            const response = await llmService.chat({
                model: currentAgent.model,
                messages: getStandardMessages(updatedSession.messages),
                systemInstruction: currentAgent.systemInstruction
            });
            
            const modelMsg = { role: "model" as const, text: response.text || "无法生成回复", agentId: currentAgent.id };
            setSessions(prev => prev.map(s => s.id === currentSession.id ? { ...updatedSession, messages: [...updatedSession.messages, modelMsg] } : s));
        } catch (error: any) {
             updateSessionMessages(currentSession.id, { role: "model" as const, text: "Error: " + error.message, isError: true, agentId: currentAgent.id });
        } finally {
            setIsGenerating(false);
            setWorkflowStep("");
        }
    };

    // --- Interaction Handlers ---
    const toggleMessageCollapse = (msgIndex: number) => {
        if (!currentSession) return;
        const newMessages = [...currentSession.messages];
        newMessages[msgIndex] = { ...newMessages[msgIndex], isCollapsed: !newMessages[msgIndex].isCollapsed };
        setSessions(prev => prev.map(s => s.id === currentSession.id ? { ...s, messages: newMessages } : s));
    };

    const handleStartGroupChat = () => {
        if (selectedAgentsForGroup.length === 0) return;
        const agents = selectedAgentsForGroup.map(id => FULL_AGENTS_LIST.find(a => a.id === id)).filter(Boolean) as Agent[];
        startNewChat(agents);
        setShowAgentSelector(false);
        setAgentSearch("");
        setSelectedAgentsForGroup(['agent-general']); 
        setSelectorMode('create');
    };

    const handleAddMembers = () => {
        if (!currentSession || selectedAgentsForGroup.length === 0) return;
        const newMemberIds = selectedAgentsForGroup;
        
        setSessions(prev => prev.map(s => {
            if (s.id === currentSession.id) {
                return {
                    ...s,
                    members: [...new Set([...s.members, ...newMemberIds])]
                };
            }
            return s;
        }));

        const newAgents = FULL_AGENTS_LIST.filter(a => newMemberIds.includes(a.id));
        const systemMsg: Message = {
            role: 'model',
            text: `👋 系统通知：${newAgents.map(a => a.name).join(', ')} 加入了团队协作。`,
            agentId: 'agent-general',
            isCollapsed: false
        };
        updateSessionMessages(currentSession.id, systemMsg);

        setShowAgentSelector(false);
        setSelectorMode('create');
        setSelectedAgentsForGroup(['agent-general']);
    };

    const handleSingleChat = (agent: Agent) => {
        startNewChat(agent);
        setShowAgentSelector(false);
        setAgentSearch("");
        setSelectedAgentsForGroup(['agent-general']);
        setSelectorMode('create');
    };

    const toggleGroupSelect = (id: string) => {
        if (selectorMode === 'create' && id === 'agent-general') return;
        
        if (selectedAgentsForGroup.includes(id)) {
            setSelectedAgentsForGroup(prev => prev.filter(pid => pid !== id));
        } else {
            setSelectedAgentsForGroup(prev => [...prev, id]);
        }
    };

    const openAddMemberModal = () => {
        setSelectorMode('add');
        setAgentSearch("");
        setSelectedAgentsForGroup([]);
        setShowAgentSelector(true);
    };

    const handleChatFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setChatAttachments(prev => [...prev, { type: 'file', name: file.name, size: (file.size/1024).toFixed(1)+'KB' }]);
            setShowAttachMenu(false); // Close menu after select
        }
    };

    const handleSelectAgent = (agent: Agent) => {
        startNewChat(agent);
        setShowAgentSelector(false);
        setAgentSearch("");
    };

    const toggleKnowledgeSelection = (id: string) => {
        if (tempSelectedKnowledge.includes(id)) {
            setTempSelectedKnowledge(prev => prev.filter(k => k !== id));
        } else {
            setTempSelectedKnowledge(prev => [...prev, id]);
        }
    };

    const confirmKnowledgeSelection = () => {
        const newAttachments = tempSelectedKnowledge.map(id => {
                 const item = knowledgeDb.find(k => k.id === id);
                 return item ? { type: 'knowledge', name: item.name, id: item.id, size: item.size } : null;
            }).filter(Boolean) as any[];
        setChatAttachments(prev => [...prev, ...newAttachments]);
        setShowKnowledgeModal(false);
        setTempSelectedKnowledge([]);
    };

    const closeTab = (e: React.MouseEvent, tabId: string) => {
        e.stopPropagation();
        const newTabs = activeTabs.filter(t => t.id !== tabId);
        setActiveTabs(newTabs);
        if (activeTabId === tabId) {
            setActiveTabId(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null);
        }
    };

    const handleDownload = () => {
        if (!previewFile) return;
        const blob = new Blob([previewFile.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = previewFile.name;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        if (!previewFile) return;
        window.print();
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(`Check out this report: ${previewFile?.name} on OmniCube`);
        alert("链接已复制到剪贴板");
    };

    const filteredKnowledge = knowledgeDb.filter(k => 
        (k.space || 'personal') === knowledgeSpace && 
        k.name.toLowerCase().includes(knowledgeSearch.toLowerCase()) &&
        k.type !== 'folder'
    );
    
    // --- Render Components ---

    const renderAgentSelector = () => {
        if (!showAgentSelector) return null;
        
        const displayedAgents = sortedAgents.filter(agent => {
            if (selectorMode === 'add' && currentSession?.members.includes(agent.id)) {
                return false;
            }
            return true;
        });

        return (
            <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAgentSelector(false)}>
                <div className="bg-white dark:bg-slate-800 w-full max-w-3xl max-h-[85vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-white/20" onClick={e => e.stopPropagation()}>
                     <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-md">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {selectorMode === 'add' ? <Users size={24} className="text-brand-600"/> : <Bot size={24} className="text-brand-600"/>} 
                            {selectorMode === 'add' ? '邀请新成员' : '选择智能助手'}
                        </h3>
                        <button onClick={() => setShowAgentSelector(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><X size={24}/></button>
                     </div>
                     <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                        <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" value={agentSearch} onChange={(e) => setAgentSearch(e.target.value)} placeholder="输入任务目标，智能推荐相关助手..." autoFocus className="w-full bg-white dark:bg-slate-800 border-0 rounded-xl pl-12 pr-4 py-3 shadow-sm text-base focus:ring-2 focus:ring-brand-500/20"/></div>
                     </div>
                     <div className="flex-1 overflow-y-auto p-6 custom-scrollbar"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{displayedAgents.map(agent => {
                                 const isSelected = selectedAgentsForGroup.includes(agent.id);
                                 const isRecommended = agentSearch.trim().length > 0 && agent.keywords?.some(k => agentSearch.toLowerCase().includes(k));
                                 return (
                                     <div key={agent.id} className={`group relative flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer hover:shadow-md ${isSelected ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800 ring-1 ring-brand-500/30' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-brand-200 dark:hover:border-slate-600'} ${isRecommended ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800' : ''}`} onClick={() => toggleGroupSelect(agent.id)}>
                                        <div className={`w-10 h-10 rounded-lg ${agent.avatarBg} flex items-center justify-center text-white shadow-sm flex-shrink-0`}>{agent.customIcon ? <agent.customIcon size={20}/> : agent.name[0]}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{agent.name}</div>
                                                {isRecommended && <div className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 rounded">推荐</div>}
                                            </div>
                                            <div className="text-xs text-slate-500 truncate">{agent.category}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {selectorMode === 'create' && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleSingleChat(agent); }}
                                                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-all opacity-0 group-hover:opacity-100"
                                                    title="私聊"
                                                >
                                                    <MessageCircle size={16} />
                                                </button>
                                            )}
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>{isSelected && <Check size={12} strokeWidth={3}/>}</div>
                                        </div>
                                     </div>
                                );
                             })}</div></div>
                     <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center shadow-up">
                         <div className="text-sm font-medium text-slate-500">已选 <span className="text-brand-600 font-bold text-lg">{selectedAgentsForGroup.length}</span> 位 {selectorMode === 'create' && <span className="text-xs ml-1">(含 PM)</span>}</div>
                         <button 
                            onClick={selectorMode === 'create' ? handleStartGroupChat : handleAddMembers} 
                            disabled={selectedAgentsForGroup.length < (selectorMode === 'create' ? 2 : 1)} 
                            className="px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold shadow-lg hover:bg-brand-700 flex items-center gap-2 disabled:opacity-50"
                        >
                            {selectorMode === 'create' ? <><Users size={18} /> 组建团队</> : <><Plus size={18} /> 确认加入</>}
                        </button>
                     </div>
                </div>
            </div>
        );
    };

    // --- Main JSX ---
    return (
        <div className="flex-1 flex flex-col relative overflow-hidden h-full">
            {/* Tab Bar */}
            <div className="flex items-center px-4 pt-2 gap-2 overflow-x-auto no-scrollbar border-b border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md flex-shrink-0 z-20 h-14">
                {activeTabs.map(tab => (
                    <div 
                        key={tab.id}
                        onClick={() => setActiveTabId(tab.id)}
                        className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-sm font-bold cursor-pointer transition-all min-w-[120px] max-w-[200px] border-t border-x ${
                            activeTabId === tab.id 
                            ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 border-white/50 dark:border-white/10 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] translate-y-[1px] z-10' 
                            : 'text-slate-500 hover:bg-white/30 dark:hover:bg-slate-800/30 hover:text-slate-700 dark:hover:text-slate-200 border-transparent'
                        }`}
                    >
                            <div className="truncate flex-1">{tab.title}</div>
                            <button onClick={(e) => closeTab(e, tab.id)} className={`p-0.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 transition-all ${activeTabId === tab.id ? 'opacity-100' : ''}`}><X size={12} strokeWidth={3} /></button>
                    </div>
                ))}
                <button 
                    onClick={() => { setSelectorMode('create'); setShowAgentSelector(true); setAgentSearch(""); setSelectedAgentsForGroup(['agent-general']); }} 
                    className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-brand-600 transition-colors ml-1" 
                    title="新对话"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* Empty State */}
            {activeTabs.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60">
                    <button 
                        onClick={() => { setSelectorMode('create'); setShowAgentSelector(true); setAgentSearch(""); setSelectedAgentsForGroup(['agent-general']); }}
                        className="group flex flex-col items-center transition-transform hover:scale-105"
                    >
                        <div className="w-24 h-24 rounded-[2rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 shadow-sm group-hover:shadow-lg group-hover:bg-brand-50 dark:group-hover:bg-slate-700 transition-all">
                            <Plus size={40} className="text-slate-300 group-hover:text-brand-500 transition-colors" />
                        </div>
                        <p className="text-xl font-bold mb-2 text-slate-600 dark:text-slate-300">开启新对话</p>
                        <p className="text-sm">点击选择智能助手或组建团队</p>
                    </button>
                </div>
            )}

            {/* Content Area */}
            {activeTabs.length > 0 && (
                <>
                {currentSession?.type === 'group' && (
                    <div className="px-6 py-4 border-b border-white/10 flex items-center gap-4 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md z-10">
                        <div className="flex items-center -space-x-2">
                            {groupMembers.map(m => (
                                <div key={m.id} className={`w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 ${m.avatarBg} flex items-center justify-center text-white text-sm shadow-sm relative z-0`} title={m.name}>
                                    {m.customIcon ? <m.customIcon size={16}/> : m.name[0]}
                                </div>
                            ))}
                            <button 
                                onClick={openAddMemberModal}
                                className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-400 hover:bg-brand-50 transition-all z-10"
                                title="邀请新成员"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="flex-1">
                            <div className="text-base font-bold text-slate-800 dark:text-white">数字员工团队 ({groupMembers.length})</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">PM: 通用助手 | {isGenerating ? workflowStep : '待命中'}</div>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
                    {messageCount === 0 && !isSplitLayout && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
                            {currentSession?.type === 'group' ? <Users size={64} className="mb-6" /> : <Bot size={64} className="mb-6" />}
                            <p className="text-xl font-medium">{currentSession?.type === 'group' ? '发布任务，让团队为您工作' : '发送消息开始对话'}</p>
                        </div>
                    )}
                    
                    {currentSession?.messages?.map((msg, idx) => {
                        const agent = msg.role === 'model' ? FULL_AGENTS_LIST.find(a => a.id === msg.agentId) : null;
                        const isPM = msg.agentId === 'agent-general';
                        const isError = msg.isError;
                        
                        return (
                            <div key={idx} className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm relative z-10 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : isError ? 'bg-red-50 text-red-500 border border-red-200' : `bg-white dark:bg-slate-700 text-white ${agent?.avatarBg || 'bg-slate-400'}`}`}>
                                    {msg.role === 'user' ? <User size={24} /> : (agent?.customIcon ? <agent.customIcon size={24} /> : <Bot size={24} />)}
                                    {msg.role === 'model' && isPM && <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 rounded shadow-sm border border-white">PM</div>}
                                </div>

                                <div className={`max-w-[85%] flex flex-col items-start ${msg.role === 'user' ? 'items-end' : ''}`}>
                                    <div className="text-xs font-bold text-slate-400 mb-1.5 ml-1">{msg.role === 'user' ? '你' : agent?.name}</div>
                                    {msg.isCollapsed ? (
                                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-3 w-full shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700" onClick={() => toggleMessageCollapse(idx)}>
                                            <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600"><CheckCircle2 size={18} /></div>
                                            <div className="flex-1 text-base text-slate-600 dark:text-slate-300 font-medium truncate">{agent?.name} {msg.text.includes('修订') ? '已完成修订' : '已完成任务环节'}</div>
                                            <ChevronDown size={18} className="text-slate-400" />
                                        </div>
                                    ) : (
                                        <div className={`relative p-5 rounded-2xl text-base leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : isError ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-none' : `bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none border ${isPM ? 'border-brand-200 dark:border-brand-800 ring-1 ring-brand-500/10' : 'border-slate-100 dark:border-slate-600'}`}`}>
                                            {msg.role === 'model' && !isPM && <button onClick={() => toggleMessageCollapse(idx)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-brand-500"><ChevronUp size={16} /></button>}
                                            {msg.text}
                                            {msg.generatedFile && (
                                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-600">
                                                    <div onClick={() => setPreviewFile(msg.generatedFile as any)} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-brand-50 dark:hover:bg-slate-700 hover:border-brand-200 transition-all group">
                                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${msg.generatedFile.type === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-slate-800 text-green-400'}`}>
                                                            {msg.generatedFile.type === 'pdf' ? <FileText size={24} /> : <Terminal size={24} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-base font-bold text-slate-900 dark:text-white truncate">{msg.generatedFile.name}</div>
                                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2"><span>{msg.generatedFile.type === 'pdf' ? 'PDF 报告' : 'TXT 纪要'}</span><span className="w-1 h-1 rounded-full bg-slate-300"></span><span>{msg.generatedFile.date}</span></div>
                                                        </div>
                                                        <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm group-hover:bg-brand-600 group-hover:text-white transition-colors">预览</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {isGenerating && (
                        <div className="flex gap-5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white dark:bg-slate-700 text-brand-600 shadow-sm animate-pulse`}><Loader2 size={24} className="animate-spin" /></div>
                            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-600 flex items-center gap-3"><span className="text-base text-slate-500 dark:text-slate-400 font-medium">{currentSession?.type === 'group' ? (workflowStep || '团队协作中...') : '正在思考中...'}</span></div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                
                {/* Input Area */}
                {(!isSplitLayout || (isSplitLayout && messageCount > 0)) && (
                    <div className="p-6 bg-white/50 dark:bg-slate-900/50 border-t border-white/20 dark:border-white/5 backdrop-blur-md">
                        <div className="relative max-w-5xl mx-auto flex flex-col gap-3">
                            {/* Improved Attachment Tray */}
                            {chatAttachments.length > 0 && (
                                <div className="flex flex-wrap gap-3 animate-fade-in mb-1">
                                    {chatAttachments.map((att, idx) => (
                                        <div key={idx} className="relative group flex items-center gap-3 pl-3 pr-2 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all">
                                            <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                                {getFileIcon(att.name, att.type)}
                                            </div>
                                            <div className="flex flex-col min-w-0 max-w-[150px]">
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{att.name}</span>
                                                <span className="text-xs text-slate-400 truncate">{att.size || '未知大小'}</span>
                                            </div>
                                            <button 
                                                onClick={() => setChatAttachments(prev => prev.filter((_, i) => i !== idx))} 
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <X size={16}/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="relative">
                                <textarea 
                                    value={input} 
                                    onChange={(e) => setInput(e.target.value)} 
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} 
                                    placeholder={currentSession?.type === 'group' ? "向 PM 发布指令..." : "发送消息..."} 
                                    className="w-full bg-white dark:bg-slate-800 border-0 rounded-2xl pl-14 pr-16 py-5 focus:ring-2 focus:ring-brand-500/20 resize-none shadow-lg text-lg text-slate-700 dark:text-slate-200 placeholder:text-slate-400 transition-shadow" 
                                    rows={1}
                                />
                                
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <input type="file" ref={chatFileInputRef} className="hidden" onChange={handleChatFileUpload} />
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setShowAttachMenu(!showAttachMenu); }} 
                                        className={`p-2.5 rounded-xl transition-all ${showAttachMenu ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                    >
                                        <Paperclip size={20} />
                                    </button>

                                    {/* Styled Attachment Menu */}
                                    {showAttachMenu && (
                                        <div className="absolute bottom-full left-0 mb-3 bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-white/5 p-2 w-48 flex flex-col gap-1 animate-scale-up z-20 origin-bottom-left ring-1 ring-black/5">
                                            <button onClick={() => { chatFileInputRef.current?.click(); setShowAttachMenu(false); }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-brand-50 dark:hover:bg-white/10 rounded-xl text-sm text-slate-700 dark:text-slate-200 font-bold text-left w-full transition-colors group">
                                                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-800/40"><UploadCloud size={18} /></div>
                                                上传本地文件
                                            </button>
                                            <button onClick={() => { setShowKnowledgeModal(true); setShowAttachMenu(false); }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-brand-50 dark:hover:bg-white/10 rounded-xl text-sm text-slate-700 dark:text-slate-200 font-bold text-left w-full transition-colors group">
                                                <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-800/40"><Database size={18} /></div>
                                                引用知识库
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => handleSendMessage()} disabled={!input.trim() || isGenerating} className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-brand-600 text-white rounded-xl shadow-lg hover:bg-brand-700 hover:shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95">
                                    {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                </>
            )}

            {renderAgentSelector()}
            
            {showKnowledgeModal && (
                <div className="absolute inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowKnowledgeModal(false)}>
                    <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[70vh] border border-white/20" onClick={e => e.stopPropagation()}>
                        <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-md"><div><h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3"><BookOpen className="text-brand-500" size={28}/> 引用知识库</h3></div><button onClick={() => setShowKnowledgeModal(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"><X size={24}/></button></div>
                        <div className="flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                             <div className="p-6 flex flex-col sm:flex-row gap-6 items-center justify-between border-b border-slate-200 dark:border-slate-700"><div className="flex p-1.5 bg-slate-200/50 dark:bg-slate-800 rounded-2xl">{[{ id: 'personal', name: '个人空间', icon: User },{ id: 'department', name: '部门空间', icon: Building2 },{ id: 'shared', name: '共享空间', icon: Globe },].map(space => (<button key={space.id} onClick={() => setKnowledgeSpace(space.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-base font-bold transition-all ${knowledgeSpace === space.id ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><space.icon size={16} />{space.name}</button>))}</div><div className="relative w-full sm:w-72"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" value={knowledgeSearch} onChange={(e) => setKnowledgeSearch(e.target.value)} placeholder="搜索文档..." className="w-full bg-white dark:bg-slate-800 border-0 rounded-2xl pl-12 pr-4 py-3 text-base shadow-sm outline-none focus:ring-2 focus:ring-brand-500/20"/></div></div>
                             <div className="flex-1 overflow-y-auto p-6 custom-scrollbar"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{filteredKnowledge.map(item => (<div key={item.id} onClick={() => toggleKnowledgeSelection(item.id)} className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${tempSelectedKnowledge.includes(item.id) ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800 ring-1 ring-brand-500/30' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-brand-200 dark:hover:border-slate-600'}`}><div className="flex-shrink-0">{tempSelectedKnowledge.includes(item.id) ? <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center"><Check size={14} strokeWidth={3}/></div> : <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>}</div><div className="flex-shrink-0 text-brand-600 dark:text-brand-400"><FileText size={24} /></div><div className="flex-1 min-w-0"><div className="text-base font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</div><div className="text-xs text-slate-400 flex items-center gap-3 mt-1"><span>{item.date}</span><span>•</span><span>{item.size}</span></div></div></div>))}</div></div>
                        </div>
                        <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center"><span className="text-base text-slate-500">已选 <span className="font-bold text-brand-600">{tempSelectedKnowledge.length}</span> 个文件</span><div className="flex gap-4"><button onClick={() => setShowKnowledgeModal(false)} className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-base">取消</button><button onClick={confirmKnowledgeSelection} className="px-6 py-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 font-bold text-base shadow-lg shadow-brand-500/20">确认引用</button></div></div>
                    </div>
                </div>
            )}

            {/* Redesigned Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in" onClick={() => setPreviewFile(null)}>
                     <div className="bg-slate-100 dark:bg-slate-950 w-full max-w-6xl h-[92vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10" onClick={e => e.stopPropagation()}>
                        {/* Toolbar */}
                        <div className="flex justify-between items-center px-8 py-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 z-20 print:hidden">
                            <div className="flex items-center gap-5">
                                <div className={`p-3 rounded-2xl ${previewFile.type === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-slate-800 text-green-400'} shadow-sm`}>
                                    {previewFile.type === 'pdf' ? <FileText size={24} /> : <Terminal size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-xl tracking-tight">{previewFile.name}</h3>
                                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-0.5">
                                        <span className="px-2 py-0.5 rounded-md bg-slate-200/50 dark:bg-slate-800">{previewFile.type === 'pdf' ? '最终报告' : '过程纪要'}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span>{previewFile.date}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={handleShare} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 transition-colors" title="分享链接"><Share2 size={20} /></button>
                                <button onClick={handlePrint} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 transition-colors" title="打印"><Printer size={20} /></button>
                                <button onClick={handleDownload} className="px-5 py-3 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"><Download size={18} /> 下载文件</button>
                                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                                <button onClick={() => setPreviewFile(null)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"><X size={24} /></button>
                            </div>
                        </div>

                        {/* Viewer */}
                        <div id="printable-content" className="flex-1 overflow-y-auto bg-slate-200/60 dark:bg-black/40 p-10 flex justify-center custom-scrollbar print:p-0 print:bg-white print:overflow-visible relative">
                            {previewFile.type === 'pdf' ? (
                                <div className="relative bg-white shadow-2xl w-[210mm] min-h-[297mm] p-[20mm] flex flex-col text-slate-800 mx-auto transition-transform duration-300 origin-top print:shadow-none print:w-full print:mx-0 print:h-auto rounded-sm">
                                    <style>{`
                                        @media print {
                                            @page { margin: 0; size: auto; }
                                            body * { visibility: hidden; }
                                            #printable-content, #printable-content * { visibility: visible; }
                                            #printable-content { position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: visible; background: white; }
                                        }
                                    `}</style>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03] z-0 select-none"><div className="transform -rotate-45 text-9xl font-bold text-slate-900 whitespace-nowrap">CONFIDENTIAL</div></div>
                                    <header className="border-b-2 border-brand-800 pb-6 mb-8 flex justify-between items-end relative z-10"><div className="flex items-center gap-3"><div className="scale-75 origin-left"><CubeLogo /></div><div><div className="text-xl font-bold tracking-tight text-slate-900 font-serif">元立方 OmniCube</div><div className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Enterprise Intelligence</div></div></div><div className="text-right text-xs text-slate-500 leading-relaxed font-mono"><p>RPT-{Date.now().toString().slice(-8)}</p><p>{new Date().toLocaleDateString()}</p><p className="text-red-700 font-bold bg-red-50 px-1 inline-block mt-1">INTERNAL USE ONLY</p></div></header>
                                    <div className="flex-1 relative z-10"><ReportMarkdown content={previewFile.content} /></div>
                                    <footer className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-medium relative z-10 uppercase tracking-wider"><div className="flex items-center gap-2"><span>OmniCube Enterprise AI Platform</span><span className="w-1 h-1 rounded-full bg-slate-300"></span><span>Generated by Agent Team</span></div><div className="font-mono">Page 1 of 1</div></footer>
                                </div>
                            ) : (
                                <div className="w-full max-w-4xl mx-auto print:w-full">
                                    <style>{`
                                        @media print {
                                            @page { margin: 2cm; }
                                            body * { visibility: hidden; }
                                            #printable-content, #printable-content * { visibility: visible; }
                                            #printable-content { position: absolute; left: 0; top: 0; width: 100%; background: white; color: black; }
                                            .bg-slate-950 { background: white !important; color: black !important; border: none !important; box-shadow: none !important; }
                                            .text-green-400 { color: black !important; }
                                        }
                                    `}</style>
                                    <LogRenderer content={previewFile.content} />
                                </div>
                            )}
                        </div>
                     </div>
                </div>
            )}
        </div>
    );
};
