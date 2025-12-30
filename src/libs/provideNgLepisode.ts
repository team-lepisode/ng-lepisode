import { InjectionToken } from '@angular/core';
import { IFileUploadService } from './file-upload-service.interface';

export const NG_LEPISODE_CONFIG = new InjectionToken('NG_LEPISODE_CONFIG');

export type NgLepisodeConfig = {
  uploadService: IFileUploadService;
};

export const provideNgLepisode = (config: NgLepisodeConfig) => {
  return {
    provide: NG_LEPISODE_CONFIG,
    useValue: config,
  };
};
