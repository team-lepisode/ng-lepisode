import {
  Component,
  ViewEncapsulation,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
  CalendarApi,
  CalendarOptions,
  DatesSetArg,
  EventApi,
  EventInput,
} from '@fullcalendar/core';
import koLocale from '@fullcalendar/core/locales/ko';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { injectResize } from 'ngxtension/resize';
import { DataGridComponentStore } from '../../data-grid.component.store';
import {
  CalendarToolbarAction,
  CalendarViewType,
} from './components/calendar-toolbar.component';
import { CalendarToolbarComponent } from './components/calendar-toolbar.component';
import { CalendarEventComponent } from './components/calendar-event.component';
import { CalendarListEventComponent } from './components/calendar-list-event.component';
import { CalendarColorStrategyService } from './services/calendar-color-strategy.service';

@Component({
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css'],
  imports: [
    FullCalendarModule,
    CalendarEventComponent,
    CalendarListEventComponent,
    CalendarToolbarComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [CalendarColorStrategyService],
})
export class CalendarViewComponent {
  private readonly store = inject(DataGridComponentStore);
  private readonly colorStrategy = inject(CalendarColorStrategyService);

  calendarContainerRef =
    viewChild.required<ElementRef<HTMLElement>>('calenderContainer');

  resize$ = injectResize();

  currentView = signal<CalendarViewType>('dayGridMonth');
  currentTitle = signal('');

  readonly availableViews = [
    { value: 'dayGridMonth' as CalendarViewType, label: '월' },
    { value: 'listWeek' as CalendarViewType, label: '주' },
  ];

  private calendarApi: CalendarApi | null = null;

  events = computed<EventInput[]>(() => {
    const { startDateField, endDateField, titleField } = this.store.options();
    if (!startDateField || !endDateField || !titleField) return [];

    return this.store.rowData().map((row) => ({
      id: row.id,
      allDay: true,
      title: row[titleField],
      start: row[startDateField],
      end: row[endDateField],
      extendedProps: row,
    }));
  });

  calendarOptions: CalendarOptions = {
    locale: koLocale,
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    height: '100%',
    editable: true,
    eventDurationEditable: true,
    eventResizableFromStart: true,
    eventDisplay: 'block',
    dayMaxEvents: true,
    headerToolbar: false,
    datesSet: (args: DatesSetArg) => this.handleDatesSet(args),
    dayHeaderFormat: { weekday: 'short' },
    eventClick: (info) => this.handleEventClick(info),
    eventDrop: (info) => this.handleEventDrop(info),
    eventResize: (info) => this.handleEventResize(info),
  };

  private handleDatesSet(args: DatesSetArg): void {
    this.calendarApi = args.view.calendar;
    this.currentTitle.set(args.view.title);
    this.currentView.set(args.view.type as CalendarViewType);
  }

  getEventColor(event: EventApi): string {
    const { colorField, colorMap } = this.store.options();
    return this.colorStrategy.getColor(event, { colorField, colorMap });
  }

  onToolbarAction(action: CalendarToolbarAction): void {
    if (!this.calendarApi) return;

    switch (action.type) {
      case 'prev':
        this.calendarApi.prev();
        break;
      case 'next':
        this.calendarApi.next();
        break;
      case 'today':
        this.calendarApi.today();
        break;
      case 'viewChange':
        if (action.view) {
          this.calendarApi.changeView(action.view);
        }
        break;
    }
  }

  private handleEventClick(info: { event: EventApi }): void {
    const data = this.store.rowData().find((row) => row.id === info.event.id);
    if (data) {
      this.store.onDetailClick?.(data);
    }
  }

  private handleEventDrop(info: { event: EventApi }): void {
    this.updateEventDates(info.event);
  }

  private handleEventResize(info: { event: EventApi }): void {
    this.updateEventDates(info.event);
  }

  private updateEventDates(event: EventApi): void {
    const data = this.store.rowData().find((row) => row.id === event.id);
    if (!data) return;

    const { startDateField, endDateField } = this.store.options();
    if (!startDateField || !endDateField) return;

    this.store.onCellEdit?.({
      ...data,
      [startDateField]: event.start,
      [endDateField]: event.end,
    });
  }
}
