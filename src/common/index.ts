/**
 * Common utilities and constants
 */

export * from './colors';
export { default as Colors } from './colors';

// Number formatting utilities
export function formatNumber(num: number, precision = 0): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

export function formatPercentage(num: number, precision = 0): string {
  return `${num.toFixed(precision)}%`;
}

// Reading time calculation (avg 200 words per minute)
export function readingTime(wordCount: number): string {
  const minutes = Math.ceil(wordCount / 200);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMinutes} min`;
}

// Constants
export const Constants = {
  ReaderBaseFontSize: 17,
  ReaderBaseLineHeight: 28,
  ReaderFontStepSize: 2,
  ReaderWebFontConversion: 1.0,
};
