const ANSI_CODES = {
  bold: '1', dim: '2', red: '31', green: '32', yellow: '33', blue: '34', magenta: '35', gray: '90',
  orange: '38;5;208',
} as const;

export type Style = keyof typeof ANSI_CODES;

export const paint = (text: string, ...styles: Style[]): string =>
  `${styles.map((style) => `\x1b[${ANSI_CODES[style]}m`).join('')}${text}\x1b[0m`;
