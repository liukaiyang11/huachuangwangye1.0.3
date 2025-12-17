
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserData, UserProfile, ChatSession, KnowledgeItem, Widget, Wallpaper, ThemeMode, WorkspaceTab, Agent } from '../types';
import { AuthService, UserService } from '../api/request';
import { WALLPAPERS, DEFAULT_WIDGETS, FULL_AGENTS_LIST, PRESET_AVATARS } from '../constants/data';

interface AppContextType {
    currentUser: UserProfile | null;
    setCurrentUser: (u: UserProfile | null) => void;
    widgets: Widget[];
    setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>;
    sessions: ChatSession[];
    setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
    knowledgeDb: KnowledgeItem[];
    setKnowledgeDb: React.Dispatch<React.SetStateAction<KnowledgeItem[]>>;
    pinnedAgentIds: string[];
    setPinnedAgentIds: React.Dispatch<React.SetStateAction<string[]>>;
    themeMode: ThemeMode;
    setThemeMode: (m: ThemeMode) => void;
    currentWallpaper: Wallpaper;
    setCurrentWallpaper: (w: Wallpaper) => void;
    activeTabs: WorkspaceTab[];
    setActiveTabs: React.Dispatch<React.SetStateAction<WorkspaceTab[]>>;
    activeTabId: string | null;
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>;
    isStandbyMode: boolean;
    setIsStandbyMode: React.Dispatch<React.SetStateAction<boolean>>;
    login: (email: string) => Promise<void>;
    register: (email: string, name: string, orgName: string) => Promise<void>;
    logout: () => void;
    startNewChat: (agents: Agent | Agent[], existingSessionId?: string) => void;
    // Tour States
    isTourActive: boolean;
    setTourActive: (active: boolean) => void;
    completeTour: () => void;
    resetTour: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [knowledgeDb, setKnowledgeDb] = useState<KnowledgeItem[]>([]);
    const [pinnedAgentIds, setPinnedAgentIds] = useState<string[]>([]);
    const [themeMode, setThemeMode] = useState<ThemeMode>("light");
    const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>(WALLPAPERS[0]);
    const [activeTabs, setActiveTabs] = useState<WorkspaceTab[]>([]);
    const [activeTabId, setActiveTabId] = useState<string | null>(null);
    const [isStandbyMode, setIsStandbyMode] = useState(false);
    
    // Tour State
    const [isTourActive, setTourActive] = useState(false);

    // Initial Load
    useEffect(() => {
        const email = AuthService.getCurrentUserEmail();
        if (email) {
            AuthService.login(email)
                .then((response: any) => {
                    const userData = response.data || response; 
                    loadUserData(userData);
                })
                .catch(() => setCurrentUser(null));
        }
    }, []);

    // Check tour status after user is loaded
    useEffect(() => {
        if (currentUser) {
            const hasSeenTour = localStorage.getItem('omnicube_tour_completed');
            if (!hasSeenTour) {
                // Delay slightly to ensure UI is rendered
                setTimeout(() => setTourActive(true), 1000);
            }
        }
    }, [currentUser]);

    const loadUserData = (data: UserData) => {
        if (!data || !data.profile) return;
        setCurrentUser(data.profile);
        
        // Date parsing safety check
        const parsedSessions = Array.isArray(data.sessions) 
            ? data.sessions.map(s => ({...s, updatedAt: new Date(s.updatedAt)}))
            : [];
            
        setSessions(parsedSessions);
        setKnowledgeDb(data.knowledge || []);
        setWidgets(data.widgets || DEFAULT_WIDGETS);
        setPinnedAgentIds(data.pinnedAgents || []);
        
        if (data.profile.wallpaperId) {
            const wp = WALLPAPERS.find(w => w.id === data.profile.wallpaperId);
            if (wp) {
                setCurrentWallpaper(wp);
                setThemeMode(wp.theme);
            }
        } else {
            setThemeMode(data.profile.themeMode || 'light');
        }
    };

    // Auto Sync
    useEffect(() => {
        if (!currentUser) return;
        const saveData = setTimeout(() => {
            UserService.sync(currentUser.email, {
                profile: { ...currentUser, themeMode, wallpaperId: currentWallpaper.id },
                sessions,
                knowledge: knowledgeDb,
                widgets,
                pinnedAgents: pinnedAgentIds
            });
        }, 1000); 
        return () => clearTimeout(saveData);
    }, [currentUser, sessions, knowledgeDb, widgets, pinnedAgentIds, themeMode, currentWallpaper]);

    // Theme Effect
    useEffect(() => {
        document.documentElement.classList.remove('dark', 'eye-care');
        if (themeMode === 'dark') document.documentElement.classList.add('dark');
        else if (themeMode === 'eye-care') document.documentElement.classList.add('eye-care');
        
        const mesh = document.getElementById('wallpaper-mesh');
        if (mesh) {
            if (currentWallpaper.type === 'image' && !currentWallpaper.value.includes('gradient')) {
               mesh.style.background = `url(${currentWallpaper.value}) center/cover no-repeat fixed`;
            } else {
               mesh.style.background = currentWallpaper.value;
            }
        }
    }, [themeMode, currentWallpaper]);

    const login = async (email: string) => {
        const response: any = await AuthService.login(email);
        loadUserData(response.data || response);
    };

    const register = async (email: string, name: string, orgName: string) => {
        const initialData: UserData = {
            profile: {
                email, name, title: '新员工', orgName: orgName || 'Default Org', themeMode: 'light', wallpaperId: 'aurora',
                avatar: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]
            },
            sessions: [],
            knowledge: [],
            widgets: DEFAULT_WIDGETS,
            pinnedAgents: [
                'agent-general', 'mock-interviewer', 'resume-screener', 'leader-speech', 
                'meeting-minutes', 'public-account', 'competitor-analysis', 'text-translate'
            ]
        };
        const response: any = await AuthService.register({ email, name, orgName, initialData });
        loadUserData(response.data || response);
    };

    const logout = () => {
        AuthService.logout();
        setCurrentUser(null);
        setSessions([]);
        setActiveTabs([]);
    };

    const startNewChat = (agentOrAgents: Agent | Agent[], existingSessionId?: string) => {
        if (existingSessionId) {
             const existingTab = activeTabs.find(t => t.sessionId === existingSessionId);
             if (existingTab) { 
                 setActiveTabId(existingTab.id); 
                 return; 
             }
             const session = sessions.find(s => s.id === existingSessionId);
             if(session) {
                 const newTab: WorkspaceTab = { id: Date.now().toString(), type: 'chat', title: session.title, sessionId: session.id, agentId: session.agentId };
                 setActiveTabs(prev => [...prev, newTab]); 
                 setActiveTabId(newTab.id); 
                 return;
             }
        }

        const isGroup = Array.isArray(agentOrAgents);
        const primaryAgent = isGroup ? agentOrAgents[0] : agentOrAgents;
        const members = isGroup ? agentOrAgents.map(a => a.id) : [agentOrAgents.id];
        const title = isGroup ? '数字员工团队' : (primaryAgent.id === 'agent-general' ? '新对话' : `与 ${primaryAgent.name} 的对话`);

        const newSession: ChatSession = { 
            id: Date.now().toString(), 
            agentId: primaryAgent.id, 
            type: isGroup ? 'group' : 'single',
            members: members,
            title: title, 
            messages: [], 
            updatedAt: new Date(),
            status: 'idle'
        };

        setSessions(prev => [newSession, ...prev]);
        const newTab: WorkspaceTab = { id: 'tab-' + Date.now(), type: 'chat', title: newSession.title, sessionId: newSession.id, agentId: primaryAgent.id };
        setActiveTabs(prev => [...prev, newTab]); 
        setActiveTabId(newTab.id);
    };

    const completeTour = () => {
        localStorage.setItem('omnicube_tour_completed', 'true');
        setTourActive(false);
    };

    const resetTour = () => {
        setTourActive(true);
    };

    return (
        <AppContext.Provider value={{
            currentUser, setCurrentUser, widgets, setWidgets, sessions, setSessions,
            knowledgeDb, setKnowledgeDb, pinnedAgentIds, setPinnedAgentIds,
            themeMode, setThemeMode, currentWallpaper, setCurrentWallpaper,
            activeTabs, setActiveTabs, activeTabId, setActiveTabId,
            isStandbyMode, setIsStandbyMode,
            login, register, logout, startNewChat,
            isTourActive, setTourActive, completeTour, resetTour
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) throw new Error('useApp must be used within an AppProvider');
    return context;
};
