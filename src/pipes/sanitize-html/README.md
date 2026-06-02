# SanitizeHtmlPipe

HTML entity를 디코딩한 뒤 Angular DOM Sanitization을 적용해 HTML 콘텐츠를 안전하게 렌더링하는 파이프입니다.

## 사용법 (Usage)

1. `SanitizeHtmlPipe`(또는 이를 내보내는 모듈)를 컴포넌트나 모듈로 가져옵니다.
2. 템플릿에서 `innerHTML` 바인딩과 함께 파이프를 사용합니다.

```html
<div [innerHTML]="htmlContent | sanitizeHtml"></div>
```

## ⚠️ 보안 경고 (Security Warning)

Angular sanitizer가 허용하지 않는 태그와 속성은 렌더링 전에 제거됩니다.

- **신뢰할 수 있는** 콘텐츠(예: 하드코딩된 문자열, 서버에서 이미 살균(sanitize) 처리된 데이터베이스 콘텐츠)에만 이 파이프를 사용하세요.
- 서버 측 살균 처리 없이 사용자 생성 콘텐츠에 **절대 사용하지 마세요**. 애플리케이션이 XSS(Cross-Site Scripting) 공격에 노출될 수 있습니다.
