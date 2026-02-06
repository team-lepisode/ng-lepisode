# Lepi Editor

Tiptap 기반의 리치 텍스트 에디터 컴포넌트입니다.

## Installation

`ng-lepisode` 라이브러리에 포함되어 있습니다.

```typescript
import { EditorComponent } from '@ng-lepisode';
```

## Component

### `<lepi-editor>`

리치 텍스트 편집을 위한 WYSIWYG 에디터입니다.

#### Inputs

| Input   | Type      | Default | Description                   |
| ------- | --------- | ------- | ----------------------------- |
| `value` | `string`  | `''`    | 에디터 콘텐츠 (양방향 바인딩) |
| `image` | `boolean` | `true`  | 이미지 삽입 버튼 표시 여부    |

#### Usage

```html
<!-- 기본 사용 -->
<lepi-editor [(value)]="content" />

<!-- 이미지 버튼 숨기기 -->
<lepi-editor [(value)]="content" [image]="false" />

<!-- Signal Forms와 함께 사용 -->
<lepi-editor [formField]="myForm.content" />
```

---

## Features

### 텍스트 서식

에디터 툴바에서 텍스트 서식을 적용할 수 있습니다.

- **굵게** (Ctrl+B): 선택한 텍스트를 굵게 표시
- **기울임** (Ctrl+I): 선택한 텍스트를 기울임꼴로 표시
- **밑줄** (Ctrl+U): 선택한 텍스트에 밑줄 추가
- **취소선**: 선택한 텍스트에 취소선 추가

### 제목 스타일

드롭다운 메뉴에서 본문과 제목 스타일(H1~H4)을 선택할 수 있습니다.

- **본문**: 일반 텍스트 단락
- **제목 1~4**: 크기별 제목 스타일

### 텍스트 정렬

단락 또는 제목의 정렬을 설정할 수 있습니다.

- **왼쪽 정렬**: 텍스트를 왼쪽으로 정렬
- **가운데 정렬**: 텍스트를 가운데로 정렬
- **오른쪽 정렬**: 텍스트를 오른쪽으로 정렬

### 목록

순서가 있는 목록과 없는 목록을 만들 수 있습니다.

- **글머리 기호**: 순서 없는 목록 (•, ◦, ▪)
- **번호 매기기**: 순서 있는 목록 (1, 2, 3...)

### 링크

텍스트에 하이퍼링크를 추가하거나 수정할 수 있습니다.

- 링크 버튼 클릭 → URL 입력 → 적용
- 기존 링크 텍스트 선택 시 URL이 자동으로 입력 필드에 표시됨
- 링크 삭제 버튼으로 링크 제거 가능

### 테이블

표를 삽입하고 편집할 수 있습니다.

- **표 삽입**: 3x3 기본 테이블 생성
- **편집 모드**: 테이블 셀에 커서가 있으면 편집 드롭다운 표시
  - 열: 왼쪽/오른쪽에 열 추가, 열 삭제
  - 행: 위/아래에 행 추가, 행 삭제
  - 셀: 셀 병합, 셀 분할
  - 표 삭제: 전체 테이블 제거

### 이미지

이미지를 업로드하여 에디터에 삽입할 수 있습니다.

- 이미지 버튼 클릭 → 파일 선택 → 자동 업로드 및 삽입
- `[image]="false"` 설정으로 이미지 버튼 숨기기 가능

### 슬래시 커맨드

빈 줄에서 `/`를 입력하면 명령어 메뉴가 표시됩니다.

- 키보드 방향키(↑, ↓)로 항목 선택
- Enter 키로 명령 실행
- Esc 키로 메뉴 닫기

---

## Example

```typescript
@Component({
  selector: 'app-example',
  imports: [EditorComponent],
  template: ` <lepi-editor [(value)]="content" /> `,
})
export class ExampleComponent {
  content = signal('<p>Hello World</p>');
}
```
