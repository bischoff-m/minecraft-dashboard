import { NextResponse } from 'next/server';
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

export async function GET() {
  if (!fs.existsSync(whitelistPath)) {
    return new NextResponse(JSON.stringify([]), { status: 200 });
  }
  const data = fs.readFileSync(whitelistPath, 'utf-8');
  try {
    const whitelist: WhitelistEntry[] = JSON.parse(data);
    return new NextResponse(JSON.stringify(whitelist), { status: 200 });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: 'Failed to parse whitelist.json' }), {
      status: 500,
    });
  }
}
export async function POST(req: Request) {
  // Validate request body
  const { uuid, name } = (await req.json()) as WhitelistEntry;
  if (!uuid || !name) {
    return new NextResponse(JSON.stringify({ error: 'uuid and name required' }), { status: 400 });
  }

  // Check for existing whitelist entry
  const whitelist = readWhitelist();
  if (whitelist.some((entry: WhitelistEntry) => entry.uuid === uuid)) {
    return new NextResponse(JSON.stringify({ error: 'Player already whitelisted' }), {
      status: 409,
    });
  }

  // Add new whitelist entry
  whitelist.push({ uuid, name });
  fs.writeFileSync(whitelistPath, JSON.stringify(whitelist, null, 4));

  // Reload the whitelist on the server
  try {
    await runCommand('whitelist reload');
    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error reloading whitelist:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Could not reload the whitelist on the server.' }),
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  // Validate request body
  const { uuid } = await req.json();
  if (!uuid || typeof uuid !== 'string') {
    return new NextResponse(JSON.stringify({ error: 'Invalid uuid' }), { status: 400 });
  }

  // Remove the entry from the whitelist
  let whitelist = readWhitelist();
  whitelist = whitelist.filter((e) => e.uuid !== uuid);
  fs.writeFileSync(whitelistPath, JSON.stringify(whitelist, null, 4));

  // Reload the whitelist on the server
  try {
    await runCommand('whitelist reload');
    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error reloading whitelist:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Could not reload the whitelist on the server.' }),
      { status: 500 }
    );
  }
}
