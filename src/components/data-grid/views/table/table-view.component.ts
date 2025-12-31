/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FlexRender, Header } from '@tanstack/angular-table';
import { SanitizeHtmlPipe } from '../../../../pipes/sanitize-html/sanitize-html.pipe';
import { HeaderMenuComponent } from '../../components/header-menu/header-menu.component';
import { DataGridComponentStore } from '../../data-grid.component.store';
import { DataGridColumnTypes } from '../../data-grid.type';
import { TableResizableCell } from '../../directives/data-grid-resizable-cell.directive';
import { TableResizableHeader } from '../../directives/data-grid-resizable-header.directive';
import { DataGridIcons } from '../../libs/icons';

@Component({
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.css',
  imports: [
    TranslatePipe,
    TableResizableCell,
    TableResizableHeader,
    HeaderMenuComponent,
    SanitizeHtmlPipe,
    FlexRender,
  ],
})
export class TableViewComponent {
  protected readonly store = inject(DataGridComponentStore);

  tableHeader = viewChild<ElementRef<HTMLElement>>('tableHeader');

  getHeaderIcon(header: Header<unknown, unknown>) {
    const meta = header.column.columnDef.meta;
    if (meta && meta.icon) {
      return meta.icon;
    }

    return (
      DataGridIcons[(meta?.type as DataGridColumnTypes) ?? 'text'] ??
      DataGridIcons['text']
    );
  }

  onDetailClick(row: any) {
    this.store.onDetailClick?.(row);
  }

  onRowClick(row: any) {
    this.store.onRowClick?.(row);
  }
}
