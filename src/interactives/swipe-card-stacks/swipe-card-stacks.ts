import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';

type Stack = {
  id: number;
  name: string;
  age: number;
  img: string;
  color: string;
};

@Component({
  selector: 'app-swipe-card-stacks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './swipe-card-stacks.html',
  styleUrls: ['./swipe-card-stacks.css'],
})
export class SwipeCardStacks {
  _stacks = input<Stack[]>(
    [
      {
        id: 1,
        name: 'Sarah',
        age: 24,
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600',
        color: 'red',
      },
      {
        id: 2,
        name: 'David',
        age: 29,
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600',
        color: 'blue',
      },
      {
        id: 3,
        name: 'Emma',
        age: 22,
        img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600',
        color: 'green',
      },
      {
        id: 4,
        name: 'James',
        age: 31,
        img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600',
        color: 'purple',
      },
    ],
    {
      alias: 'stacks',
    }
  );
  stacks = signal<Stack[]>(this._stacks());

  // Drag State
  isDragging = signal(false);
  startX = 0;
  currentX = signal(0);
  rotation = signal(0);

  visibleStacks = computed(() => this.stacks());

  // Top Card: Drag Movement
  // Back Cards: Scale down effect
  getCardTransform(index: number) {
    if (index === 0) {
      // 맨 앞 카드: 드래그 값 적용
      return `translate(${this.currentX()}px, 0px) rotate(${this.rotation()}deg)`;
    } else {
      // 뒤쪽 카드: 스택 효과 (작아지고 아래로 내려감)
      const scale = 1 - index * 0.05;
      const translateY = index * 10;
      return `scale(${scale}) translateY(${translateY}px)`;
    }
  }

  // Opacity for Stamps
  likeOpacity = computed(() => Math.max(0, this.currentX() / 100)); // 오른쪽 이동 시
  nopeOpacity = computed(() => Math.max(0, -this.currentX() / 100)); // 왼쪽 이동 시

  startDrag(e: MouseEvent | TouchEvent) {
    this.isDragging.set(true);
    this.startX = 'touches' in e ? e.touches[0].clientX : e.clientX;

    this.addEvents();
  }

  onMove = (e: MouseEvent | TouchEvent) => {
    if (!this.isDragging()) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - this.startX;

    this.currentX.set(deltaX);
    this.rotation.set(deltaX * 0.05); // 약간의 회전 추가
  };

  onEnd = () => {
    if (!this.isDragging()) return;
    this.isDragging.set(false);
    this.removeEvents();

    const threshold = 150; // 이만큼 넘기면 날아감

    if (this.currentX() > threshold) {
      this.swipe('right');
    } else if (this.currentX() < -threshold) {
      this.swipe('left');
    } else {
      // 복귀
      this.currentX.set(0);
      this.rotation.set(0);
    }
  };

  swipe(direction: 'left' | 'right') {
    // 날아가는 애니메이션
    const flyX = direction === 'right' ? 1000 : -1000;
    this.currentX.set(flyX);
    this.rotation.set(direction === 'right' ? 20 : -20);

    setTimeout(() => {
      // 배열에서 제거 (다음 카드가 앞으로 옴)
      this.stacks.update(p => p.slice(1));
      // 상태 초기화
      this.currentX.set(0);
      this.rotation.set(0);
    }, 200);
  }

  addEvents() {
    window.addEventListener('mousemove', this.onMove);
    window.addEventListener('mouseup', this.onEnd);
    window.addEventListener('touchmove', this.onMove);
    window.addEventListener('touchend', this.onEnd);
  }

  removeEvents() {
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('mouseup', this.onEnd);
    window.removeEventListener('touchmove', this.onMove);
    window.removeEventListener('touchend', this.onEnd);
  }
}
