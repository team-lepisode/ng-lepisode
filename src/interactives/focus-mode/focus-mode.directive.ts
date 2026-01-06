import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  inject,
  OnDestroy,
  input,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appFocusMode]',
  standalone: true,
})
export class FocusModeDirective implements OnDestroy {
  // 옵션: 백드롭 투명도 조절 (기본값: bg-black/60)
  backdropClass = input<string>('bg-black/60');

  // 옵션: 포커스 시 요소 확대 여부
  scale = input<boolean>(true);

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  private backdropEl: HTMLElement | null = null;
  private originalZIndex: string = '';
  private originalPosition: string = '';
  private originalTransform: string = '';

  @HostListener('focusin')
  onFocus() {
    this.createBackdrop();
    this.highlightElement();
  }

  @HostListener('focusout')
  onBlur() {
    this.removeBackdrop();
    this.resetElement();
  }

  // ESC 키로 포커스 해제 지원
  @HostListener('keydown.escape')
  onEsc() {
    this.el.nativeElement.blur();
  }

  private createBackdrop() {
    if (this.backdropEl) return;

    // 1. 백드롭 요소 생성
    this.backdropEl = this.renderer.createElement('div');

    // 2. 스타일 및 클래스 적용 (Tailwind)
    // fixed inset-0 z-40 transition-opacity duration-300 opacity-0
    const classes = [
      'fixed',
      'inset-0',
      'z-[40]',
      'transition-opacity',
      'duration-500',
      'ease-out',
      'backdrop-blur-sm',
      'opacity-0',
      'cursor-default',
    ];
    classes.forEach(c => this.renderer.addClass(this.backdropEl, c));

    // 사용자 지정 배경색 추가 (ex: bg-black/60)
    const bgClass = this.backdropClass().split(' ');
    bgClass.forEach(c => this.renderer.addClass(this.backdropEl, c));

    // 3. 백드롭 클릭 시 포커스 해제 이벤트 연결
    this.renderer.listen(this.backdropEl, 'click', () => {
      this.el.nativeElement.blur();
    });

    // 4. Body에 추가
    this.renderer.appendChild(this.document.body, this.backdropEl);

    // 5. 페이드 인 효과 (DOM 추가 후 약간의 딜레이 필요)
    requestAnimationFrame(() => {
      if (this.backdropEl) {
        this.renderer.removeClass(this.backdropEl, 'opacity-0');
        this.renderer.addClass(this.backdropEl, 'opacity-100');
      }
    });
  }

  private removeBackdrop() {
    if (!this.backdropEl) return;

    const backdrop = this.backdropEl;
    this.backdropEl = null; // 참조 끊기

    // 페이드 아웃
    this.renderer.removeClass(backdrop, 'opacity-100');
    this.renderer.addClass(backdrop, 'opacity-0');

    // 트랜지션 끝난 후 DOM 제거 (500ms)
    setTimeout(() => {
      this.renderer.removeChild(this.document.body, backdrop);
    }, 500);
  }

  private highlightElement() {
    const nativeEl = this.el.nativeElement;

    // 원래 스타일 저장
    this.originalZIndex = nativeEl.style.zIndex;
    this.originalPosition = nativeEl.style.position;
    this.originalTransform = nativeEl.style.transform;

    // 하이라이트 스타일 적용
    // z-index 50 (백드롭이 40이므로 그 위로)
    this.renderer.setStyle(nativeEl, 'position', 'relative');
    this.renderer.setStyle(nativeEl, 'zIndex', '50');
    this.renderer.setStyle(nativeEl, 'transition', 'transform 0.3s ease-out');

    if (this.scale()) {
      this.renderer.setStyle(nativeEl, 'transform', 'scale(1.05)');
    }
  }

  private resetElement() {
    const nativeEl = this.el.nativeElement;

    // 스타일 복구
    this.renderer.setStyle(nativeEl, 'zIndex', this.originalZIndex);
    this.renderer.setStyle(nativeEl, 'transform', this.originalTransform);

    // transition이 끝난 후 position 복구 (확대 효과가 줄어드는 것을 보여주기 위함)
    setTimeout(() => {
      this.renderer.setStyle(nativeEl, 'position', this.originalPosition);
    }, 300);
  }

  ngOnDestroy() {
    // 컴포넌트 파괴 시 백드롭이 남아있으면 제거 (안전장치)
    if (this.backdropEl) {
      this.renderer.removeChild(this.document.body, this.backdropEl);
    }
  }
}
