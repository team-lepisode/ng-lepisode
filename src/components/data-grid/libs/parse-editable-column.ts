import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { DateEditableCellComponent } from '../components/date-editable-cell/date-editable-cell.component';
import { TextEditableCellComponent } from '../components/text-editable-cell/text-editable-cell.component';
import {
  DataGridColumnDef,
  DataGridRowNumberColumnDef,
} from '../data-grid.type';
import { ArrayEditableCellComponent } from '../components/array-editable-cell/array-editable-cell.component';
import { ListEditableCellComponent } from '../components/list-editable-cell/list-editable-cell.component';

export const parseEditableColumn = (
  column: Exclude<DataGridColumnDef, DataGridRowNumberColumnDef>,
  onCellEdit: (edited: any) => void,
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
    size: 200,
    minSize: 100,
    maxSize: 500,
  };

  if (column.editable === false)
    throw new Error('Invalid column definition provided.');

  if (column.component) {
    const component = column.component;
    columnDef.cell = (cell) => {
      const value = cell.getValue();
      return flexRenderComponent(component, {
        inputs: { value },
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

  if (column.type === 'list') {
    columnDef.cell = (cell) => {
      const value = cell.getValue();
      return flexRenderComponent(ListEditableCellComponent, {
        inputs: {
          value,
          type: column.type,
          items: column.items,
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

  if (column.type === 'array') {
    const allowAdditions = !!(editableOpts as any).allowAdditions;

    columnDef.cell = (cell) => {
      const value = cell.getValue();
      return flexRenderComponent(ArrayEditableCellComponent, {
        inputs: {
          value,
          type: column.type,
          allowAdditions,
          items: column.items,
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

  return columnDef;
};
