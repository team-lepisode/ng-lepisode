import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgLabelTemplateDirective,
  NgOptionTemplateDirective,
  NgSelectComponent,
} from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { ColumnFilter } from '@tanstack/angular-table';
import { DataGridComponentStore } from '../../data-grid.component.store';
import { DataGridColumnTypes } from '../../data-grid.type';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'lepi-data-grid-filter-item',
  templateUrl: './filter-item.component.html',
  styleUrl: './filter-item.component.css',
  imports: [
    TranslatePipe,
    FormsModule,
    NgSelectComponent,
    NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    JsonPipe,
  ],
})
export class DataGridFilterItemComponent {
  private readonly store = inject(DataGridComponentStore);

  mainPopoverRef = viewChild<ElementRef<HTMLElement>>('mainPopover');
  filterInputRef = viewChild<ElementRef<HTMLInputElement>>('filterInput');

  constructor() {
    afterNextRender(() => {
      if (this.store.lastAddedFilterId() === this.id()) {
        this.mainPopoverRef()?.nativeElement.showPopover();
        this.filterInputRef()?.nativeElement.focus();
        this.store.lastAddedFilterId.set(null);
      }
    });
  }

  filter = input.required<ColumnFilter>();

  id = computed(() => this.filter().id);
  header = computed(() =>
    this.store.table.getFlatHeaders().find((header) => header.id === this.id()),
  );

  headerLabel = computed(() => this.header()?.getContext());

  column = computed(() => this.store.table.getColumn(this.id()));
  filterFn = computed(() => this.column()?.columnDef.filterFn);

  value = linkedSignal<string[]>(() => {
    const val = this.filter().value;
    return Array.isArray(val) ? val : val ? [val] : [];
  });

  filterFunctionMap: Record<DataGridColumnTypes, string[]> = {
    rowNumber: [],
    text: ['includesString', 'equalsString'],
    number: ['equals', 'inNumberRange'],
    date: ['equals', 'inDateRange'],
    list: ['arrIncludes', 'arrIncludesAll', 'arrIncludesSome'],
    array: ['arrIncludes', 'arrIncludesAll', 'arrIncludesSome'],
    boolean: ['equals'],
  };

  filterFunctions = computed(() => {
    const type = this.column()?.columnDef.meta?.type;
    if (!type) return [];
    return this.filterFunctionMap[type];
  });

  filterFunction = linkedSignal(() => this.column()?.columnDef.filterFn);

  columnType = computed(() => {
    const type = this.column()?.columnDef.meta?.type;
    if (!type) return 'text';
    return type;
  });

  inputType = computed<'input' | 'select'>(() => {
    const columnType = this.columnType();
    const selectColumnTypes = ['array', 'list'];
    if (selectColumnTypes.includes(columnType)) return 'select';
    return 'input';
  });

  selectOptions = computed<string[]>(() => {
    const items = this.column()?.columnDef.meta?.items;
    if (!items) return [];
    return items;
  });

  setValue(value: string) {
    this.store.setFilterValue(this.id(), value);
  }

  setFilterFunction(
    fn: (row: any, columnId: string, filterValue: any) => boolean,
  ) {
    const col = this.column();
    if (col) {
      this.store.table.setColumnFilters((old) => [...old]);
      col.columnDef.filterFn = fn as any;
    }
  }

  removeFilter() {
    this.store.removeFilter(this.id());
    this.mainPopoverRef()?.nativeElement.hidePopover();
  }

  onPopoverToggle(event: ToggleEvent) {
    if (event.newState === 'closed' && this.value().length === 0) {
      this.removeFilter();
    }
  }
}
