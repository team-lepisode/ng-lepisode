import { Component, computed, input } from '@angular/core';
import { EventApi } from '@fullcalendar/core';

@Component({
  selector: 'app-calendar-list-event',
  template: `
    <div
      class="flex items-center gap-3 px-3 py-2 rounded-box border border-base-content/5 bg-base-100 hover:bg-base-200/50 transition-all duration-200 cursor-pointer"
      [style.border-left-color]="eventColor()"
      [style.border-left-width]="'3px'"
    >
      <div
        class="w-2 h-2 rounded-full shrink-0"
        [style.background]="eventColor()"
      ></div>

      <div class="flex-1 min-w-0">
        <span class="text-sm font-medium text-base-content truncate block">
          {{ event()?.title }}
        </span>
        @if (showDate() && event()?.start) {
          <span class="text-xs text-base-content/50">
            {{ dateText() }}
          </span>
        }
      </div>

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
  showDate = input(false);

  dateText = computed(() => {
    const e = this.event();
    if (!e?.start) return '';

    const start = e.start;
    const end = e.end;

    if (end && start.toDateString() !== end.toDateString()) {
      return `${start.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}`;
    }
    return start.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  });
}
