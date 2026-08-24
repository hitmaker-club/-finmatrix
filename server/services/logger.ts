/**
 * Centralized Logging Service with Category Segregation and Secret Sanitization
 */

import { LogCategory, LogEntry } from '../../src/types/domain.js';

class CentralLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 2000;

  private sanitize(obj: any): any {
    if (!obj) return obj;
    if (typeof obj === 'string') {
      return obj
        .replace(/AIza[0-9A-Za-z-_]{35}/g, '[GEMINI_KEY_REDACTED]')
        .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [TOKEN_REDACTED]')
        .replace(/"password":\s*"[^"]+"/gi, '"password": "[REDACTED]"');
    }
    if (typeof obj === 'object' && obj !== null) {
      const copy: any = Array.isArray(obj) ? [] : {};
      for (const [key, value] of Object.entries(obj)) {
        if (/key|secret|password|token|auth/i.test(key)) {
          copy[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
          copy[key] = this.sanitize(value);
        } else if (typeof value === 'string') {
          copy[key] = this.sanitize(value);
        } else {
          copy[key] = value;
        }
      }
      return copy;
    }
    return obj;
  }

  public log(
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG',
    category: LogCategory,
    message: string,
    details?: Record<string, unknown>,
    accountId?: string,
    ipAddress?: string
  ): LogEntry {
    const entry: LogEntry = {
      id: 'log_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details: details ? this.sanitize(details) : undefined,
      accountId,
      ipAddress,
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    const consolePrefix = `[${entry.timestamp}] [${entry.level}] [${entry.category}]`;
    if (level === 'ERROR') {
      console.error(`${consolePrefix} ${message}`, details || '');
    } else if (level === 'WARN') {
      console.warn(`${consolePrefix} ${message}`);
    } else {
      console.log(`${consolePrefix} ${message}`);
    }

    return entry;
  }

  public info(category: LogCategory, message: string, details?: Record<string, unknown>, accountId?: string) {
    return this.log('INFO', category, message, details, accountId);
  }

  public warn(category: LogCategory, message: string, details?: Record<string, unknown>, accountId?: string) {
    return this.log('WARN', category, message, details, accountId);
  }

  public error(category: LogCategory, message: string, details?: Record<string, unknown>, accountId?: string) {
    return this.log('ERROR', category, message, details, accountId);
  }

  public debug(category: LogCategory, message: string, details?: Record<string, unknown>, accountId?: string) {
    return this.log('DEBUG', category, message, details, accountId);
  }

  public getLogs(filter?: { category?: LogCategory; level?: string; search?: string; limit?: number }): LogEntry[] {
    let result = [...this.logs];
    if (filter?.category) {
      result = result.filter(l => l.category === filter.category);
    }
    if (filter?.level) {
      result = result.filter(l => l.level === filter.level);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(l => l.message.toLowerCase().includes(q) || JSON.stringify(l.details || '').toLowerCase().includes(q));
    }
    const limit = filter?.limit || 100;
    return result.slice(0, limit);
  }
}

export const logger = new CentralLogger();
