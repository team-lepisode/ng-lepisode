import { ColumnDef } from '@tanstack/angular-table';
import { DataGridColumnDef } from '../data-grid.type';
import { parseEditableColumn } from './parse-editable-column';
import { parseNonEditableColumn } from './parse-non-editable-column';

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

  return column.editable === true
    ? parseEditableColumn(column, onCellEdit)
    : parseNonEditableColumn(column);
};
