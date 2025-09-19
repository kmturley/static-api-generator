export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LoggerConfig {
  enabled?: boolean;
  level?: LogLevel;
  colors?: boolean;
}

export class Logger {
  private config: LoggerConfig;
  private isBrowser: boolean;

  constructor(config: LoggerConfig = {}) {
    this.config = {
      enabled: true,
      level: LogLevel.INFO,
      colors: true,
      ...config,
    };
    this.isBrowser = typeof window !== 'undefined';
  }

  private shouldLog(level: LogLevel): boolean {
    return this.config.enabled! && level <= this.config.level!;
  }

  private colorize(text: string, color: string): string {
    if (!this.config.colors) return text;

    if (this.isBrowser) {
      return `%c${text}`;
    }

    const colors: Record<string, string> = {
      red: '\x1b[31m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      green: '\x1b[32m',
      gray: '\x1b[90m',
      reset: '\x1b[0m',
    };
    return `${colors[color] || ''}${text}${colors.reset}`;
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const colors = ['red', 'yellow', 'blue', 'gray'];

    const levelText = this.colorize(`[${LogLevel[level]}]`, colors[level]);
    const timeText = this.colorize(timestamp, 'gray');

    if (this.isBrowser && this.config.colors) {
      console.log(`${timeText} ${levelText} ${message}`, ...args);
    } else {
      console.log(`${timeText} ${levelText} ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]) {
    this.log(LogLevel.ERROR, message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log(LogLevel.WARN, message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log(LogLevel.INFO, message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.log(LogLevel.DEBUG, message, ...args);
  }
}

export const logger = new Logger();
