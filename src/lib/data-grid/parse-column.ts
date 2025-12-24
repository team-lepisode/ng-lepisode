import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { DataGridColumnDef } from './data-grid.type';
import { TextEditableCellComponent } from './components/text-editable-cell/text-editable-cell.component';
import dayjs from 'dayjs';
import { ListEditableCellComponent } from './components/list-editable-cell/list-editable-cell.component';
import { ArrayEditableCellComponent } from './components/array-editable-cell/array-editable-cell.component';
import { DateEditableCellComponent } from './components/date-editable-cell/date-editable-cell.component';

export const parseColumn = (
  column: DataGridColumnDef,
  onCellEdit: (editedRow: any) => void,
): ColumnDef<any, unknown> => {
  if (column.type === 'rowNumber') {
    return {
      header: column.header ?? 'row_number',
      enableColumnFilter: false,
      cell: (cell) => {
        return cell.row.index + 1;
      },
    };
  }

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
  };

  if (column.type === 'date') {
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

  /** Formatter */
  if (column.formatter && column.editable !== true) {
    columnDef.cell = (cell) => column.formatter!(cell);
  }

  /** Editable Cell */
  // editable disabled by default — only enable when `true` or an options object is provided
  const editableOpts:
    | false
    | (Record<string, unknown> & {
        items?: unknown;
        allowAdditions?: unknown;
      }) =
    column.editable === true
      ? {}
      : typeof column.editable === 'object' && column.editable != null
        ? column.editable
        : false;

  if (editableOpts !== false) {
    // default/text editable
    if (column.type !== 'list' && column.type !== 'array') {
      let component = TextEditableCellComponent;
      if (column.type === 'date') {
        component = DateEditableCellComponent;
      }

      columnDef.cell = (cell) => {
        const value = cell.getValue();
        return flexRenderComponent(component, {
          inputs: { value, type: column.type },
          outputs: {
            blur: (newValue: unknown) => {
              const edited = {
                ...cell.row.original,
                [cell.column.id]: newValue,
              };
              onCellEdit(edited);
            },
          },
        });
      };

      return columnDef;
    }

    // list editable — safely read items
    if (column.type === 'list') {
      const items = Array.isArray((editableOpts as any).items)
        ? (editableOpts as any).items
        : undefined;

      columnDef.cell = (cell) => {
        const value = cell.getValue();
        return flexRenderComponent(ListEditableCellComponent, {
          inputs: {
            value,
            type: column.type,
            items,
          },
          outputs: {
            blur: (newValue: unknown) => {
              const edited = {
                ...cell.row.original,
                [cell.column.id]: newValue,
              };
              onCellEdit(edited);
            },
          },
        });
      };

      return columnDef;
    }

    // array editable — safely read allowAdditions
    if (column.type === 'array') {
      const allowAdditions = !!(editableOpts as any).allowAdditions;

      columnDef.cell = (cell) => {
        const value = cell.getValue();
        return flexRenderComponent(ArrayEditableCellComponent, {
          inputs: {
            value,
            type: column.type,
            allowAdditions,
          },
          outputs: {
            blur: (newValue: string[]) => {
              const edited = {
                ...cell.row.original,
                [cell.column.id]: newValue,
              };
              onCellEdit(edited);
            },
          },
        });
      };

      return columnDef;
    }
  }

  return columnDef;
};
