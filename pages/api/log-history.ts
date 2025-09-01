import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { mcServerPath, parseLogFile } from '../../lib/log-parse';

const logPath = path.join(mcServerPath, 'logs/latest.log');

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(parseLogFile(logPath));
}
