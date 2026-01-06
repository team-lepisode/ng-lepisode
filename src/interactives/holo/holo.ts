import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-ultimate-holo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './holo.html',
  styleUrl: './holo.css',
})
export class UltimateHoloCard {
  src = input<string>();

  // 상태값 (0 ~ 100%)
  x = signal(50);
  y = signal(50);
  active = signal(false);

  // 1. 카드 회전 및 3D 변환 계산
  transformStyle = computed(() => {
    if (!this.active()) return 'rotateX(0deg) rotateY(0deg) scale(1)';

    const rX = (this.y() - 50) * -1; // 상하 반전 (-10 ~ 10 deg) - 최대 각도 줄임
    const rY = this.x() - 50; // 좌우 ( -10 ~ 10 deg)

    return `rotateX(${rX / 2.5}deg) rotateY(${rY / 2.5}deg) scale(1.05)`;
  });

  // 2. 홀로그램 무지개 패턴 (Deep Logic: 반복 선형 그라디언트로 프리즘 효과)
  holoGradient = computed(() => {
    return `
      repeating-linear-gradient(
        110deg, 
        #ff0000 0%, 
        #ff9a00 10%, 
        #d0de21 20%, 
        #4fdc4a 30%, 
        #3fdad8 40%, 
        #2fc9e2 50%, 
        #1c7fee 60%, 
        #5f15f2 70%, 
        #ba0cf8 80%, 
        #fb07d9 90%, 
        #ff0000 100%
      )
    `;
  });

  // 3. 홀로그램 위치 이동 (시차 효과)
  // 마우스 위치에 따라 그라디언트 배경 자체를 이동시켜 빛이 흐르는 느낌을 줌
  holoPosition = computed(() => {
    return `${this.x()}% ${this.y()}%`;
  });

  // 4. 하이라이트(Glare) - 마우스 위치의 반대편에서 빛이 들어오는 느낌
  glareGradient = computed(() => {
    const px = this.x();
    const py = this.y();
    // 원형 그라디언트 중심을 마우스 위치로 잡음
    return `radial-gradient(farthest-corner at ${px}% ${py}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 30%, transparent 80%)`;
  });

  glareOpacity = computed(() => {
    return this.active() ? 1 : 0;
  });

  rotateCard(e: MouseEvent) {
    this.active.set(true);
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();

    // 좌표 정규화 (0 ~ 100)
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    this.x.set(x);
    this.y.set(y);
  }

  resetCard() {
    this.active.set(false);
    // 천천히 중앙으로 복귀 (Transition CSS가 처리)
    this.x.set(50);
    this.y.set(50);
  }
}
