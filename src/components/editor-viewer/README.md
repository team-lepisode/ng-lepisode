# Lepi Editor Viewer

에디터로 작성된 HTML 콘텐츠를 읽기 전용으로 표시하는 컴포넌트입니다.

## Installation

`ng-lepisode` 라이브러리에 포함되어 있습니다.

```typescript
import { EditorViewerComponent } from '@ng-lepisode';
```

## Component

### `<lepi-editor-viewer>`

HTML 콘텐츠를 안전하게 렌더링합니다.

#### Inputs

| Input          | Type      | Default | Description           |
| -------------- | --------- | ------- | --------------------- |
| `content`      | `string`  | `''`    | 표시할 HTML 콘텐츠    |
| `removeImages` | `boolean` | `false` | 이미지 태그 제거 여부 |

---

## Usage

```html
<!-- 기본 사용 -->
<lepi-editor-viewer [content]="htmlContent" />

<!-- 이미지 제거 -->
<lepi-editor-viewer [content]="htmlContent" [removeImages]="true" />

<!-- Signal 사용 -->
<lepi-editor-viewer [content]="article().content" />
```

---

## Features

### 지원되는 HTML 요소

에디터 뷰어는 다음 HTML 요소들에 대한 스타일을 제공합니다:

| 요소              | 설명      |
| ----------------- | --------- |
| `<p>`             | 문단      |
| `<h1>` ~ `<h4>`   | 제목      |
| `<ul>`, `<ol>`    | 목록      |
| `<blockquote>`    | 인용문    |
| `<pre>`, `<code>` | 코드 블록 |
| `<table>`         | 테이블    |
| `<img>`           | 이미지    |
| `<a>`             | 링크      |
| `<hr>`            | 수평선    |

### 이미지 제거 옵션

목록이나 미리보기에서 이미지 없이 텍스트만 표시하고 싶을 때 유용합니다.

```html
<!-- 이미지가 포함된 콘텐츠에서 이미지만 제거 -->
<lepi-editor-viewer [content]="post.body" [removeImages]="true" />
```

---

## Example

```typescript
@Component({
  selector: 'app-article-detail',
  imports: [EditorViewerComponent],
  template: `
    <article class="prose">
      <h1>{{ article().title }}</h1>
      <lepi-editor-viewer [content]="article().content" />
    </article>
  `,
})
export class ArticleDetailComponent {
  article = input.required<Article>();
}
```
