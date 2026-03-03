import { Component, computed, input } from '@angular/core';
import { EventApi } from '@fullcalendar/core';

@Component({
  selector: 'app-calendar-list-event',
  template: `
    <div
      class="inline-flex items-center gap-2 px-3 py-2 rounded-box border border-base-content/5 bg-base-100 cursor-pointer max-w-lg"
      [style.border-left-color]="eventColor()"
      [style.border-left-width]="'3px'"
    >
      <!-- 우선순위 dot: VERY_HIGH/HIGH → 더 큰 원 -->
      <div
        class="rounded-full shrink-0"
        [class]="priorityDotClass()"
        [style.background]="eventColor()"
      ></div>

      <!-- 제목 -->
      <span
        class="text-sm font-medium text-base-content truncate min-w-0 max-w-52"
      >
        {{ event()?.title }}
      </span>

      <!-- 상태 배지 -->
      @if (statusLabel()) {
        <span
          class="text-xs px-1.5 py-0.5 rounded-sm shrink-0 leading-none"
          [class]="statusClass()"
        >
          {{ statusLabel() }}
        </span>
      }

      <!-- 날짜: 여러 날에 걸친 경우만 표시 -->
      @if (isMultiDay()) {
        <span class="text-xs text-base-content/40 shrink-0 whitespace-nowrap">
          {{ dateText() }}
        </span>
      }

      @if (badge()) {
        <span
          class="text-xs px-2 py-0.5 rounded-sm shrink-0"
          [class]="badgeClass()"
        >
          {{ badge() }}
        </span>
      }
    </div>
  `,
})
export class CalendarListEventComponent {
  event = input<EventApi | null>(null);
  eventColor = input('var(--color-primary)');
  badge = input<string | null>(null);
  badgeClass = input('');

  private get extendedProps() {
    return this.event()?.extendedProps ?? {};
  }

  /** 우선순위에 따른 dot 크기 */
  priorityDotClass = computed(() => {
    const priority = this.extendedProps['priority'];
    if (priority === 'VERY_HIGH' || priority === 'HIGH') return 'w-2.5 h-2.5';
    if (priority === 'MEDIUM') return 'w-2 h-2';
    return 'w-1.5 h-1.5';
  });

  /** 상태 라벨 */
  statusLabel = computed(() => {
    const status = this.extendedProps['status'];
    if (status === 'COMPLETED') return '완료';
    if (status === 'IN_PROGRESS') return '진행중';
    return null;
  });

  /** 상태 배지 클래스 */
  statusClass = computed(() => {
    const status = this.extendedProps['status'];
    if (status === 'COMPLETED') return 'bg-success/10 text-success';
    if (status === 'IN_PROGRESS') return 'bg-info/10 text-info';
    return '';
  });

  /** 여러 날에 걸친 이벤트 여부 */
  isMultiDay = computed(() => {
    const e = this.event();
    if (!e?.start || !e.end) return false;
    return e.start.toDateString() !== e.end.toDateString();
  });

  dateText = computed(() => {
    const e = this.event();
    if (!e?.start) return '';
    const start = e.start;
    const end = e.end;
    if (end && start.toDateString() !== end.toDateString()) {
      return `${start.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}`;
    }
    return start.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  });
}
