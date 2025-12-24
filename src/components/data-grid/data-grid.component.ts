/* eslint-disable @angular-eslint/no-output-on-prefix */
import { NgComponentOutlet } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Header } from '@tanstack/angular-table';
import { RepeatPipe } from 'ngxtension/repeat-pipe';
import { DataGridFilterItemComponent } from './components/filter-item/filter-item.component';
import { DataGridComponentStore } from './data-grid.component.store';
import { DataGridPersistenceStore } from './data-grid.persistence.store';
import {
  DataGridColumnDef,
  DataGridColumnTypes,
  DataGridOptions,
} from './data-grid.type';
import { CalendarViewComponent } from './views/calendar/calendar-view.component';
import { GalleryViewComponent } from './views/gallery/gallery-view.component';
import { TableViewComponent } from './views/table/table-view.component';

@Component({
  selector: 'lepi-data-grid',
  imports: [
    TranslatePipe,
    RepeatPipe,
    FormsModule,
    NgComponentOutlet,
    DataGridFilterItemComponent,
  ],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.css',
  providers: [DataGridComponentStore, DataGridPersistenceStore],
})
export class DataGridComponent {
  protected store = inject(DataGridComponentStore);
  protected persistenceStore = inject(DataGridPersistenceStore);

  onCellEdit = output<any>();
  onDetailClick = output<any>();

  view = input<'table' | 'gallery' | 'calendar'>('table');
  rowData = input<any[] | undefined>([]);
  columns = input.required<DataGridColumnDef[]>();
  options = input<DataGridOptions>({});

  dataGridContainer = viewChild<ElementRef<HTMLElement>>('dataGridContainer');

  uuid = crypto.randomUUID();

  viewComponent = computed<any>(() => {
    switch (this.store.view()) {
      case 'calendar':
        return CalendarViewComponent;
      case 'gallery':
        return GalleryViewComponent;
      case 'table':
        return TableViewComponent;
    }
  });

  constructor() {
    // Sync inputs to store
    effect(() => {
      this.store.options.set(this.options());
    });

    effect(() => {
      this.store.rowData.set(this.rowData() ?? []);
    });

    effect(() => {
      this.store.columns.set(this.columns() ?? []);
    });

    effect(() => {
      this.store.view.set(this.view());
    });

    // Load persisted state on init
    afterNextRender(() => {
      this.persistenceStore.loadPersistedState();
    });

    // Set cell edit callback
    this.store.onCellEdit = (editedRow: any) => {
      this.onCellEdit.emit(editedRow);
    };

    this.store.onDetailClick = (row: any) => {
      console.log(row);
      this.onDetailClick.emit(row);
    };
  }

  setView(view: 'table' | 'gallery' | 'calendar') {
    this.store.view.set(view);
  }

  goNextPage() {
    const max = this.store.table.getPageCount();
    this.store.pageIndex.update((idx) => (idx + 1 < max ? idx + 1 : idx));
  }

  goPreviousPage() {
    this.store.pageIndex.update((idx) => (idx - 1 >= 0 ? idx - 1 : idx));
  }

  goFirstPage() {
    this.store.pageIndex.set(0);
  }

  goLastPage() {
    this.store.pageIndex.set(this.store.table.getPageCount() - 1);
  }

  getHeaderIcon(header: Header<unknown, unknown>) {
    const meta = header.column.columnDef.meta;
    if (meta && meta.icon) {
      return meta.icon;
    }

    const icons: Record<DataGridColumnTypes, string> = {
      text: 'icon-[tabler--letters-case]',
      number: 'icon-[tabler--hash]',
      rowNumber: 'icon-[tabler--hash]',
      date: 'icon-[tabler--calendar]',
      boolean: 'icon-[tabler--toggle-left]',
      array: 'icon-[tabler--list]',
      list: 'icon-[tabler--list-check]',
    };

    return (
      icons[(meta?.type as DataGridColumnTypes) ?? 'text'] ?? icons['text']
    );
  }

  /**
   * Clear persisted state and reset to defaults
   * Public API for consumers
   */
  public async resetState(): Promise<void> {
    await this.persistenceStore.resetState();
  }
}
