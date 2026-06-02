import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { sanitizeEditorHtml } from '../../components/editor-viewer/editor-html-sanitizer';

@Pipe({
  name: 'sanitizeHtml',
})
export class SanitizeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string): string {
    return sanitizeEditorHtml(this.sanitizer, value);
  }
}
