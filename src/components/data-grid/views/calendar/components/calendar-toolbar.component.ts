import { Component, input, output } from '@angular/core';

export type CalendarViewType =
  | 'dayGridMonth'
  | 'listWeek'
  | 'timeGridWeek'
  | 'timeGridDay';

export interface CalendarToolbarAction {
  type: 'prev' | 'next' | 'today' | 'viewChange';
  view?: CalendarViewType;
}

@Component({
  selector: 'app-calendar-toolbar',
  template: `
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="btn btn-gray"
          title="이전"
          (click)="onAction({ type: 'prev' })"
        >
          <span class="icon-[tabler--chevron-left] size-4"></span>
        </button>
        <button
          type="button"
          class="btn btn-gray"
          title="다음"
          (click)="onAction({ type: 'next' })"
        >
          <span class="icon-[tabler--chevron-right] size-4"></span>
        </button>
        <button
          type="button"
          class="btn btn-gray"
          title="오늘"
          (click)="onAction({ type: 'today' })"
        >
          오늘
        </button>
      </div>

      <p class="text-2xl font-semibold tracking-tight text-base-content">
        {{ title() }}
      </p>

      <div
        class="flex items-center gap-1 px-1.5 py-1 rounded-box bg-base-100 base border border-base-200/50"
      >
        @for (view of availableViews(); track view.value) {
          <button
            type="button"
            class="outline-none border px-4 py-1.5 rounded-box text-sm transition-all duration-200 font-semibold"
            [class.bg-base-200]="currentView() === view.value"
            [class.text-base-content]="currentView() === view.value"
            [class.border-base-content/10]="currentView() === view.value"
            [class.border-transparent]="currentView() !== view.value"
            [class.hover:text-base-content]="currentView() !== view.value"
            [class.text-base-content/60]="currentView() !== view.value"
            [class.hover:bg-base-200/50]="currentView() !== view.value"
            [title]="view.label"
            (click)="onAction({ type: 'viewChange', view: view.value })"
          >
            {{ view.label }}
          </button>
        }
      </div>
    </div>
  `,
})
export class CalendarToolbarComponent {
  title = input('2024년 1월');
  currentView = input<CalendarViewType>('dayGridMonth');
  availableViews = input<{ value: CalendarViewType; label: string }[]>([
    { value: 'dayGridMonth', label: '월' },
    { value: 'listWeek', label: '주' },
  ]);

  action = output<CalendarToolbarAction>();

  onAction(action: CalendarToolbarAction): void {
    this.action.emit(action);
  }
}
