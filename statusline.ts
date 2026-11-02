#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { StatusLine } from './src/status-line.ts';
import type { SessionInput } from './src/session-input.ts';

const readSessionInput = (): SessionInput => {
  try {
    return JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    return {};
  }
};

process.stdout.write(new StatusLine(Date.now).render(readSessionInput()));
