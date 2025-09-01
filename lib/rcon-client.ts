import { Rcon } from 'rcon-client';

const serverHost = process.env.RCON_HOST || 'localhost';
const serverPort = parseInt(process.env.RCON_PORT || '25575', 10);
const serverPassword = process.env.RCON_PASSWORD || '1234';

export async function runCommand(command: string): Promise<string> {
  const rcon = await Rcon.connect({
    host: serverHost,
    port: serverPort,
    password: serverPassword,
  });
  try {
    const response = await rcon.send(command);
    return response;
  } finally {
    rcon.end();
  }
}
