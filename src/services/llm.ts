
import { GeminiProvider } from './providers/GeminiProvider';
import { DeepSeekProvider } from './providers/DeepSeekProvider';

// --- 1. 标准化接口定义 (Standard Protocol) ---

export interface LLMMessage {
    role: 'user' | 'model' | 'system'; 
    content: string;
}

export interface LLMRequest {
    messages: LLMMessage[];
    model?: string;
    systemInstruction?: string;
    jsonMode?: boolean; 
    temperature?: number;
}

export interface LLMResponse {
    text: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
    };
}

export interface ILLMProvider {
    /**
     * 核心对话方法
     */
    chat(request: LLMRequest): Promise<LLMResponse>;
}

// --- 2. 服务外观 (Service Facade) ---

class LLMService {
    private provider: ILLMProvider;

    constructor() {
        let providerType = 'deepseek'; // Default to DeepSeek as requested
        let apiKey = 'sk-488e50f657f244cbb708db8c765ebbc4'; // Default Key provided by user

        try {
            // Safely check for import.meta.env (Vite)
            // @ts-ignore
        
    
            

        } catch (e) {
            console.warn("Env var access error, using defaults.");
        }

        if (providerType === 'deepseek') {
             this.provider = new DeepSeekProvider(apiKey);
             console.log('[LLMService] Using DeepSeek Provider');
        } else {
             this.provider = new GeminiProvider(apiKey);
             console.log('[LLMService] Using Gemini Provider');
        }
    }

    /**
     * 发送对话请求 (包含自动重试机制)
     */
    async chat(request: LLMRequest, retries = 2): Promise<LLMResponse> {
        try {
            return await this.provider.chat(request);
        } catch (error: any) {
            // 通用错误处理与重试逻辑
            const isRateLimit = error.status === 429 || error.message?.includes('429') || error.message?.includes('quota');
            
            if (isRateLimit && retries > 0) {
                console.warn(`[LLMService] Rate limit hit, retrying... (${retries} left)`);
                await new Promise(r => setTimeout(r, 5000));
                return this.chat(request, retries - 1);
            }
            
            console.error("[LLMService] Error:", error);
            throw error;
        }
    }
}

// 导出单例
export const llmService = new LLMService();
