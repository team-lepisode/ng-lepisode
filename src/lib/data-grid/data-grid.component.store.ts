import { computed, Injectable, signal, untracked } from '@angular/core';
import {
  ColumnFiltersState,
  createAngularTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Table,
} from '@tanstack/angular-table';
import { DataGridColumnDef, DataGridOptions } from './data-grid.type';
import { parseColumn } from './parse-column';

@Injectable()
export class DataGridComponentStore {
  // State
  view = signal<'table' | 'gallery' | 'calendar'>('table');
  pageIndex = signal<number>(0);
  pageSize = signal<number>(10);
  query = signal<string>('');
  sorting = signal<SortingState>([]);
  columnFilters = signal<ColumnFiltersState>([]);
  columnSizingState = signal<Record<string, number>>({});
  lastAddedFilterId = signal<string | null>(null);

  // Data and Columns (synced from component)
  rowData = signal<any[]>([]);
  columns = signal<DataGridColumnDef[]>([]);

  // Options (synced from component)
  options = signal<DataGridOptions>({});

  // Cell edit callback
  onCellEdit: ((editedRow: any) => void) | null = null;
  onDetailClick: ((row: any) => void) | null = null;

  // Table instance
  table: Table<any> = createAngularTable(() => ({
    data: this.rowData() ?? [],
    columns: this.columns()?.map((col) =>
      parseColumn(col, (editedRow: any) => {
        this.onCellEdit?.(editedRow);
      }),
    ),
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: false,
    state: {
      pagination: {
        pageIndex: this.pageIndex(),
        pageSize: this.pageSize(),
      },
      globalFilter: this.query(),
      sorting: this.sorting(),
      columnFilters: this.columnFilters(),
      columnSizing: this.columnSizingState(),
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === 'function' ? updater(this.sorting()) : updater;
      this.sorting.set(newSorting);
    },
    onColumnFiltersChange: (updater) => {
      const currentFilters = this.columnFilters();
      const newFilters =
        typeof updater === 'function' ? updater(currentFilters) : updater;

      // TanStack Table tends to remove filters with empty values.
      // We want to keep them if they were already present.
      const mergedFilters = [...newFilters];
      currentFilters.forEach((current) => {
        if (!mergedFilters.find((f) => f.id === current.id)) {
          mergedFilters.push({ ...current, value: '' });
        }
      });

      this.columnFilters.set(mergedFilters);
    },
    onColumnSizingChange: (updater) => {
      const newSizing =
        typeof updater === 'function'
          ? updater(this.columnSizingState())
          : updater;
      this.columnSizingState.set(newSizing);
    },
  }));

  // Computed properties for gallery view
  imageField = computed(() => this.options().imageField ?? null);
  titleField = computed(() => this.options().titleField ?? null);
  descriptionField = computed(() => this.options().descriptionField ?? null);
  startDateField = computed(() => this.options().startDateField ?? null);
  endDateField = computed(() => this.options().endDateField ?? null);
  badgeField = computed(() => this.options().badgeField ?? null);
  galleryDisabled = computed(
    () => this.titleField() === null || this.descriptionField() === null,
  );
  calendarDisabled = computed(
    () =>
      this.startDateField() === null ||
      this.endDateField() === null ||
      this.titleField() === null,
  );

  filterableColumns = computed(() =>
    this.table.getAllColumns().filter((col) => col.getCanFilter()),
  );

  // Computed properties for column sizing
  readonly columnSizingInfo = computed(
    () => this.table?.getState().columnSizingInfo,
  );
  readonly columnSizing = computed(() => this.table?.getState().columnSizing);

  readonly columnSizeVars = computed(() => {
    if (!this.table) return {};

    void this.columnSizing();
    void this.columnSizingInfo();

    const headers = untracked(() => this.table?.getFlatHeaders() ?? []);
    const colSizes: { [key: string]: number } = {};
    let i = headers.length;
    while (--i >= 0) {
      const header = headers[i];
      if (!header) continue;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  });

  addFilter(id: string, value: any = '') {
    this.columnFilters.update((filters) => {
      const existingFilter = filters.find((f) => f.id === id);
      if (existingFilter) {
        return filters;
      }
      return [...filters, { id, value }];
    });
    this.lastAddedFilterId.set(id);
  }

  setFilterValue(id: string, value: any) {
    this.columnFilters.update((filters) => {
      const existingFilter = filters.find((f) => f.id === id);
      if (existingFilter) {
        return filters.map((f) => (f.id === id ? { ...f, value } : f));
      }
      return [...filters, { id, value }];
    });
  }

  removeFilter(id: string) {
    this.columnFilters.update((filters) => {
      return filters.filter((f) => f.id !== id);
    });
  }
}
