import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatCache, formatContext } from '../src/segments.ts';

const stripAnsi = (text: string): string => text.replace(/\x1b\[[0-9;]*m/g, '');
const NOW_MS = Date.parse('2026-11-02T10:00:00Z');

test('cache shows whole minutes and colors by elapsed third of the TTL', () => {
  const cacheAt = (secondsLeft: number, ttl: string): string =>
    formatCache({ prompt_cache: { ttl, expires_at: NOW_MS / 1000 + secondsLeft } }, NOW_MS);
  assert.equal(stripAnsi(cacheAt(3540, '1h')), '⧗ 59m');
  assert.match(cacheAt(3540, '1h'), /\x1b\[32m/);
  assert.match(cacheAt(1800, '1h'), /\x1b\[38;5;208m/);
  assert.match(cacheAt(30, '5m'), /\x1b\[31m/);
  assert.equal(stripAnsi(cacheAt(30, '5m')), '⧗ 1m');
  assert.equal(stripAnsi(cacheAt(-1, '5m')), '⧗ cold');
});

test('context shows pie glyph, or dash when null', () => {
  assert.equal(stripAnsi(formatContext({ context_window: { used_percentage: null } })), '○ —');
  assert.equal(stripAnsi(formatContext({ context_window: { used_percentage: 41.6 } })), '◑ 42%');
});
