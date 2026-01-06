import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  OnDestroy,
  input,
  inject,
  AfterViewInit,
} from '@angular/core';

export type SparkleMode = 'always' | 'hover';

@Directive({
  selector: '[appSparkle]',
  standalone: true,
})
export class SparkleDirective implements AfterViewInit, OnDestroy {
  // 옵션: 파티클 색상
  colors = input<string | string[]>([
    '#FFD700',
    '#FFA500',
    '#FFFFFF',
    '#00FFFF',
  ]);

  // 옵션: 생성 주기 (ms)
  frequency = input(100);

  // 옵션: 작동 모드 ('always' | 'hover') - 기본값: 항상 반짝임
  mode = input<SparkleMode>('always');

  // 옵션: 비활성화 여부
  disabled = input(false);

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private intervalId: any;

  private readonly starPath =
    'M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z';

  ngAfterViewInit() {
    // 'always' 모드면 시작하자마자 실행
    if (this.mode() === 'always' && !this.disabled()) {
      this.startSparkling();
    }
  }

  ngOnDestroy() {
    this.stopSparkling();
  }

  // Hover 모드일 때만 이벤트 리스너 동작
  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.mode() === 'hover' && !this.disabled()) {
      this.startSparkling();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.mode() === 'hover') {
      this.stopSparkling();
    }
  }

  private startSparkling() {
    if (this.intervalId) return; // 이미 실행 중이면 무시

    // 부모 요소 position 확인 및 설정 (별이 밖으로 나가지 않게)
    const style = window.getComputedStyle(this.el.nativeElement);
    if (style.position === 'static') {
      this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    }

    this.createSparkle(); // 즉시 하나 생성
    this.intervalId = setInterval(() => {
      // 탭이 비활성화되거나 요소가 안 보일 때 성능 저하 방지를 위한 체크 가능
      this.createSparkle();
    }, this.frequency());
  }

  private stopSparkling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private createSparkle() {
    if (this.disabled()) return;

    const parent = this.el.nativeElement;
    const sparkle = this.renderer.createElement('span');

    // 랜덤 속성 계산
    const size = Math.random() * 15 + 5;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const rotation = Math.random() * 360;

    const colorInput = this.colors();
    const color = Array.isArray(colorInput)
      ? colorInput[Math.floor(Math.random() * colorInput.length)]
      : colorInput;

    // SVG 생성
    sparkle.innerHTML = `<svg viewBox="0 0 24 24" fill="${color}" style="width: 100%; height: 100%; display: block;"><path d="${this.starPath}" /></svg>`;

    // 스타일 적용
    this.renderer.setStyle(sparkle, 'position', 'absolute');
    this.renderer.setStyle(sparkle, 'top', `${top}%`);
    this.renderer.setStyle(sparkle, 'left', `${left}%`);
    this.renderer.setStyle(sparkle, 'width', `${size}px`);
    this.renderer.setStyle(sparkle, 'height', `${size}px`);
    this.renderer.setStyle(sparkle, 'pointer-events', 'none');
    this.renderer.setStyle(sparkle, 'z-index', '20');

    this.renderer.appendChild(parent, sparkle);

    // 애니메이션
    const animation = sparkle.animate(
      [
        {
          transform: `translate(-50%, -50%) scale(0) rotate(${rotation}deg)`,
          opacity: 0,
        },
        {
          transform: `translate(-50%, -50%) scale(1) rotate(${rotation + 90}deg)`,
          opacity: 1,
          offset: 0.5,
        },
        {
          transform: `translate(-50%, -50%) scale(0) rotate(${rotation + 180}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 3000 + Math.random() * 400,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      }
    );

    animation.onfinish = () => {
      this.renderer.removeChild(parent, sparkle);
    };
  }
}
