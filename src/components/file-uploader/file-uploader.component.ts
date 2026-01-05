import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';
import {
  NG_LEPISODE_CONFIG,
  NgLepisodeConfig,
} from '../../libs/provideNgLepisode';

@Component({
  selector: 'lepi-file-uploader',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
})
export class FileUploaderComponent
  implements FormValueControl<string | string[]>
{
  private readonly config = inject<NgLepisodeConfig>(NG_LEPISODE_CONFIG);
  private readonly uploadService = this.config.uploadService;

  /** 허용 파일 타입 (e.g., 'image/*', '.pdf,.doc') */
  accept = input<string>('*');

  /** 최대 파일 개수 */
  maxFiles = input<number>(10);

  /** 업로드된 파일 URL 배열 */
  value = model<string | string[]>([]);

  /** 드래그 오버 상태 */
  isDragOver = signal(false);

  /** 업로드 중 상태 */
  isUploading = signal(false);

  /** 내부 처리를 위한 정규화된 파일 URL 배열 */
  normalizedValue = computed(() => {
    const val = this.value();
    if (Array.isArray(val)) return val;
    return val ? [val] : [];
  });

  /** 단일 파일 모드 여부 */
  isSingleMode = computed(() => this.maxFiles() === 1);

  /** 이미지 타입 여부 */
  isImageMode = computed(() => this.accept().includes('image'));

  /** 파일 개수 제한 도달 여부 */
  isMaxReached = computed(
    () => this.normalizedValue().length >= this.maxFiles()
  );

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isMaxReached()) {
      this.isDragOver.set(true);
    }
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      await this.handleFiles(Array.from(files));
    }
  }

  async onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      await this.handleFiles(Array.from(input.files));
      input.value = ''; // Reset input
    }
  }

  private async handleFiles(files: File[]) {
    if (this.isMaxReached()) return;

    const remainingSlots = this.maxFiles() - this.normalizedValue().length;
    const filesToUpload = files.slice(0, remainingSlots);

    this.isUploading.set(true);

    try {
      for (const file of filesToUpload) {
        const result = await this.uploadService.upload(file);
        if (this.maxFiles() === 1) {
          this.value.set(result.url);
        } else {
          this.value.update(v => {
            const urls = Array.isArray(v) ? v : v ? [v] : [];
            return [...urls, result.url];
          });
        }
      }
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      this.isUploading.set(false);
    }
  }

  removeFile(index: number) {
    if (this.maxFiles() === 1) {
      this.value.set('');
    } else {
      this.value.update(v => {
        const urls = Array.isArray(v) ? v : v ? [v] : [];
        return urls.filter((_, i) => i !== index);
      });
    }
  }

  getFileName(url: string): string {
    return url.split('/').pop() || url;
  }
}
