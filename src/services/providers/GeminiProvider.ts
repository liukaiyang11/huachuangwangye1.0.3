
import { GoogleGenAI } from "@google/genai";
import { ILLMProvider, LLMRequest, LLMResponse } from "../llm";

export class GeminiProvider implements ILLMProvider {
    private client: GoogleGenAI | null = null;

    constructor(apiKey: string) {
        if (apiKey) {
            this.client = new GoogleGenAI({ apiKey });
        }
    }

    async chat(request: LLMRequest): Promise<LLMResponse> {
        if (!this.client) {
            throw new Error("API Key not configured for GeminiProvider");
        }

        // 1. 转换消息格式 (Standard -> Gemini)
        const contents = request.messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }));

        // 2. 构建配置
        const config: any = {};
        if (request.systemInstruction) {
            config.systemInstruction = request.systemInstruction;
        }
        if (request.jsonMode) {
            config.responseMimeType = 'application/json';
        }
        if (request.temperature !== undefined) {
            config.temperature = request.temperature;
        }

        // 3. 调用 API
        const response = await this.client.models.generateContent({
            model: request.model || 'gemini-2.5-flash',
            contents: contents,
            config: config
        });

        // 4. 转换响应格式 (Gemini -> Standard)
        return {
            text: response.text || ""
        };
    }
}
