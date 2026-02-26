import { DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { DataGridComponentStore } from '../../data-grid.component.store';

@Component({
  selector: 'app-kanban-card',
  template: `
    <button
      type="button"
      class="kanban-card w-full text-left p-3 bg-base-100 rounded-box border border-base-content/10 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer mb-2"
      (click)="cardClick.emit(row())"
    >
      @if (store.titleField()) {
        @let title = row()[store.titleField()!];
        <div class="font-medium text-sm mb-2 line-clamp-2">
          {{ title }}
        </div>
      }

      @if (store.badgeField()) {
        @let badge = row()[store.badgeField()!];
        @if (badge) {
          <div class="mb-2">
            <span class="badge badge-soft badge-sm">
              {{ badge }}
            </span>
          </div>
        }
      }

      @if (store.startDateField()) {
        @let startDate = row()[store.startDateField()!];
        @if (startDate) {
          <div class="text-xs text-base-content/60">
            {{ startDate | date: 'yy.MM.dd' }}
          </div>
        }
      }

      <!-- @if (store.colorField()) {
        @let color = row()[store.colorField()!];
        @if (color) {
          <div
            class="absolute left-0 top-0 bottom-0 w-1 rounded-l-box"
            [style.backgroundColor]="color"
          ></div>
        }
      } -->
    </button>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .kanban-card {
        position: relative;
      }
    `,
  ],
  imports: [DatePipe],
})
export class KanbanCardComponent {
  protected readonly store = inject(DataGridComponentStore);

  row = input.required<any>();
  cardClick = output<any>();
}
