
import { Wallpaper, Agent, FeaturedApp, Widget, KnowledgeItem } from "../types";
import { 
    Server, ShieldCheck, BarChart3, Sparkles, Briefcase, MessageSquare, CloudRain, 
    Calendar as CalendarIcon, Zap, Bell, CheckCircle2, AlertCircle, Info,
    MessageSquareQuote, Mic2, Presentation, TrendingUp, Award, Megaphone, FileText, 
    Newspaper, Table, MessageCircle, UserSearch, ClipboardList, FileSearch, MailCheck, 
    FolderKanban, ClipboardCheck, FileEdit, MonitorPlay, Wand2, Languages, ArrowLeftRight, 
    BarChart4, Scroll, Gift, PenTool, Flag, BookOpen, GraduationCap, NotebookPen,
    PieChart, UserCog, ScanEye
} from "lucide-react";

export const WALLPAPERS: Wallpaper[] = [
    // Light Themes
    { 
        id: 'aurora', 
        name: '极光晨曦', 
        type: 'gradient', 
        value: 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 60%), radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.1) 0px, transparent 60%), radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.1) 0px, transparent 60%), #f0f4f8', 
        theme: 'light',
        thumbColor: 'linear-gradient(to bottom right, #e0e7ff, #f0f9ff)'
    },
    { 
        id: 'clouds', 
        name: '云端漫步', 
        type: 'gradient', 
        value: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)', 
        theme: 'light',
        thumbColor: '#fdfbfb'
    },
    { 
        id: 'bamboo', 
        name: '竹林清风', 
        type: 'gradient', 
        value: 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)', 
        theme: 'light',
        thumbColor: '#e6e9f0'
    },
    { 
        id: 'paper', 
        name: '宣纸质感', 
        type: 'gradient', 
        value: 'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)', 
        theme: 'light',
        thumbColor: '#fff1eb'
    },
    // Dark Themes
    { 
        id: 'gilded-black', 
        name: '鎏金黑', 
        type: 'gradient', 
        value: 'linear-gradient(160deg, #1a1a1a 0%, #000000 100%), radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.15), transparent 20%)', 
        theme: 'dark', 
        thumbColor: '#1a1a1a'
    },
    { 
        id: 'deep-ocean', 
        name: '深海幽蓝', 
        type: 'gradient', 
        value: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)', 
        theme: 'dark', 
        thumbColor: '#0f2027'
    },
    { 
        id: 'cyberpunk', 
        name: '赛博霓虹', 
        type: 'gradient', 
        value: 'linear-gradient(to right, #240b36, #c31432)', 
        theme: 'dark', 
        thumbColor: '#240b36'
    },
    { 
        id: 'midnight', 
        name: '午夜星空', 
        type: 'gradient', 
        value: 'linear-gradient(to top, #1e3c72 0%, #2a5298 100%)', 
        theme: 'dark', 
        thumbColor: '#1e3c72'
    }
];

export const DAILY_QUOTES = [
    "知行合一，止于至善。",
    "路虽远，行则将至；事虽难，做则必成。",
    "博学之，审问之，慎思之，明辨之，笃行之。",
    "流水不争先，争的是滔滔不绝。",
    "凡事预则立，不预则废。",
    "锲而舍之，朽木不折；锲而不舍，金石可镂。",
    "海纳百川，有容乃大；壁立千仞，无欲则刚。",
    "不积跬步，无以至千里；不积小流，无以成江海。"
];

export const MOCK_NOTIFICATIONS = [
    { id: 'n1', title: '系统维护通知', content: '系统将于本周六凌晨 2:00 进行例行维护，预计耗时 2 小时。', type: 'system', date: '10分钟前', read: false },
    { id: 'n2', title: '新的任务分配', content: '张经理为您分配了“Q3季度报表分析”任务，请及时查看。', type: 'task', date: '1小时前', read: false },
    { id: 'n3', title: '会议提醒', content: '您有一个关于“新产品发布”的会议将于 14:00 开始。', type: 'alert', date: '2小时前', read: true },
    { id: 'n4', title: '知识库更新', content: '技术部更新了《前端开发规范 v2.0》，建议阅读。', type: 'info', date: '昨天', read: true },
];

export const FULL_AGENTS_LIST: Agent[] = [
    { id: 'agent-general', name: '通用助手', description: '全能型AI助手，即问即答。', category: '通用', avatarBg: 'bg-gradient-to-br from-blue-500 to-indigo-600', model: 'gemini-2.5-flash', customIcon: Sparkles, isCreator: true, keywords: ['助手', '问答', '搜索', '通用'] },
    
    // HR
    { id: 'mock-interviewer', name: '模拟面试官', description: '智能生成技术/业务/综合面试题、参考答案及面试总结。', category: 'HR', avatarBg: 'bg-gradient-to-br from-orange-400 to-red-500', model: 'gemini-2.5-flash', customIcon: Briefcase, keywords: ['面试', '招聘', '求职', '问题', 'HR'] },
    { id: 'resume-screener', name: '简历筛选', description: '高效、公平地完成大规模简历初筛，提取关键信息。', category: 'HR', avatarBg: 'bg-gradient-to-br from-blue-400 to-blue-600', model: 'gemini-2.5-flash', customIcon: FileSearch, keywords: ['简历', '筛选', '候选人', '招聘'] },
    { id: 'offer-reviewer', name: 'Offer审核', description: '智能识别潜在风险，确保招聘质量与合规性。', category: 'HR', avatarBg: 'bg-gradient-to-br from-indigo-400 to-indigo-600', model: 'gemini-2.5-flash', customIcon: MailCheck, keywords: ['offer', '薪资', '合规', '入职'] },

    // Copywriting / Office
    { id: 'leader-speech', name: '领导致辞生成器', description: '快速生成正式、得体的领导开幕、闭幕或节日致辞。', category: '文案', avatarBg: 'bg-gradient-to-br from-blue-400 to-blue-500', model: 'gemini-2.5-flash', customIcon: MessageSquareQuote, keywords: ['致辞', '演讲', '领导', '发言', '开幕'] },
    { id: 'host-script', name: '主持稿生成器', description: '根据活动类型自动生成流畅、专业的会议或晚会主持稿。', category: '文案', avatarBg: 'bg-gradient-to-br from-purple-500 to-indigo-600', model: 'gemini-2.5-flash', customIcon: Mic2, keywords: ['主持', '晚会', '串词', '活动'] },
    { id: 'text-optimizer', name: '文本优化助手', description: '智能润色文章，提升表达流畅度与专业性。', category: '文案', avatarBg: 'bg-gradient-to-br from-teal-400 to-emerald-500', model: 'gemini-2.5-flash', customIcon: Wand2, keywords: ['润色', '修改', '优化', '改写'] },
    { id: 'meeting-minutes', name: '会议纪要生成助手', description: '支持文本输入，AI自动提取内容，区分发言角色，生成纪要。', category: '办公', avatarBg: 'bg-gradient-to-br from-blue-400 to-cyan-500', model: 'gemini-2.5-flash', customIcon: FileEdit, keywords: ['会议', '纪要', '总结', '记录'] },
    { id: 'smart-report', name: '智能汇报', description: '选择总结类型，基于优秀模板智能润色工作汇报。', category: '办公', avatarBg: 'bg-gradient-to-br from-indigo-500 to-purple-500', model: 'gemini-2.5-flash', customIcon: ClipboardCheck, keywords: ['汇报', '周报', '月报', '总结'] },
    { id: 'text-translate', name: '文本翻译', description: '精准的多语言互译，支持专业术语保留。', category: '工具', avatarBg: 'bg-gradient-to-br from-blue-500 to-indigo-500', model: 'gemini-2.5-flash', customIcon: Languages, keywords: ['翻译', '英语', '多语言'] },
    { id: 'public-account', name: '公众号写作助手', description: '生成吸引人的公众号文章结构与内容。', category: '营销', avatarBg: 'bg-gradient-to-br from-emerald-400 to-teal-500', model: 'gemini-2.5-flash', customIcon: PenTool, keywords: ['公众号', '文章', '推文', '自媒体'] },
    { id: 'blessing-generator', name: '祝福语生成器', description: '节日、生日、庆典专属祝福语一键生成。', category: '生活', avatarBg: 'bg-gradient-to-br from-orange-400 to-red-400', model: 'gemini-2.5-flash', customIcon: Gift, keywords: ['祝福', '节日', '生日'] },
    { id: 'thesis-helper', name: '论文生成器', description: '辅助生成论文大纲、摘要及参考文献整理。', category: '办公', avatarBg: 'bg-gradient-to-br from-teal-400 to-green-400', model: 'gemini-2.5-flash', customIcon: GraduationCap, keywords: ['论文', '学术', '大纲'] },

    // Marketing / Sales
    { id: 'competitor-analysis', name: '竞对分析', description: '深度分析竞争对手产品、策略与市场表现。', category: '市场', avatarBg: 'bg-gradient-to-br from-orange-500 to-amber-500', model: 'gemini-2.5-flash', customIcon: TrendingUp, keywords: ['竞对', '分析', '市场', '对手'] },
    { id: 'brand-expert', name: '品牌策划专家', description: '制定品牌定位、愿景及核心传播策略。', category: '市场', avatarBg: 'bg-gradient-to-br from-blue-600 to-indigo-600', model: 'gemini-2.5-flash', customIcon: Award, keywords: ['品牌', '策划', '定位', '营销'] },
    { id: 'product-promo', name: '产品推广文案', description: '撰写高转化率的产品种草与推广文案。', category: '营销', avatarBg: 'bg-gradient-to-br from-blue-500 to-cyan-500', model: 'gemini-2.5-flash', customIcon: Megaphone, keywords: ['推广', '文案', '种草', '产品'] },
    { id: 'sales-script', name: '销售话术&一纸禅', description: '基于实战模板，生成高转化话术与一页纸方案。', category: '销售', avatarBg: 'bg-gradient-to-br from-red-500 to-rose-600', model: 'gemini-2.5-flash', customIcon: MessageCircle, keywords: ['销售', '话术', '方案', '一页纸'] },
    { id: 'customer-insight', name: '客户洞察', description: '洞察当前客户的可合作深度与潜在需求。', category: '销售', avatarBg: 'bg-gradient-to-br from-orange-500 to-red-500', model: 'gemini-2.5-flash', customIcon: UserSearch, keywords: ['客户', '画像', '需求'] },

    // Tools
    { id: 'ppt-outline', name: 'PPT大纲助手', description: '输入主题，快速生成结构清晰的PPT演示大纲。', category: '办公', avatarBg: 'bg-gradient-to-br from-orange-400 to-red-400', model: 'gemini-2.5-flash', customIcon: Presentation, keywords: ['PPT', '演示', '幻灯片', '大纲'] },
    { id: 'ppt-assist', name: 'PPT辅助讲解', description: '上传PPT内容，获取AI辅助讲解思路和答疑建议。', category: '办公', avatarBg: 'bg-gradient-to-br from-slate-700 to-slate-900', model: 'gemini-2.5-flash', customIcon: MonitorPlay, keywords: ['演讲', '讲解', 'PPT'] },
    { id: 'doc-reader', name: '文档阅读助手', description: '快速提炼长文档核心观点与关键数据。', category: '工具', avatarBg: 'bg-gradient-to-br from-purple-500 to-indigo-500', model: 'gemini-2.5-flash', customIcon: BookOpen, keywords: ['阅读', '总结', '提炼', '文档'] },
    { id: 'chat-excel', name: 'ChatExcel', description: '通过对话操作Excel表格，进行数据筛选与计算。', category: '工具', avatarBg: 'bg-gradient-to-br from-purple-600 to-indigo-600', model: 'gemini-2.5-flash', customIcon: Table, keywords: ['Excel', '表格', '数据'] },
    { id: 'text-convert', name: '文本转换', description: '格式转换与内容重组，适应不同发布平台。', category: '工具', avatarBg: 'bg-gradient-to-br from-orange-400 to-amber-500', model: 'gemini-2.5-flash', customIcon: ArrowLeftRight, keywords: ['转换', '格式'] },

    // Enterprise / Finance / Info
    { id: 'daily-summary', name: '行业每日摘要', description: '聚合行业最新资讯，生成每日简报。', category: '资讯', avatarBg: 'bg-gradient-to-br from-indigo-500 to-blue-600', model: 'gemini-2.5-flash', customIcon: Newspaper, keywords: ['资讯', '新闻', '简报'] },
    { id: 'project-analysis', name: '项目分析助手', description: '输入要点，智能生成项目分析纪要，聚焦当前进度。', category: '办公', avatarBg: 'bg-gradient-to-br from-blue-500 to-indigo-500', model: 'gemini-2.5-flash', customIcon: FolderKanban, keywords: ['项目', '分析', '管理'] },
    { id: 'planning-report', name: '策划报告生成', description: '自动解析填充到对应的策划报告模板中。', category: '办公', avatarBg: 'bg-gradient-to-br from-blue-500 to-cyan-600', model: 'gemini-2.5-flash', customIcon: ClipboardList, keywords: ['策划', '报告', '方案'] },
    { id: 'financial-analysis', name: '财务报表分析', description: '深度解读财务数据，识别经营风险与机会。', category: '财务', avatarBg: 'bg-gradient-to-br from-red-400 to-orange-500', model: 'gemini-2.5-flash', customIcon: BarChart4, keywords: ['财务', '报表', '金融', '数据'] },
    { id: 'party-building', name: '智慧党建助手', description: '提供党建知识查询、活动策划与文书辅助。', category: '政务', avatarBg: 'bg-gradient-to-br from-red-600 to-rose-700', model: 'gemini-2.5-flash', customIcon: Flag, keywords: ['党建', '活动', '文书'] },
];

export const FEATURED_APPS: FeaturedApp[] = [
    { id: 'app-omninotes', name: '元绎 OmniNotes', description: '绑定公众号，随时随地将文章、语音、图片转发至元绎笔记。AI 自动整理摘要并归档，灵感不丢失。', icon: NotebookPen, color: 'bg-emerald-600' },
    { id: 'app-omnitrue', name: '元臻 OmniTrue', description: '企业财经人员的 AI 辅助平台。洞察风险，优化核算，赋能业务决策。您的专业财经助手已就绪。', icon: PieChart, color: 'bg-amber-500' },
    { id: 'app-omnimates', name: '元曜 OmniMates', description: '企业 HR 人员的 AI Co-pilot。提供招聘助手、员工体验向导及政策合规顾问，重塑人力资源管理流程。', icon: UserCog, color: 'bg-indigo-600' },
    { id: 'app-omnivision', name: '元见 OmniVision', description: '洞察本质，预见未来。覆盖企业洞察、问卷设计与虚拟仿真调研，助力企业精准把握市场脉搏。', icon: ScanEye, color: 'bg-purple-600' },
];

export const DEFAULT_WIDGETS: Widget[] = [
  { id: "w-weather", title: "今日天气", type: "weather", enabled: true, size: "medium", order: 1 },
  { id: "w-calendar", title: "日历", type: "calendar", enabled: true, size: "medium", order: 2 },
  { id: "w-quick", title: "快捷指令", type: "quick-actions", enabled: true, size: "medium", order: 3 },
  { id: "w-pinned", title: "常用助手", type: "pinned-agents", enabled: true, size: "wide", order: 4 },
  { id: "w-recent", title: "最近对话", type: "recent-chats", enabled: true, size: "medium", order: 5 },
];

export const PRESET_AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo"
];
