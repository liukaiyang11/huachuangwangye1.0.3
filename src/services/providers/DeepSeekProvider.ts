
import { ILLMProvider, LLMRequest, LLMResponse } from "../llm";

export class DeepSeekProvider implements ILLMProvider {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string, baseUrl: string = 'https://api.deepseek.com') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    async chat(request: LLMRequest): Promise<LLMResponse> {
        if (!this.apiKey) {
            throw new Error("DeepSeek API Key not configured");
        }

        // 1. 构建消息列表
        const messages: any[] = [];
        
        // System Instruction
        if (request.systemInstruction) {
            messages.push({ role: 'system', content: request.systemInstruction });
        }

        // Message Mapping: convert internal role 'model' to standard 'assistant'
        const mappedMessages = request.messages.map(msg => ({
            role: msg.role === 'model' ? 'assistant' : msg.role,
            content: msg.content
        }));
        
        messages.push(...mappedMessages);

        // 2. 模型名称映射
        // 如果传入的模型名包含 'gemini'，则回退到 'deepseek-chat'
        const model = (request.model && !request.model.includes('gemini')) ? request.model : 'deepseek-chat';

        // 3. 构建请求体
        const payload: any = {
            model: model,
            messages: messages,
            temperature: request.temperature ?? 1.0,
            stream: false
        };

        // DeepSeek 支持 json_object 模式
        if (request.jsonMode) {
            payload.response_format = { type: 'json_object' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`DeepSeek API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            
            return {
                text: data.choices[0]?.message?.content || "",
                usage: {
                    promptTokens: data.usage?.prompt_tokens || 0,
                    completionTokens: data.usage?.completion_tokens || 0
                }
            };
        } catch (error) {
            console.error("DeepSeek Request Failed", error);
            throw error;
        }
    }
}
