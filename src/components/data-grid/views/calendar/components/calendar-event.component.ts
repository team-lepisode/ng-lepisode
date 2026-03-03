import { Component, computed, input } from '@angular/core';
import { EventApi } from '@fullcalendar/core';

@Component({
  selector: 'app-calendar-event',
  template: `
    <div
      class="w-full min-h-8 flex items-center shadow gap-2 px-3 py-1.5 rounded-box hover:bg-base-200/10 border border-[var(--event-color)]/30 border-l-[3px] border-l-[var(--event-color)] bg-base-100 text-base-content text-sm transition-all"
      [style.--event-color]="eventColor()"
      [title]="event()?.title ?? ''"
    >
      <div
        class="rounded-full bg-[var(--event-color)] shrink-0"
        [class]="priorityDotClass()"
      ></div>
      <span
        class="truncate flex-1 font-normal tracking-tight"
        [class.line-through]="isCompleted()"
        [class.text-base-content/40]="isCompleted()"
      >
        {{ event()?.title }}
      </span>
      @if (showTime() && event()?.start) {
        <span class="text-xs text-base-content/50 shrink-0">
          {{ timeText() }}
        </span>
      }
      @if (badge()) {
        <span
          class="text-xs px-1.5 py-0.5 rounded-sm shrink-0"
          [class]="badgeClass()"
        >
          {{ badge() }}
        </span>
      }
    </div>
  `,
})
export class CalendarEventComponent {
  event = input<EventApi | null>(null);
  eventColor = input('var(--color-primary)');
  showTime = input(false);
  badge = input<string | null>(null);
  badgeClass = input('');

  private get extendedProps() {
    return this.event()?.extendedProps ?? {};
  }

  /** 완료 여부 */
  isCompleted = computed(() => this.extendedProps['status'] === 'COMPLETED');

  /** 우선순위에 따른 dot 크기 */
  priorityDotClass = computed(() => {
    const priority = this.extendedProps['priority'];
    if (priority === 'VERY_HIGH' || priority === 'HIGH') return 'w-2 h-2';
    return 'w-1.5 h-1.5';
  });

  timeText = computed(() => {
    const e = this.event();
    if (!e?.start) return '';
    return e.start.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  });
}
