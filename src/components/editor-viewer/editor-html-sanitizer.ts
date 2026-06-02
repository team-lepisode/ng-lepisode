import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

const ENTITY_MAP: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
};

function toCodePoint(value: number, fallback: string): string {
  if (!Number.isInteger(value) || value < 0 || value > 0x10ffff) {
    return fallback;
  }

  return String.fromCodePoint(value);
}

function decodeHtmlEntitiesOnce(value: string): string {
  return value.replace(
    /&(?:#(\d+)|#x([0-9a-fA-F]+)|([a-zA-Z]+));/g,
    (
      match,
      decimal: string | undefined,
      hex: string | undefined,
      named: string | undefined
    ) => {
      if (decimal) {
        return toCodePoint(Number(decimal), match);
      }

      if (hex) {
        return toCodePoint(Number.parseInt(hex, 16), match);
      }

      return ENTITY_MAP[named ?? ''] ?? match;
    }
  );
}

function decodeHtmlEntities(value: string): string {
  let decoded = value;

  for (let i = 0; i < 3; i += 1) {
    const next = decodeHtmlEntitiesOnce(decoded);
    if (next === decoded) {
      break;
    }
    decoded = next;
  }

  return decoded;
}

function stripImageTags(value: string): string {
  return value.replace(/<img[^>]*\/?>/gi, '');
}

export function sanitizeEditorHtml(
  sanitizer: DomSanitizer,
  value: string | null | undefined,
  options: { removeImages?: boolean } = {}
): string {
  const decoded = decodeHtmlEntities(value ?? '');
  const html = options.removeImages ? stripImageTags(decoded) : decoded;

  return sanitizer.sanitize(SecurityContext.HTML, html) ?? '';
}

export function editorHtmlToPlainText(
  value: string | null | undefined
): string {
  return decodeHtmlEntities(value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
