# SanitizeHtmlPipe

Angular의 기본 DOM Sanitization을 우회하여 HTML 콘텐츠를 그대로 렌더링하는 간단한 파이프입니다. 이를 통해 Angular가 스타일이나 "안전하지 않은" 태그를 제거하지 않고 HTML 문자열을 `[innerHTML]`에 바인딩할 수 있습니다.

## 사용법 (Usage)

1. `SanitizeHtmlPipe`(또는 이를 내보내는 모듈)를 컴포넌트나 모듈로 가져옵니다.
2. 템플릿에서 `innerHTML` 바인딩과 함께 파이프를 사용합니다.

```html
<div [innerHTML]="htmlContent | sanitizeHtml"></div>
```

## ⚠️ 보안 경고 (Security Warning)

**주의해서 사용하세요.** 이 파이프는 `DomSanitizer.bypassSecurityTrustHtml()`을 호출합니다.

- **신뢰할 수 있는** 콘텐츠(예: 하드코딩된 문자열, 서버에서 이미 살균(sanitize) 처리된 데이터베이스 콘텐츠)에만 이 파이프를 사용하세요.
- 서버 측 살균 처리 없이 사용자 생성 콘텐츠에 **절대 사용하지 마세요**. 애플리케이션이 XSS(Cross-Site Scripting) 공격에 노출될 수 있습니다.
