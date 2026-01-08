# Lepi File Uploader

파일 업로드를 위한 드래그 앤 드롭 컴포넌트입니다.

## Installation

`ng-lepisode` 라이브러리에 포함되어 있습니다.

```typescript
import { FileUploaderComponent } from '@ng-lepisode';
```

## Component

### `<lepi-file-uploader>`

드래그 앤 드롭 또는 클릭으로 파일을 업로드합니다.

#### Inputs

| Input      | Type                 | Default | Description                       |
| ---------- | -------------------- | ------- | --------------------------------- |
| `value`    | `string \| string[]` | `[]`    | 업로드된 파일 URL (양방향 바인딩) |
| `accept`   | `string`             | `'*'`   | 허용 파일 타입 (e.g., `image/*`)  |
| `maxFiles` | `number`             | `10`    | 최대 업로드 파일 개수             |

---

## Usage

### 단일 이미지 업로드

```html
<lepi-file-uploader [(value)]="thumbnailUrl" accept="image/*" [maxFiles]="1" />
```

### 다중 파일 업로드

```html
<lepi-file-uploader [(value)]="attachmentUrls" [maxFiles]="5" />
```

### 특정 파일 타입만 허용

```html
<!-- PDF 파일만 허용 -->
<lepi-file-uploader [(value)]="documentUrls" accept=".pdf" />

<!-- 문서 파일만 허용 -->
<lepi-file-uploader
  [(value)]="documentUrls"
  accept=".pdf,.doc,.docx,.xls,.xlsx" />
```

---

## Features

### 드래그 앤 드롭

- 파일을 드래그하여 업로드 영역에 놓으면 자동 업로드
- 드래그 오버 시 시각적 피드백 제공

### 이미지 모드

`accept`에 `image`가 포함되면 이미지 모드로 동작합니다:

- 업로드된 이미지 썸네일 미리보기
- 그리드 레이아웃으로 표시

### 파일 모드

이미지가 아닌 파일은 파일명과 아이콘으로 표시됩니다.

### 단일/다중 모드

- `maxFiles="1"`: 단일 파일 모드 (`value`는 `string`)
- `maxFiles > 1`: 다중 파일 모드 (`value`는 `string[]`)

---

## Configuration

업로드 서비스는 `provideNgLepisode`를 통해 설정합니다:

```typescript
// app.config.ts
provideNgLepisode({
  uploadService: {
    async upload(file: File) {
      // 서버에 파일 업로드 후 URL 반환
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return { url: data.url };
    },
  },
});
```

---

## Example

```typescript
@Component({
  selector: 'app-product-form',
  imports: [FileUploaderComponent],
  template: `
    <div class="form-control">
      <label class="label">상품 이미지</label>
      <lepi-file-uploader
        [(value)]="imageUrls"
        accept="image/*"
        [maxFiles]="5" />
    </div>

    <div class="form-control">
      <label class="label">첨부 파일</label>
      <lepi-file-uploader
        [(value)]="attachmentUrls"
        accept=".pdf,.doc,.docx"
        [maxFiles]="3" />
    </div>
  `,
})
export class ProductFormComponent {
  imageUrls = signal<string[]>([]);
  attachmentUrls = signal<string[]>([]);
}
```
