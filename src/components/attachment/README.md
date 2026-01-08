# Lepi Attachment

파일 첨부를 표시하는 컴포넌트입니다. 파일 유형에 따라 적절한 아이콘을 표시하고, 클릭 시 새 탭에서 파일을 열거나 다운로드합니다.

## Installation

`ng-lepisode` 라이브러리에 포함되어 있습니다.

```typescript
import { AttachmentComponent } from '@ng-lepisode';
```

## Component

### `<lepi-attachment>`

파일 첨부 링크를 표시합니다.

#### Inputs

| Input  | Type     | Required | Description               |
| ------ | -------- | -------- | ------------------------- |
| `url`  | `string` | ✓        | 파일 URL                  |
| `name` | `string` |          | 표시할 파일명 (선택 사항) |

> `name`을 지정하지 않으면 URL에서 파일명을 자동으로 추출합니다.

---

## Usage

```html
<!-- 기본 사용 -->
<lepi-attachment [url]="'https://example.com/files/document.pdf'" />

<!-- 파일명 직접 지정 -->
<lepi-attachment
  [url]="'https://example.com/files/abc123'"
  [name]="'계약서.pdf'" />

<!-- 반복 렌더링 -->
@for (file of files; track file.url) {
<lepi-attachment [url]="file.url" [name]="file.name" />
}
```

---

## Features

### 파일 유형별 아이콘

파일 확장자에 따라 자동으로 적절한 아이콘이 표시됩니다.

| 확장자                    | 아이콘        |
| ------------------------- | ------------- |
| `.jpg`, `.png`, `.gif` 등 | 이미지 아이콘 |
| `.pdf`                    | PDF 아이콘    |
| `.doc`, `.docx`           | Word 아이콘   |
| `.xls`, `.xlsx`           | Excel 아이콘  |
| `.ppt`, `.pptx`           | PPT 아이콘    |
| `.zip`, `.rar`, `.7z` 등  | 압축 아이콘   |
| 기타                      | 문서 아이콘   |

### 인터랙션

- 호버 시 다운로드 아이콘 표시
- 클릭 시 새 탭에서 파일 열기

---

## Example

```typescript
@Component({
  selector: 'app-example',
  imports: [AttachmentComponent],
  template: `
    <div class="flex flex-col gap-2">
      @for (attachment of attachments(); track attachment.url) {
        <lepi-attachment [url]="attachment.url" [name]="attachment.name" />
      }
    </div>
  `,
})
export class ExampleComponent {
  attachments = signal([
    { url: 'https://example.com/report.pdf', name: '보고서.pdf' },
    { url: 'https://example.com/data.xlsx', name: '데이터.xlsx' },
  ]);
}
```
