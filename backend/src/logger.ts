import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
    DEBUG = 'DEBUG'
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    data?: any;
}

class Logger {
    private logDir: string;
    private logFile: string;
    private enableConsole: boolean = true;
    private enableFile: boolean = true;

    constructor() {
        this.logDir = path.join(__dirname, '..', 'logs');
        this.logFile = path.join(this.logDir, `scout-${this.getDateString()}.log`);
        this.initializeLogDirectory();
    }

    private initializeLogDirectory(): void {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    private getDateString(): string {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private formatLogEntry(entry: LogEntry): string {
        let dataStr = '';
        if (entry.data) {
            if (typeof entry.data === 'string') {
                dataStr = entry.data;
            } else {
                // Handle BigInt serialization
                dataStr = JSON.stringify(entry.data, (key, value) =>
                    typeof value === 'bigint' ? value.toString() : value
                );
            }
        }
        return `[${entry.timestamp}] [${entry.level}] ${entry.message}${dataStr ? ' | ' + dataStr : ''}\n`;
    }

    private writeToFile(entry: LogEntry): void {
        if (!this.enableFile) return;

        try {
            const logLine = this.formatLogEntry(entry);
            fs.appendFileSync(this.logFile, logLine);
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }

    private writeToConsole(level: LogLevel, message: string, data?: any): void {
        if (!this.enableConsole) return;

        const timestamp = chalk.gray(`[${new Date().toLocaleTimeString()}]`);
        
        switch (level) {
            case LogLevel.INFO:
                console.log(`${timestamp} ${chalk.blue('ℹ')} ${message}`, data || '');
                break;
            case LogLevel.WARN:
                console.log(`${timestamp} ${chalk.yellow('⚠')} ${message}`, data || '');
                break;
            case LogLevel.ERROR:
                console.log(`${timestamp} ${chalk.red('✖')} ${message}`, data || '');
                break;
            case LogLevel.SUCCESS:
                console.log(`${timestamp} ${chalk.green('✓')} ${message}`, data || '');
                break;
            case LogLevel.DEBUG:
                console.log(`${timestamp} ${chalk.magenta('◆')} ${message}`, data || '');
                break;
        }
    }

    private log(level: LogLevel, message: string, data?: any): void {
        const entry: LogEntry = {
            timestamp: this.getTimestamp(),
            level,
            message,
            data
        };

        this.writeToConsole(level, message, data);
        this.writeToFile(entry);
    }

    info(message: string, data?: any): void {
        this.log(LogLevel.INFO, message, data);
    }

    warn(message: string, data?: any): void {
        this.log(LogLevel.WARN, message, data);
    }

    error(message: string, data?: any): void {
        this.log(LogLevel.ERROR, message, data);
    }

    success(message: string, data?: any): void {
        this.log(LogLevel.SUCCESS, message, data);
    }

    debug(message: string, data?: any): void {
        this.log(LogLevel.DEBUG, message, data);
    }

    // Special formatters for specific events
    tokenDiscovered(symbol: string, address: string): void {
        this.success(`New token discovered: ${symbol}`, { address });
    }

    tradeExecuted(action: string, symbol: string, amount?: number): void {
        this.success(`Trade executed: ${action} ${symbol}`, { amount });
    }

    sentimentAnalyzed(symbol: string, score: number, reasoning?: string): void {
        this.info(`Sentiment analyzed: ${symbol}`, { score, reasoning });
    }

    setConsoleLogging(enabled: boolean): void {
        this.enableConsole = enabled;
    }

    setFileLogging(enabled: boolean): void {
        this.enableFile = enabled;
    }
}

export default new Logger();
