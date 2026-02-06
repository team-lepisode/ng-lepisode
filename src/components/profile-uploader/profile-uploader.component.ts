import { CommonModule } from '@angular/common';
import { Component, inject, model, signal } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  NG_LEPISODE_CONFIG,
  NgLepisodeConfig,
} from '../../libs/provideNgLepisode';

/**
 * @author Lepisode
 * @description Circular profile image uploader component
 */
@Component({
  selector: 'lepi-profile-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-uploader.component.html',
  styleUrls: ['./profile-uploader.component.css'],
})
export class ProfileUploaderComponent implements FormValueControl<string> {
  private readonly config = inject<NgLepisodeConfig>(NG_LEPISODE_CONFIG);
  private readonly uploadService = this.config.uploadService;

  /** 업로드된 프로필 이미지 URL */
  value = model<string>('');

  /** 업로드 중 상태 */
  isUploading = signal(false);

  /** 드래그 오버 상태 */
  isDragOver = signal(false);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
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
      await this.handleFile(files[0]);
    }
  }

  async onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      await this.handleFile(input.files[0]);
      input.value = ''; // Reset input
    }
  }

  private async handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;

    this.isUploading.set(true);

    try {
      const result = await this.uploadService.upload(file);
      this.value.set(result.url);
    } catch (error) {
      console.error('Profile image upload failed:', error);
    } finally {
      this.isUploading.set(false);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.value.set('');
  }
}
