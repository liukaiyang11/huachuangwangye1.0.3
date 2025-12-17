
import { LucideIcon } from 'lucide-react';

export type View = "workbench" | "marketplace" | "knowledge" | "workspace" | "creation" | "settings";
export type KnowledgeTab = "personal" | "department" | "shared";
export type ResourceTab = "plugins" | "datasets" | "workflows";
export type WidgetSize = "small" | "medium" | "wide" | "large" | "wide-large";
export type ThemeMode = "light" | "dark" | "eye-care";

export interface Wallpaper {
    id: string;
    name: string;
    type: 'gradient' | 'image' | 'dynamic';
    value: string;
    theme: ThemeMode;
    thumbColor: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  avatarBg: string;
  systemInstruction?: string;
  model: string;
  keywords?: string[]; // New: For local matching algorithm
  isNew?: boolean;
  status?: 'published' | 'draft';
  icon?: any;
  starred?: boolean;
  customIcon?: any;
  customColor?: string;
  isCreator?: boolean;
}

export interface FeaturedApp {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
}

export interface Message {
  role: "user" | "model";
  text: string;
  isError?: boolean;
  agentId?: string; // ID of the agent who sent this message (for group chat)
  isCollapsed?: boolean; // Whether the message is collapsed by default (for intermediate steps)
  isThinking?: boolean; // UI state for loading
  generatedFile?: {
      name: string;
      type: 'pdf' | 'txt' | 'image';
      content: string;
      date: string;
  };
}

export interface ChatSession {
  id: string;
  agentId: string; // For single chat, this is the agent. For group, this is the "primary" agent (PM)
  type: 'single' | 'group'; // New field
  members: string[]; // List of agent IDs in the group
  title: string;
  messages: Message[];
  updatedAt: Date;
  status?: 'idle' | 'planning' | 'working' | 'reviewing'; // Workflow status
}

export interface WorkspaceTab {
    id: string;
    type: 'chat' | 'tool';
    title: string;
    sessionId?: string;
    agentId?: string;
    data?: any;
}

export interface Widget {
  id: string;
  title: string;
  type: "quick-actions" | "recent-chats" | "pinned-agents" | "weather" | "calendar" | "notepad";
  enabled: boolean;
  size: WidgetSize; 
  order: number;
}

export interface KnowledgeItem {
    id: string;
    name: string;
    type: 'folder' | 'pdf' | 'word' | 'ppt' | 'excel' | 'txt' | 'zip';
    owner: string;
    date: string;
    size?: string;
    parentId?: string | null;
    space?: 'personal' | 'department' | 'shared';
}

export interface ResourceItem {
    id: string;
    name: string;
    description: string;
    type: 'plugin' | 'dataset' | 'workflow';
    icon: any;
    author: string;
    installs: number;
    version: string;
    detail?: string;
}

export interface UserProfile {
    email: string;
    name: string;
    title: string;
    avatar: string;
    orgName?: string;
    themeMode?: ThemeMode;
    wallpaperId?: string;
}

export interface UserData {
    profile: UserProfile;
    sessions: ChatSession[];
    knowledge: KnowledgeItem[];
    widgets: Widget[];
    pinnedAgents: string[];
}
