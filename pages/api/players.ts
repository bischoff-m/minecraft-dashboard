import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';

const logPath = process.env.MC_LOG_PATH ? path.resolve(process.env.MC_LOG_PATH) : '';
let lastPlayers: string[] = [];
let lastUUIDs: string[] = [];
let lastReadTime = 0;

function parseLogFile(): { players: string[]; uuidMessages: string[] } {
  if (!fs.existsSync(logPath)) return { players: [], uuidMessages: [] };
  const log = fs.readFileSync(logPath, 'utf-8');
  const lines = log.split(/\r?\n/);
  const uuidMessages: string[] = [];
  const online = new Set<string>();

  for (const line of lines) {
    // UUID log
    const uuidMatch = line.match(/\[User Authenticator #\d+\/INFO]: UUID of player (.*?) is (.*)/);
    if (uuidMatch) {
      uuidMessages.push(line);
    }
    // Player joined
    const joinMatch = line.match(/\[Server thread\/INFO]: (.*?) joined the game/);
    if (joinMatch) {
      online.add(joinMatch[1]);
    }
    // Player left
    const leftMatch = line.match(/\[Server thread\/INFO]: (.*?) left the game/);
    if (leftMatch) {
      online.delete(leftMatch[1]);
    }
  }
  return { players: Array.from(online), uuidMessages };
}

// Add type for global watcher
declare global {
  // eslint-disable-next-line no-var
  var _chokidarPlayersWatcher: ReturnType<typeof chokidar.watch> | undefined;
}
// Watch for changes and update cache
if (!global._chokidarPlayersWatcher) {
  const watcher = chokidar.watch(logPath, { ignoreInitial: true });
  watcher.on('change', () => {
    const { players, uuidMessages } = parseLogFile();
    lastPlayers = players;
    lastUUIDs = uuidMessages;
    lastReadTime = Date.now();
  });
  global._chokidarPlayersWatcher = watcher;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only re-parse if file changed since last parse
  const stat = fs.existsSync(logPath) ? fs.statSync(logPath) : null;
  if (stat && stat.mtimeMs > lastReadTime) {
    const { players, uuidMessages } = parseLogFile();
    lastPlayers = players;
    lastUUIDs = uuidMessages;
    lastReadTime = stat.mtimeMs;
  }
  res.status(200).json({ players: lastPlayers, uuidMessages: lastUUIDs });
}
