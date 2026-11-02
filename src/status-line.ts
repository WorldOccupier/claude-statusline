import { paint } from './colors.ts';
import { formatModel, formatEffort, formatContext, formatCache } from './segments.ts';
import type { SessionInput } from './session-input.ts';

const SEPARATOR = paint(' · ', 'dim');

export class StatusLine {
  private readonly clock: () => number;

  constructor(clock: () => number) {
    this.clock = clock;
  }

  render(sessionInput: SessionInput): string {
    return [
      formatModel(sessionInput),
      formatEffort(sessionInput),
      formatContext(sessionInput),
      formatCache(sessionInput, this.clock()),
    ].join(SEPARATOR);
  }
}
