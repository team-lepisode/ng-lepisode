import { CellContext, RowData } from '@tanstack/angular-table';

declare module '@tanstack/angular-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    type?: DataGridColumnTypes;
    icon?: string;
    detail?: boolean;
    items?: string[];
  }
}

export type DataGridViews = 'table' | 'gallery';

/**
 * Persisted state structure for DataGrid component
 * Stores user preferences and table state across sessions
 */
export type DataGridPersistedState = {
  /** Current view mode (table or gallery) */
  view?: 'table' | 'gallery' | 'calendar';
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
  /** State persistence configuration */
  persist?: DataGridPersistConfig;
};

export type DataGridColumnTypes =
  | 'rowNumber'
  | 'text'
  | 'date'
  | 'number'
  | 'boolean'
  | 'array'
  | 'list';

export type DataGridColumnDef =
  | DataGridTextColumnDef
  | DataGridDateColumnDef
  | DataGridNumberColumnDef
  | DataGridBooleanColumnDef
  | DataGridArrayColumnDef
  | DataGridListColumnDef
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
};

type DataGridTextColumnDef = DataGridCommonColumnDef & {
  type?: 'text';
  field: string | (() => string);
  editable?: boolean;
  maxLength?: number;
  placeholder?: string;
};

type DataGridDateColumnDef = DataGridCommonColumnDef & {
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

type DataGridNumberColumnDef = DataGridCommonColumnDef & {
  type: 'number';
  field: string | (() => string);
  editable?:
    | {
        min?: number;
        max?: number;
      }
    | boolean;
};

type DataGridBooleanColumnDef = DataGridCommonColumnDef & {
  type: 'boolean';
  field: string | (() => string);
  editable?: boolean;
};

type DataGridListColumnDef = DataGridCommonColumnDef & {
  type: 'list';
  items?: string[];
  field: string | (() => string);
  editable?: { items: string[] } | boolean;
};

type DataGridArrayColumnDef = DataGridCommonColumnDef & {
  type: 'array';
  items?: string[];
  field: string | (() => string);
  editable?:
    | {
        allowAdditions?: boolean;
        items?: string[];
      }
    | boolean;
};

type DataGridRowNumberColumnDef = DataGridCommonColumnDef & {
  type: 'rowNumber';
};
