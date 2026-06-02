import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { sanitizeEditorHtml } from './editor-html-sanitizer';

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
  sanitizedContent = computed(() =>
    sanitizeEditorHtml(this.sanitizer, this.content(), {
      removeImages: this.removeImages(),
    })
  );
}
