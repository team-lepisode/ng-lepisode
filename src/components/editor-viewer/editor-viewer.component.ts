import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'lepi-editor-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor-viewer.component.html',
  styleUrls: ['./editor-viewer.component.css'],
})
export class EditorViewerComponent {
  private readonly sanitizer = inject(DomSanitizer);

  /**
   * HTML content to display
   */
  content = input<string>('');

  /**
   * Whether to remove image tags from the content
   */
  removeImages = input<boolean, string | boolean>(false, {
    transform: booleanAttribute,
  });

  /**
   * Processed and sanitized HTML content
   */
  sanitizedContent = computed<SafeHtml>(() => {
    let html = this.content();

    if (!html) {
      return '';
    }

    // Remove image tags if requested
    if (this.removeImages()) {
      html = this.stripImageTags(html);
    }

    // Sanitize and trust the HTML
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  /**
   * Remove all <img> tags from HTML string
   */
  private stripImageTags(html: string): string {
    // Remove <img> tags (self-closing and with attributes)
    return html.replace(/<img[^>]*\/?>/gi, '');
  }
}
