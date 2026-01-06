import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Renderer2,
  input,
  booleanAttribute,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appParticle]',
  standalone: true,
})
export class ParticleDirective {
  // 옵션: 파티클 색상 배열 (기본값: 무지개)
  colors = input<string[]>([
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#00FFFF',
    '#FF00FF',
  ]);

  // 옵션: 파티클 개수
  count = input(30);

  // 옵션: 비활성화 여부
  disabled = input(false, { transform: booleanAttribute });

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    if (this.disabled()) return;

    // 모바일 햅틱 피드백 (지원 기기만)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }

    this.explode(e.clientX, e.clientY);
  }

  private explode(x: number, y: number) {
    const particles: HTMLElement[] = [];
    const colorList = this.colors();

    for (let i = 0; i < this.count(); i++) {
      // 1. 파티클 요소 생성
      const particle = this.renderer.createElement('div');

      // 2. 스타일 주입 (클래스 대신 인라인 스타일로 독립성 보장)
      const color = colorList[Math.floor(Math.random() * colorList.length)];
      const size = Math.random() * 5 + 4; // 4px ~ 9px 랜덤 크기

      this.renderer.setStyle(particle, 'position', 'fixed');
      this.renderer.setStyle(particle, 'top', `${y}px`);
      this.renderer.setStyle(particle, 'left', `${x}px`);
      this.renderer.setStyle(particle, 'width', `${size}px`);
      this.renderer.setStyle(particle, 'height', `${size}px`);
      this.renderer.setStyle(particle, 'backgroundColor', color);
      this.renderer.setStyle(particle, 'borderRadius', '50%');
      this.renderer.setStyle(particle, 'pointerEvents', 'none'); // 클릭 방해 금지
      this.renderer.setStyle(particle, 'zIndex', '9999'); // 최상단 노출

      // 3. body에 추가 (버튼 내부가 아닌 body에 붙여야 overflow 문제 해결됨)
      this.renderer.appendChild(this.document.body, particle);
      particles.push(particle);

      // 4. 물리 계산 (랜덤 각도 및 거리)
      const angle = Math.random() * Math.PI * 2;
      const velocity = 60 + Math.random() * 100; // 퍼지는 거리 (60px ~ 160px)
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      // 5. 애니메이션 실행 (Web Animations API)
      const animation = particle.animate(
        [
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
          {
            transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: 500 + Math.random() * 500, // 0.5초 ~ 1.0초
          easing: 'cubic-bezier(0, .9, .57, 1)', // 펑 터지는 느낌의 가속도
        }
      );

      // 6. 메모리 정리 (애니메이션 종료 후 DOM 제거)
      animation.onfinish = () => {
        this.renderer.removeChild(this.document.body, particle);
      };
    }
  }
}
