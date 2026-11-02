import { paint, type Style } from './colors.ts';
import type { SessionInput } from './session-input.ts';

const MISSING_VALUE = '—';
const CONTEXT_WARN_PERCENT = 50;
const CONTEXT_DANGER_PERCENT = 80;
const CONTEXT_PIE_GLYPHS = ['○', '◔', '◑', '◕', '●'];
const CACHE_SYMBOL = '⧗';
const CACHE_ORANGE_ELAPSED_FRACTION = 1 / 3;
const CACHE_RED_ELAPSED_FRACTION = 2 / 3;
const TTL_UNIT_SECONDS: Record<string, number> = { m: 60, h: 3600 };
const DEFAULT_TTL_SECONDS = 300;
const EFFORT_COLORS: Record<string, Style> = { low: 'gray', medium: 'blue', high: 'magenta', xhigh: 'magenta', max: 'red' };

export const formatModel = (sessionInput: SessionInput): string =>
  paint(sessionInput.model?.display_name ?? 'Claude', 'bold');

export const formatEffort = (sessionInput: SessionInput): string => {
  const effortLevel = sessionInput.effort?.level;
  return effortLevel ? paint(effortLevel, EFFORT_COLORS[effortLevel] ?? 'gray') : paint(MISSING_VALUE, 'dim');
};

export const formatContext = (sessionInput: SessionInput): string => {
  const usedPercent = sessionInput.context_window?.used_percentage;
  if (usedPercent == null) return paint(`${CONTEXT_PIE_GLYPHS[0]} ${MISSING_VALUE}`, 'dim');
  const rounded = Math.round(usedPercent);
  const color: Style =
    rounded >= CONTEXT_DANGER_PERCENT ? 'red' : rounded >= CONTEXT_WARN_PERCENT ? 'yellow' : 'green';
  return paint(`${contextPieGlyph(rounded)} ${rounded}%`, color);
};

// Picks the pie glyph nearest the usage, in quarter steps.
const contextPieGlyph = (percent: number): string =>
  CONTEXT_PIE_GLYPHS[Math.round(Math.min(Math.max(percent, 0), 100) / 25)];

// expires_at is in epoch seconds.
export const formatCache = (sessionInput: SessionInput, nowMs: number): string => {
  const { expires_at: expiresAtSeconds, ttl } = sessionInput.prompt_cache ?? {};
  if (expiresAtSeconds == null) return paint(`${CACHE_SYMBOL} ${MISSING_VALUE}`, 'dim');
  const secondsLeft = Math.floor(expiresAtSeconds - nowMs / 1000);
  if (secondsLeft <= 0) return paint(`${CACHE_SYMBOL} cold`, 'red');
  return paint(`${CACHE_SYMBOL} ${Math.ceil(secondsLeft / 60)}m`, cacheColor(secondsLeft, parseTtlSeconds(ttl)));
};

// Green for the first third of the TTL, orange for the second, red for the last.
const cacheColor = (secondsLeft: number, ttlSeconds: number): Style => {
  const elapsedFraction = 1 - secondsLeft / ttlSeconds;
  if (elapsedFraction >= CACHE_RED_ELAPSED_FRACTION) return 'red';
  if (elapsedFraction >= CACHE_ORANGE_ELAPSED_FRACTION) return 'orange';
  return 'green';
};

// ttl arrives as "5m" or "1h".
const parseTtlSeconds = (ttl: string | undefined): number => {
  const match = /^(\d+)([mh])$/.exec(ttl ?? '');
  return match ? Number(match[1]) * TTL_UNIT_SECONDS[match[2]] : DEFAULT_TTL_SECONDS;
};
