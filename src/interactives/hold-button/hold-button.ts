import { Component, signal, output, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hold-button-enhanced',
  imports: [CommonModule],
  templateUrl: './hold-button.html',
  styleUrls: ['./hold-button.css'],
})
export class HoldButtonEnhanced {
  // --- Inputs ---
  type = input<'fill' | 'stroke' | 'both'>('fill'); // 'fill' | 'stroke' | 'both'

  // --- Outputs ---
  actionCompleted = output<void>();

  // --- State ---
  isHolding = signal(false);
  progress = signal(0);
  completed = signal(false);
  timeLeft = signal('2.0');

  // --- Constants ---
  readonly pathLength = 448; // 둘레 길이
  readonly holdTimeMs = 2000;
  private timer: any;
  private interval: any;

  // --- Computed Logic ---
  // 타입에 따라 렌더링 여부 결정
  showFill = computed(() => this.type() === 'fill' || this.type() === 'both');
  showStroke = computed(
    () => this.type() === 'stroke' || this.type() === 'both'
  );

  // Stroke 애니메이션 계산
  currentOffset = computed(() => {
    // Fill 모드일 땐 계산 불필요
    if (!this.showStroke()) return 0;
    return this.pathLength * (1 - this.progress());
  });

  transitionDuration = computed(() => {
    return this.isHolding() ? `${this.holdTimeMs}ms` : '200ms';
  });

  // --- Actions ---
  startHold() {
    if (this.completed()) return;

    this.isHolding.set(true);
    this.progress.set(1); // 애니메이션 시작

    // 타이머 로직
    let remaining = this.holdTimeMs;
    this.timeLeft.set((remaining / 1000).toFixed(1));

    this.interval = setInterval(() => {
      remaining -= 100;
      if (remaining > 0) this.timeLeft.set((remaining / 1000).toFixed(1));
    }, 100);

    this.timer = setTimeout(() => this.completeAction(), this.holdTimeMs);
  }

  cancelHold() {
    if (this.completed()) return;

    this.isHolding.set(false);
    this.progress.set(0); // 복귀
    this.timeLeft.set((this.holdTimeMs / 1000).toFixed(1));

    clearTimeout(this.timer);
    clearInterval(this.interval);
  }

  completeAction() {
    this.completed.set(true);
    this.isHolding.set(false);
    clearInterval(this.interval);
    this.actionCompleted.emit();

    if (typeof navigator !== 'undefined' && navigator.vibrate)
      navigator.vibrate(100);

    setTimeout(() => {
      this.completed.set(false);
      this.progress.set(0);
      this.timeLeft.set((this.holdTimeMs / 1000).toFixed(1));
    }, 3000);
  }
}
