import path from 'path';
import { mcServerPath, parseLogFile } from '../../../lib/log-parse';

const logPath = path.join(mcServerPath, 'logs/latest.log');

export async function GET() {
  try {
    return Response.json(parseLogFile(logPath));
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Failed to parse log file. Error: ${(error as Error).message}` }),
      { status: 500 }
    );
  }
}
