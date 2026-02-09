import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import config from './config';
import logger from './logger';
import { MoltbookVerifyResponse } from './types';

// Extend Express Request type to include the agent
declare global {
    namespace Express {
        interface Request {
            agent?: any;
        }
    }
}

/**
 * Middleware to verify Moltbook agent identity
 */
export const moltbookAuth = async (req: Request, res: Response, next: NextFunction) => {
    const identityToken = req.header('X-Moltbook-Identity');
    const appKey = config.getConfig().moltbook.appKey;

    if (!identityToken) {
        return res.status(401).json({
            success: false,
            error: 'Missing X-Moltbook-Identity header'
        });
    }

    if (!appKey) {
        logger.error('MOLTBOOK_APP_KEY not configured');
        return res.status(500).json({
            success: false,
            error: 'Server configuration error'
        });
    }

    try {
        const response = await axios.post<MoltbookVerifyResponse>(
            'https://moltbook.com/api/v1/agents/verify-identity',
            { token: identityToken },
            {
                headers: {
                    'X-Moltbook-App-Key': appKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.valid && response.data.agent) {
            req.agent = response.data.agent;
            return next();
        } else {
            const errorMsg = response.data.error || 'Invalid identity token';
            return res.status(401).json({
                success: false,
                error: errorMsg
            });
        }
    } catch (error: any) {
        // Handle specific error messages from Moltbook
        if ((axios as any).isAxiosError(error) && error.response) {
            const errorData = error.response.data as any;
            return res.status(401).json({
                success: false,
                error: errorData.error || 'Identity verification failed'
            });
        }
        
        logger.error('Moltbook verification failed', error);
        return res.status(500).json({
            success: false,
            error: 'Internal verification error'
        });
    }
};
