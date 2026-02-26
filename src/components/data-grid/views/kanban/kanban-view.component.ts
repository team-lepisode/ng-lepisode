import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DataGridComponentStore } from '../../data-grid.component.store';
import { KanbanColumn } from '../../data-grid.type';
import { KanbanCardComponent } from './kanban-card.component';

@Component({
  templateUrl: './kanban-view.component.html',
  imports: [DragDropModule, TranslatePipe, KanbanCardComponent],
})
export class KanbanViewComponent {
  protected readonly store = inject(DataGridComponentStore);

  columns = computed<(KanbanColumn & { cards: any[] })[]>(() => {
    const { kanbanGroupField, kanbanColumns } = this.store.options();
    if (!kanbanGroupField || !kanbanColumns) return [];

    const rowData = this.store.rowData();
    return kanbanColumns.map((col) => ({
      ...col,
      cards: rowData.filter((row) => row[kanbanGroupField] === col.value),
    }));
  });

  columnIds = computed(() => this.columns().map((col) => col.value));

  onCardDrop(event: CdkDragDrop<any[]>, targetColValue: string) {
    const { kanbanGroupField } = this.store.options();
    if (!kanbanGroupField) return;

    const card = event.previousContainer.data[event.previousIndex];

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.store.onCellEdit?.({ ...card, [kanbanGroupField]: targetColValue });
    }
  }

  onCardClick(card: any) {
    this.store.onDetailClick?.(card);
  }

  getColumnColor(color?: string): string {
    return color ?? '#6B7280';
  }
}
