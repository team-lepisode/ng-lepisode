/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FlexRender, Header } from '@tanstack/angular-table';
import { HeaderMenuComponent } from '../../components/header-menu/header-menu.component';
import { DataGridComponentStore } from '../../data-grid.component.store';
import { DataGridColumnTypes } from '../../data-grid.type';
import { TableResizableCell } from '../../directives/data-grid-resizable-cell.directive';
import { TableResizableHeader } from '../../directives/data-grid-resizable-header.directive';
import { SanitizeHtmlPipe } from '../../pipes/sanitize-html.pipe';

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
}
