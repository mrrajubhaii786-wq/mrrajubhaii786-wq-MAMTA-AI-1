import { GoogleGenAI } from '@google/genai';

interface AIResponse {
  text: string;
  latencyMs: number;
}

interface AIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

const DEFAULT_OPTIONS: AIOptions = {
  model: 'gemini-3.5-flash',
  temperature: 0.7,
  maxTokens: 4096,
  timeoutMs: 30000,
};

class AIService {
  private client: GoogleGenAI | null = null;
  private requestCount = 0;
  private errorCount = 0;

  private getClient(): GoogleGenAI {
    if (!this.client) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
      this.client = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });
    }
    return this.client;
  }

  async generate(prompt: string, options: AIOptions = {}): Promise<AIResponse> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const startTime = Date.now();
    try {
      this.requestCount++;
      const response = await Promise.race([
        this.getClient().models.generateContent({
          model: opts.model!,
          contents: prompt,
          config: { temperature: opts.temperature, maxOutputTokens: opts.maxTokens },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI request timeout')), opts.timeoutMs)
        ),
      ]);
      return { text: response.text || '', latencyMs: Date.now() - startTime };
    } catch (error) {
      this.errorCount++;
      console.error('AI generation failed:', error);
      throw error;
    }
  }

  getStats() {
    return {
      totalRequests: this.requestCount,
      errorCount: this.errorCount,
      successRate: this.requestCount > 0
        ? ((this.requestCount - this.errorCount) / this.requestCount) * 100
        : 100,
    };
  }
}

export const aiService = new AIService();
