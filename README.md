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

## 주의 사항

- `data-grid` 컴포넌트는 I18N 지원을 위해 ngx-translate를 사용합니다.
- 아래의 목록을 반드시 `ko-KR.json`에 등록 한 뒤 사용하세요.

```json
{
  "table": "테이블",
  "gallery": "갤러리",
  "calendar": "달력",
  "add_filter": "필터 추가",
  "filter": "필터",
  "sort": "정렬",
  "sort.ascending": "오름차순",
  "sort.descending": "내림차순",
  "remove": "삭제",
  "no_data": "데이터가 없습니다",
  "no_title": "제목 없음",
  "no_description": "설명 없음"
}
```
