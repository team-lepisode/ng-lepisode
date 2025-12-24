import {
  Component,
  computed,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
  Calendar,
  CalendarOptions,
  EventInput,
  EventSourceInput,
} from '@fullcalendar/core';
import koLocale from '@fullcalendar/core/locales/ko';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { injectResize } from 'ngxtension/resize';
import { DataGridComponentStore } from '../../data-grid.component.store';

@Component({
  templateUrl: './calendar-view.component.html',
  imports: [FullCalendarModule],
})
export class CalendarViewComponent {
  private readonly store = inject(DataGridComponentStore);

  calendarContainerRef =
    viewChild.required<ElementRef<HTMLElement>>('calenderContainer');

  resize$ = injectResize();

  calendar: Calendar | null = null;

  events = computed<EventInput[]>(() => {
    const startDateField = this.store.options().startDateField;
    const endDateField = this.store.options().endDateField;
    const titleField = this.store.options().titleField;
    if (!startDateField || !endDateField || !titleField) return [];

    const events = this.store.rowData().map((row) => {
      return {
        id: row.id,
        allDay: true,
        title: row[titleField],
        start: row[startDateField],
        end: row[endDateField],
        extendedProps: row,
      };
    });
    return events;
  });

  calendarOptions: CalendarOptions = {
    locale: koLocale,
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    height: '100%',
    editable: true,
    eventDurationEditable: true,
    eventResizableFromStart: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listWeek',
    },
    eventClick: (info) => {
      const data = this.store.rowData().find((row) => row.id === info.event.id);
      if (data) {
        this.store.onDetailClick?.(data);
      }
    },
    eventDrop: (info) => {
      console.log(info.event);
      const data = this.store.rowData().find((row) => row.id === info.event.id);
      if (data) {
        const startDateField = this.store.options().startDateField;
        const endDateField = this.store.options().endDateField;
        if (!startDateField || !endDateField) return;
        const newData = {
          ...data,
          [startDateField]: info.event.start,
          [endDateField]: info.event.end,
        };
        this.store.onCellEdit?.(newData);
      }
    },
    eventResize: (info) => {
      const data = this.store.rowData().find((row) => row.id === info.event.id);
      if (data) {
        const startDateField = this.store.options().startDateField;
        const endDateField = this.store.options().endDateField;
        if (!startDateField || !endDateField) return;
        const newData = {
          ...data,
          [startDateField]: info.event.start,
          [endDateField]: info.event.end,
        };
        this.store.onCellEdit?.(newData);
      }
    },
  };
}
