import { ComponentType } from '@angular/cdk/overlay';
import { CellContext, RowData } from '@tanstack/angular-table';

declare module '@tanstack/angular-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    type?: DataGridColumnTypes;
    icon?: string;
    detail?: boolean;
    items?: string[];
  }
}

export type DataGridViews = 'table' | 'gallery' | 'kanban';

export type KanbanColumn = {
  value: string;
  label: string;
  color?: string;
  cards?: any[];
};

/**
 * Persisted state structure for DataGrid component
 * Stores user preferences and table state across sessions
 */
export type DataGridPersistedState = {
  /** Current view mode (table, gallery, calendar, or kanban) */
  view?: 'table' | 'gallery' | 'calendar' | 'kanban';
  /** Pagination state */
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  /** Global search/filter query */
  search?: string;
  /** Column sorting state */
  sorting?: Array<{
    id: string;
    desc: boolean;
  }>;
  /** Order of columns in the table */
  columnOrder?: string[];
  /** Column visibility state */
  columnVisibility?: Record<string, boolean>;
  /** Individual column filters */
  columnFilters?: Array<{
    id: string;
    value: unknown;
  }>;
  /** Column sizing state */
  columnSizing?: Record<string, number>;
  /** Timestamp for cache invalidation */
  updatedAt?: number;
};

/**
 * Configuration for DataGrid state persistence
 * Controls what state is persisted and how
 */
export type DataGridPersistConfig = {
  /** Enable/disable persistence (default: true - opt-out behavior) */
  enabled?: boolean;
  /** Custom storage key (defaults to DataGridOptions.id) */
  key?: string;
  /** Storage mechanism to use */
  storage?: 'indexeddb' | 'localstorage';
  /** Granular control over which state properties to persist */
  state?: {
    /** Persist view mode (default: true) */
    view?: boolean;
    /** Persist pagination state (default: true) */
    pagination?: boolean;
    /** Persist sorting state (default: true) */
    sorting?: boolean;
    /** Persist column filters (default: true) */
    filters?: boolean;
    /** Persist search query (default: true) */
    search?: boolean;
    /** Persist column order (default: true) */
    columnOrder?: boolean;
    /** Persist column visibility (default: false) */
    columnVisibility?: boolean;
    /** Persist column sizing (default: true) */
    columnSizing?: boolean;
  };
  /** Time-to-live in milliseconds (optional cache expiry) */
  ttl?: number;
};

export type DataGridOptions = {
  /** Unique identifier for the grid (required when persistence is enabled) */
  id?: string;
  imageField?: string;
  titleField?: string;
  descriptionField?: string;
  startDateField?: string;
  endDateField?: string;
  badgeField?: string;
  colorField?: string;
  /** State persistence configuration */
  persist?: DataGridPersistConfig;
  /** 칸반 컬럼 그룹핑 기준 필드 (예: 'status', 'priority') */
  kanbanGroupField?: string;
  /** 칸반 컬럼 순서 및 레이블 정의 */
  kanbanColumns?: KanbanColumn[];
};

export type DataGridColumnTypes =
  | 'rowNumber'
  | 'text'
  | 'textarea'
  | 'date'
  | 'datetime'
  | 'number'
  | 'boolean'
  | 'array'
  | 'list'
  | 'file';

export type DataGridColumnDef =
  | DataGridTextColumnDef
  | DataGridTextareaColumnDef
  | DataGridDateColumnDef
  | DataGridDateTimeColumnDef
  | DataGridNumberColumnDef
  | DataGridBooleanColumnDef
  | DataGridArrayColumnDef
  | DataGridListColumnDef
  | DataGridFileColumnDef
  | DataGridRowNumberColumnDef;

type DataGridCommonColumnDef = {
  /** 헤더에 표시할 텍스트 */
  header?: string;
  /** 상세보기 버튼 표시 여부 */
  detail?: boolean;
  primary?: boolean;

  /** 정렬 가능 여부 */
  sortable?: boolean;

  filterable?: boolean;
  headerIconClass?: string;
  formatter?: (cell: CellContext<any, unknown>) => string;
  component?: ComponentType<any>;

  /** 컬럼 너비 (기본값: 200) */
  size?: number;
  /** 컬럼 최소 너비 (기본값: 100) */
  minSize?: number;
  /** 컬럼 최대 너비 (기본값: 500) */
  maxSize?: number;
};

export type DataGridTextColumnDef = DataGridCommonColumnDef & {
  type?: 'text';
  field: string | (() => string);
  editable?: boolean;
  maxLength?: number;
  placeholder?: string;
};

export type DataGridTextareaColumnDef = DataGridCommonColumnDef & {
  type?: 'textarea';
  field: string | (() => string);
  editable?: boolean;
  maxLength?: number;
  placeholder?: string;
};

export type DataGridDateTimeColumnDef = DataGridCommonColumnDef & {
  type: 'datetime';
  field: string | (() => string);
  dateFormat?: string;
  editable?:
    | {
        maxDate?: Date;
        minDate?: Date;
      }
    | boolean;
};

export type DataGridDateColumnDef = DataGridCommonColumnDef & {
  type: 'date';
  field: string | (() => string);
  dateFormat?: string;
  editable?:
    | {
        maxDate?: Date;
        minDate?: Date;
      }
    | boolean;
};

export type DataGridNumberColumnDef = DataGridCommonColumnDef & {
  type: 'number';
  field: string | (() => string);
  editable?:
    | {
        min?: number;
        max?: number;
      }
    | boolean;
};

export type DataGridBooleanColumnDef = DataGridCommonColumnDef & {
  type: 'boolean';
  field: string | (() => string);
  editable?: boolean;
};

export type DataGridListColumnDef = DataGridCommonColumnDef & {
  type: 'list';
  items?: string[];
  field: string | (() => string);
  editable?: boolean;
};

export type DataGridArrayColumnDef = DataGridCommonColumnDef & {
  type: 'array';
  items?: string[];
  field: string | (() => string);
  editable?:
    | {
        allowAdditions?: boolean;
      }
    | boolean;
};

export type DataGridFileColumnDef = DataGridCommonColumnDef & {
  type: 'file';
  field: string | (() => string);
  editable?: boolean;
};

export type DataGridRowNumberColumnDef = DataGridCommonColumnDef & {
  type: 'rowNumber';
};
