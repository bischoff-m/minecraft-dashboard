import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { mcServerPath } from '@/lib/log-parse';
import { runCommand } from '@/lib/rcon-client';

const whitelistPath = path.join(mcServerPath, 'whitelist.json');

export type WhitelistEntry = {
  name: string;
  uuid: string;
};

function readWhitelist(): WhitelistEntry[] {
  if (!fs.existsSync(whitelistPath)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(whitelistPath, 'utf-8'));
  } catch {
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (!fs.existsSync(whitelistPath)) {
      return res.status(200).json([]);
    }
    const data = fs.readFileSync(whitelistPath, 'utf-8');
    try {
      const whitelist: WhitelistEntry[] = JSON.parse(data);
      return res.status(200).json(whitelist);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse whitelist.json' });
    }
  } else if (req.method === 'POST') {
    // Validate request body
    const { uuid, name } = req.body as WhitelistEntry;
    if (!uuid || !name) {
      return res.status(400).json({ error: 'uuid and name required' });
    }

    // Check for existing whitelist entry
    const whitelist = readWhitelist();
    if (whitelist.some((entry: WhitelistEntry) => entry.uuid === uuid)) {
      return res.status(409).json({ error: 'Player already whitelisted' });
    }

    // Add new whitelist entry
    whitelist.push({ uuid, name });
    fs.writeFileSync(whitelistPath, JSON.stringify(whitelist, null, 4));

    // Reload the whitelist on the server
    try {
      await runCommand('whitelist reload');
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error reloading whitelist:', error);
      return res.status(500).json({ error: 'Could not reload the whitelist on the server.' });
    }
  } else if (req.method === 'DELETE') {
    // Validate request body
    const { uuid } = req.body;
    if (!uuid || typeof uuid !== 'string') {
      return res.status(400).json({ error: 'Invalid uuid' });
    }

    // Remove the entry from the whitelist
    let whitelist = readWhitelist();
    whitelist = whitelist.filter((e) => e.uuid !== uuid);
    fs.writeFileSync(whitelistPath, JSON.stringify(whitelist, null, 4));

    // Reload the whitelist on the server
    try {
      await runCommand('whitelist reload');
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error reloading whitelist:', error);
      return res.status(500).json({ error: 'Could not reload the whitelist on the server.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).end('Method Not Allowed');
  }
}
