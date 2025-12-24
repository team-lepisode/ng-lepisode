# HighlightPipe

## 설명

`HighlightPipe`는 텍스트 내에서 특정 검색어와 일치하는 부분을 찾아 `<mark>` 태그로 감싸 강조 표시하는 파이프입니다. 검색어는 대소문자를 구분하지 않으며(case-insensitive), 모든 일치 항목을 찾아냅니다.

## 사용법

이 파이프는 HTML 태그를 포함한 문자열을 반환하므로, Angular의 `[innerHTML]` 바인딩과 함께 사용하는 것이 좋습니다.

```html
<div [innerHTML]="text | highlight: searchTerm"></div>
```

## 매개변수

| 매개변수 | 타입     | 설명                   |
| -------- | -------- | ---------------------- |
| `value`  | `string` | 원본 텍스트            |
| `target` | `string` | 강조할 검색어 (Target) |

## 예제

```typescript
// 컴포넌트
text = 'Hello World';
searchTerm = 'world';
```

```html
<!-- 결과: Hello <mark >World</mark> -->
<div [innerHTML]="text | highlight: searchTerm"></div>
```

## 주의사항

- 반환된 값은 HTML 문자열이므로, 보안을 위해 `DomSanitizer`를 사용하거나 신뢰할 수 있는 콘텐츠에만 사용해야 합니다.
- 검색어에 포함된 특수 문자는 자동으로 이스케이프 처리되어 정규식 오류를 방지합니다.
