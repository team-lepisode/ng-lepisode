import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  input,
  OnDestroy,
  output,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-slide-to-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-to-confirm.html',
  styleUrl: './slide-to-confirm.css',
})
export class SlideToConfirm implements OnDestroy {
  label = input('슬라이드');
  successLabel = input('완료');

  confirm = output<void>();

  isDragging = signal(false);
  isConfirmed = signal(false);
  currentX = signal(4); // padding 4px

  handleWidth = signal(48); // 기본값, 실제론 계산됨

  private startX = 0;
  private maxDrag = 0;
  private padding = 4;

  @ViewChild('track') trackRef!: ElementRef<HTMLElement>;
  @ViewChild('handle') handleRef!: ElementRef<HTMLElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public reset() {
    this.isConfirmed.set(false);
    this.currentX.set(this.padding);
  }

  startDrag(e: MouseEvent | TouchEvent) {
    if (this.isConfirmed() || !isPlatformBrowser(this.platformId)) return;

    // 터치 이벤트 스크롤 방지
    if (e.cancelable && e.type === 'touchstart') e.preventDefault();

    const clientX = this.getClientX(e);
    this.startX = clientX;
    this.isDragging.set(true);

    // 드래그 가능 최대 거리 계산
    const trackWidth = this.trackRef.nativeElement.offsetWidth;
    const handleW = this.handleRef.nativeElement.offsetWidth;
    this.handleWidth.set(handleW);
    this.maxDrag = trackWidth - handleW - this.padding;

    // 글로벌 이벤트 등록 (드래그 중 마우스가 요소 밖으로 나가도 끊기지 않게)
    this.addGlobalListeners();
  }

  private onDrag = (e: MouseEvent | TouchEvent) => {
    if (!this.isDragging()) return;

    const clientX = this.getClientX(e);
    const delta = clientX - this.startX;

    // 현재 위치 + 이동량 (Min: padding, Max: maxDrag)
    let newX = this.padding + delta;
    newX = Math.max(this.padding, Math.min(this.maxDrag, newX));

    // 값 업데이트 (Signal이 뷰를 갱신)
    this.currentX.set(newX);

    // 문턱값 (95%) 도달 시 즉시 성공 처리 (UX 옵션)
    if (newX >= this.maxDrag * 0.95) {
      this.finishDrag(true);
    }
  };

  private stopDrag = () => {
    if (!this.isDragging()) return;
    this.finishDrag(false);
  };

  private finishDrag(forceSuccess: boolean) {
    this.isDragging.set(false);
    this.removeGlobalListeners();

    if (forceSuccess || this.currentX() >= this.maxDrag * 0.95) {
      // 성공
      this.currentX.set(this.maxDrag);
      this.isConfirmed.set(true);

      // 모바일 햅틱 피드백
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }

      this.confirm.emit();
    } else {
      // 실패: 원위치로 튕겨져 돌아감 (CSS transition이 처리)
      this.currentX.set(this.padding);
    }
  }

  private getClientX(e: MouseEvent | TouchEvent): number {
    return 'touches' in e ? e.touches[0].clientX : e.clientX;
  }

  private addGlobalListeners() {
    if (!isPlatformBrowser(this.platformId)) return;

    window.addEventListener('mousemove', this.onDrag);
    window.addEventListener('mouseup', this.stopDrag);
    window.addEventListener('touchmove', this.onDrag, { passive: false }); // passive: false 중요
    window.addEventListener('touchend', this.stopDrag);
  }

  private removeGlobalListeners() {
    if (!isPlatformBrowser(this.platformId)) return;

    window.removeEventListener('mousemove', this.onDrag);
    window.removeEventListener('mouseup', this.stopDrag);
    window.removeEventListener('touchmove', this.onDrag);
    window.removeEventListener('touchend', this.stopDrag);
  }

  ngOnDestroy() {
    this.removeGlobalListeners();
  }
}
