import chalk from 'chalk';
import OpenAI from 'openai';
import { Token } from './types';
import logger from './logger';
import twitterClient from './twitter_client';

interface SentimentAnalysis {
    score: number; // 0-10
    confidence: number; // 0-1
    reasoning: string;
    indicators: {
        hype: number;
        momentum: number;
        credibility: number;
        risk: number;
    };
}

class SentimentAnalyzer {
    private apiUrl: string;
    private apiKey: string | undefined;
    private openai: OpenAI | null = null;

    constructor() {
        this.apiUrl = process.env.MOLTBOOK_API_URL || 'https://api.moltbook.xyz';
        this.apiKey = process.env.MOLTBOOK_API_KEY;
        
        // Initialize OpenAI if API key is available
        if (process.env.OPENAI_API_KEY) {
            this.openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
        }
    }

    /**
     * Analyzes sentiment for a specific token using AI
     * @param token Token object to analyze
     * @returns Score from 0 to 10
     */
    async analyze(token: Token): Promise<number> {
        console.log(chalk.magenta(`📊 Analyzing sentiment for ${token.symbol}...`));
        
        try {
            // If OpenAI is configured, use AI-powered analysis
            if (this.openai) {
                const analysis = await this.analyzeWithAI(token);
                logger.sentimentAnalyzed(token.symbol, analysis.score, analysis.reasoning);
                return analysis.score;
            }
            
            // Fallback: Use heuristic-based analysis
            const analysis = await this.analyzeWithHeuristics(token);
            logger.sentimentAnalyzed(token.symbol, analysis.score, analysis.reasoning);
            return analysis.score;
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(chalk.red(`Error analyzing sentiment for ${token.symbol}:`), errorMessage);
            return 5.0; // Return neutral score on error
        }
    }

    /**
     * AI-powered sentiment analysis using OpenAI
     */
    private async analyzeWithAI(token: Token): Promise<SentimentAnalysis> {
        if (!this.openai) {
            throw new Error('OpenAI not initialized');
        }

        // Prepare token context for AI analysis
        const context = await this.prepareTokenContext(token);
        
        const prompt = `You are a crypto market analyst. Analyze the following token and provide a sentiment score from 0-10.

Token: ${token.symbol} (${token.name})
Address: ${token.address}
${context}

Provide your analysis in JSON format:
{
  "score": <number 0-10>,
  "confidence": <number 0-1>,
  "reasoning": "<brief explanation>",
  "indicators": {
    "hype": <number 0-10>,
    "momentum": <number 0-10>,
    "credibility": <number 0-10>,
    "risk": <number 0-10>
  }
}

Scoring guide:
- 0-2: Extremely bearish (likely rug, scam indicators)
- 3-4: Bearish (weak fundamentals, low engagement)
- 5-6: Neutral (uncertain, waiting for signals)
- 7-8: Bullish (strong potential, growing community)
- 9-10: Extremely bullish (moonshot potential, viral momentum)`;

        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 500,
        });

        const content = response.choices[0]?.message?.content || '{}';
        
        // Extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || content.match(/(\{[\s\S]*\})/);
        const jsonContent = jsonMatch ? jsonMatch[1] : content;
        
        const analysis: SentimentAnalysis = JSON.parse(jsonContent);
        
        console.log(chalk.gray(`AI Analysis: ${analysis.reasoning}`));
        console.log(chalk.gray(`Indicators: Hype ${analysis.indicators.hype}/10, Momentum ${analysis.indicators.momentum}/10, Risk ${analysis.indicators.risk}/10`));
        
        return analysis;
    }

    /**
     * Heuristic-based sentiment analysis (fallback)
     */
    private async analyzeWithHeuristics(token: Token): Promise<SentimentAnalysis> {
        // Simulate fetching social mentions
        const mockMentions = Math.floor(Math.random() * 100);
        
        // Calculate score based on simple heuristics
        let score = 5.0; // Start neutral
        let hype = 5.0;
        let momentum = 5.0;
        let credibility = 5.0;
        let risk = 5.0;
        
        // Heuristic 1: Token name/symbol patterns
        if (token.symbol.toLowerCase().includes('moon') || 
            token.symbol.toLowerCase().includes('safe') ||
            token.name.toLowerCase().includes('inu')) {
            risk += 2; // Higher risk for meme patterns
            hype += 3; // But higher hype
        }
        
        // Heuristic 2: Mock social engagement
        if (mockMentions > 50) {
            momentum += 3;
            hype += 2;
        } else if (mockMentions < 10) {
            momentum -= 2;
        }
        
        // Heuristic 3: Liquidity (if available)
        if (token.liquidity && token.liquidity > 10000) {
            credibility += 2;
            risk -= 1;
        }
        
        // Heuristic 4: Market cap (if available)
        if (token.marketCap && token.marketCap < 50000) {
            risk += 1; // Higher risk for micro caps
            hype += 2; // But more upside potential
        }
        
        // Calculate final score (weighted average)
        score = (hype * 0.3 + momentum * 0.3 + credibility * 0.2 + (10 - risk) * 0.2);
        score = Math.max(0, Math.min(10, score)); // Clamp to 0-10
        
        const reasoning = `${mockMentions} mentions detected. Hype level ${hype.toFixed(1)}, momentum ${momentum.toFixed(1)}, risk ${risk.toFixed(1)}`;
        
        console.log(chalk.gray(`Heuristic Analysis: ${reasoning}`));
        
        return {
            score: parseFloat(score.toFixed(1)),
            confidence: 0.6,
            reasoning,
            indicators: {
                hype: parseFloat(hype.toFixed(1)),
                momentum: parseFloat(momentum.toFixed(1)),
                credibility: parseFloat(credibility.toFixed(1)),
                risk: parseFloat(risk.toFixed(1))
            }
        };
    }

    /**
     * Prepare token context for AI analysis
     */
    private async prepareTokenContext(token: Token): Promise<string> {
        let context = '';
        
        if (token.liquidity) {
            context += `Liquidity: $${token.liquidity.toLocaleString()}\n`;
        }
        if (token.marketCap) {
            context += `Market Cap: $${token.marketCap.toLocaleString()}\n`;
        }
        if (token.holderCount) {
            context += `Holders: ${token.holderCount}\n`;
        }
        if (token.createdAt) {
            const age = Date.now() - token.createdAt.getTime();
            const hours = Math.floor(age / (1000 * 60 * 60));
            context += `Age: ${hours} hours\n`;
        }
        
        // Add Twitter metrics if available
        if (twitterClient.isAvailable()) {
            try {
                const metrics = await twitterClient.getTweetMetrics(`$${token.symbol} OR ${token.name}`);
                if (metrics.count > 0) {
                    context += `\nTwitter Activity:\n`;
                    context += `- Mentions: ${metrics.count}\n`;
                    context += `- Total Likes: ${metrics.totalLikes}\n`;
                    context += `- Total Retweets: ${metrics.totalRetweets}\n`;
                    context += `- Avg Engagement: ${metrics.avgEngagement.toFixed(1)}\n`;
                }
            } catch (error) {
                logger.debug('Failed to fetch Twitter metrics', error);
            }
        }
        
        return context || 'Limited data available.';
    }
}

export default new SentimentAnalyzer();
