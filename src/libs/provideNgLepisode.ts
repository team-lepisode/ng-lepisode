import { InjectionToken, Provider, Type, inject } from '@angular/core';
import { IFileUploadService } from './file-upload-service.interface';

export const NG_LEPISODE_CONFIG = new InjectionToken<NgLepisodeConfig>(
  'NG_LEPISODE_CONFIG'
);

export type NgLepisodeConfig = {
  uploadService: IFileUploadService;
};

export const provideNgLepisode = (config: {
  uploadService: Type<IFileUploadService>;
}): Provider[] => {
  return [
    config.uploadService,
    {
      provide: NG_LEPISODE_CONFIG,
      useFactory: () => {
        return {
          uploadService: inject(config.uploadService),
        };
      },
    },
  ];
};
