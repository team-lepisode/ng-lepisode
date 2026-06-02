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

const TEXT_ALIGN_PATTERN = /text-align\s*:\s*(left|center|right|justify)\b/i;

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

function appendClassAttribute(attributes: string, className: string): string {
  const classAttributePattern = /\sclass\s*=\s*(["'])(.*?)\1/i;
  const classMatch = attributes.match(classAttributePattern);

  if (!classMatch) {
    return `${attributes} class="${className}"`;
  }

  const currentClasses = classMatch[2].split(/\s+/).filter(Boolean);

  if (currentClasses.includes(className)) {
    return attributes;
  }

  return attributes.replace(
    classAttributePattern,
    ` class=${classMatch[1]}${[...currentClasses, className].join(' ')}${
      classMatch[1]
    }`
  );
}

function preserveTextAlignClasses(value: string): string {
  return value.replace(
    /<(p|h[1-6]|div|li|td|th)(\s[^>]*)?>/gi,
    (match: string, tagName: string, attributes: string | undefined) => {
      const currentAttributes = attributes ?? '';
      const align = currentAttributes.match(TEXT_ALIGN_PATTERN)?.[1];

      if (!align) {
        return match;
      }

      return `<${tagName}${appendClassAttribute(
        currentAttributes,
        `lepi-editor-align-${align.toLowerCase()}`
      )}>`;
    }
  );
}

export function sanitizeEditorHtml(
  sanitizer: DomSanitizer,
  value: string | null | undefined,
  options: { removeImages?: boolean } = {}
): string {
  const decoded = decodeHtmlEntities(value ?? '');
  const aligned = preserveTextAlignClasses(decoded);
  const html = options.removeImages ? stripImageTags(aligned) : aligned;

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
