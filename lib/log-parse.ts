import fs from 'fs';
import path from 'path';

export const mcServerPath = process.env.MC_SERVER_PATH
  ? path.resolve(process.env.MC_SERVER_PATH)
  : '';

export const logPath = path.join(mcServerPath, 'logs/latest.log');

export type LogMessage = {
  time: string;
  source: string;
  message: string;
};

export function parseLogFile(logPath: string): LogMessage[] {
  const log = fs.readFileSync(logPath, 'utf-8');
  const lines = log.split(/\r?\n/);
  const logMessages: LogMessage[] = [];
  for (const line of lines) {
    const match = line.match(/^\[([^\]]+)\] \[([^\]]+)\]: (.*)$/);
    if (match) {
      const [, time, source, message] = match;
      logMessages.push({ time, source, message });
    }
  }
  return logMessages;
}
