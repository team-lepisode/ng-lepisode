import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'lepi-attachment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css'],
})
export class AttachmentComponent {
  url = input.required<string>();
  name = input<string>();

  fileName = computed(() => {
    const providedName = this.name();
    if (providedName) return providedName;

    const urlStr = this.url();
    try {
      const decodedUrl = decodeURIComponent(urlStr);
      const parts = decodedUrl.split('/');
      const lastPart = parts[parts.length - 1];
      // Remove query parameters if any
      return lastPart.split('?')[0];
    } catch (e) {
      return urlStr;
    }
  });

  getFileIcon() {
    const name = this.fileName().toLowerCase();
    if (name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/))
      return 'icon-[mdi--file-image-outline]';
    if (name.match(/\.(pdf)$/)) return 'icon-[mdi--file-pdf-box]';
    if (name.match(/\.(doc|docx)$/)) return 'icon-[mdi--file-word-outline]';
    if (name.match(/\.(xls|xlsx)$/)) return 'icon-[mdi--file-excel-outline]';
    if (name.match(/\.(ppt|pptx)$/))
      return 'icon-[mdi--file-powerpoint-outline]';
    if (name.match(/\.(zip|rar|7z|tar|gz)$/))
      return 'icon-[mdi--zip-box-outline]';
    return 'icon-[mdi--file-document-outline]';
  }
}
