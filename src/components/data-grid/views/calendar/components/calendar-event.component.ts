import { Component, computed, input } from '@angular/core';
import { EventApi } from '@fullcalendar/core';

@Component({
  selector: 'app-calendar-event',
  template: `
    <div
      class="w-full min-h-8 flex items-center gap-2 px-3 py-1.5 rounded-box shadow hover:shadow-lg hover:bg-base-200/50 border border-[var(--event-color)]/30 border-l-[3px] border-l-[var(--event-color)] bg-base-100 text-base-content text-sm transition-all duration-150"
      [style.--event-color]="eventColor()"
      [title]="event()?.title ?? ''"
    >
      <div
        class="w-1.5 h-1.5 rounded-full bg-[var(--event-color)] shrink-0"
      ></div>
      <span class="truncate flex-1 font-normal tracking-tight">
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

  timeText = computed(() => {
    const e = this.event();
    if (!e?.start) return '';
    return e.start.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  });
}
