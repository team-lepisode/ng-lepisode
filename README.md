# ng-lepisode

## 사용 가이드

1. `provideNgLepisode`를 사용해 컴포넌트에 필요한 의존성을 주입합니다.

```typescript
// app.config.ts

import { provideNgLepisode } from '@ng-lepisode';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgLepisode({
      uploadService: FileUploadService,
    }),
  ],
};
```

## 개발 가이드

- 2개 이상의 요소를 export 하는 컴포넌트에는 `index.ts` 파일을 생성하여 export 합니다.
