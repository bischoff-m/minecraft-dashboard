import path from 'path';
import { mcServerPath, parseLogFile } from '../../../lib/log-parse';

const logPath = path.join(mcServerPath, 'logs/latest.log');

export async function GET() {
  return Response.json(parseLogFile(logPath));
}
