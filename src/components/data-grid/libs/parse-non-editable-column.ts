import { ColumnDef } from '@tanstack/angular-table';
import {
  DataGridColumnDef,
  DataGridRowNumberColumnDef,
} from '../data-grid.type';
import dayjs from 'dayjs';

export const parseNonEditableColumn = (
  column: Exclude<DataGridColumnDef, DataGridRowNumberColumnDef>,
): ColumnDef<any, unknown> => {
  const columnDef: ColumnDef<any, unknown> = {
    header:
      column.header ??
      (typeof column.field === 'function' ? column.field() : column.field),
    accessorKey:
      typeof column.field === 'function' ? column.field() : column.field,
    meta: {
      icon: column.headerIconClass,
      type: column.type ?? 'text',
      detail: column.detail ?? false,
    },
    size: column.size ?? 200,
    minSize: column.minSize ?? 100,
    maxSize: column.maxSize ?? 500,
  };

  if (column.type === 'date' || column.type === 'datetime') {
    columnDef.cell = (cell) => {
      const value = cell.getValue();
      if (!value) {
        return '';
      }

      return dayjs(value as string).format(
        column.dateFormat ?? 'YYYY-MM-DD HH:mm',
      );
    };
  }

  if (column.type === 'array') {
    columnDef.meta!.items = column.items;

    columnDef.cell = (cell) => {
      const value = cell.getValue() as string[]; // value1, value2

      const firstThree = value.slice(0, 3);
      if (value.length <= 3) {
        const badges = firstThree.map(
          (v) => `<span class="badge badge-soft" data-value="${v}">${v}</span>`,
        );

        return badges.join(' ');
      }

      const valueToShow = firstThree;
      valueToShow.push(`+${value.length - 3}`);
      const badges = valueToShow.map(
        (v) => `<span class="badge badge-soft" data-value="${v}">${v}</span>`,
      );

      return badges.join(' ');
    };
  }

  if (column.type === 'list') {
    columnDef.meta!.items = column.items;
    columnDef.cell = (cell) => {
      const value = cell.getValue() as string;

      return `<span class="badge badge-soft" data-value="${value}">${value}</span>`;
    };
  }

  return columnDef;
};
