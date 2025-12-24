# Data Grid 컴포넌트

다양한 뷰(테이블, 갤러리, 캘린더), 인라인 편집, 필터링, 정렬 및 상태 지속성을 지원하는 강력하고 기능이 풍부한 Angular 데이터 그리드 컴포넌트입니다.

## 기능

- 📊 **다양한 뷰 모드**: 테이블, 갤러리 및 캘린더 뷰 지원
- ✏️ **인라인 편집**: 타입별 편집기를 사용하여 셀 직접 편집 가능
- 🔍 **고급 필터링**: 타입 인식 입력을 통한 컬럼 기반 필터링
- 🔄 **정렬**: 다중 컬럼 정렬 지원
- 💾 **상태 지속성**: IndexedDB 또는 LocalStorage에 상태 자동 저장
- 📱 **반응형**: 다양한 화면 크기에 적응
- 🎨 **사용자 정의 가능**: 유연한 컬럼 정의 및 서식 옵션
- 🔢 **페이지네이션**: 내장된 페이지네이션 컨트롤

## 설치

이 컴포넌트는 `@ng-lepisode` 라이브러리의 일부입니다:

```typescript
import { DataGridComponent, DataGridColumnDef, DataGridOptions } from '@ng-lepisode';
```

## 기본 사용법

### 1. 컴포넌트 가져오기

```typescript
import { Component } from '@angular/core';
import { DataGridComponent, DataGridColumnDef, DataGridOptions } from '@ng-lepisode';

@Component({
  selector: 'app-my-page',
  imports: [DataGridComponent],
  templateUrl: './my-page.html',
})
export class MyPage {
  // 컴포넌트 로직
}
```

### 2. 컬럼 구성 정의

```typescript
const columns: DataGridColumnDef[] = [
  { type: 'rowNumber' },
  {
    field: 'title',
    detail: true,
    editable: true,
    primary: true,
  },
  {
    field: 'status',
    type: 'list',
    items: ['TODO', 'IN_PROGRESS', 'DONE'],
    editable: true,
  },
  {
    field: 'startDate',
    type: 'date',
    editable: true,
  },
];
```

### 3. 옵션 구성

```typescript
const options: DataGridOptions = {
  id: 'my-grid', // 상태 지속성을 위해 필수
  titleField: 'title',
  startDateField: 'startDate',
  endDateField: 'endDate',
};
```

### 4. 템플릿에서 사용

```html
<lepi-data-grid [rowData]="data()" [columns]="columns" [options]="options" (onCellEdit)="handleCellEdit($event)" (onDetailClick)="handleDetailClick($event)">
  <button buttons class="btn btn-sm btn-primary" (click)="addNew()">추가하기</button>
</lepi-data-grid>
```

## 컬럼 타입

데이터 그리드는 특정 동작을 가진 다양한 컬럼 타입을 지원합니다:

### Row Number (행 번호)

자동 증가하는 행 번호를 표시합니다.

```typescript
{
  type: 'rowNumber';
}
```

### Text (텍스트)

텍스트 콘텐츠를 위한 기본 컬럼 타입입니다.

```typescript
{
  field: 'title',
  editable: true,
  maxLength: 100,
  placeholder: '제목 입력...'
}
```

### Date (날짜)

날짜 값을 표시하고 편집합니다.

```typescript
{
  field: 'dueDate',
  type: 'date',
  dateFormat: 'yyyy-MM-dd', // 선택 사항
  editable: {
    minDate: new Date('2024-01-01'),
    maxDate: new Date('2024-12-31')
  }
}
```

### Number (숫자)

숫자 값을 처리합니다.

```typescript
{
  field: 'quantity',
  type: 'number',
  editable: {
    min: 0,
    max: 1000
  }
}
```

### Boolean (불리언)

불리언 값을 위한 체크박스 또는 토글입니다.

```typescript
{
  field: 'isActive',
  type: 'boolean',
  editable: true
}
```

### List (리스트)

미리 정의된 옵션에서 단일 선택 드롭다운을 제공합니다.

```typescript
{
  field: 'status',
  type: 'list',
  items: ['Draft', 'Published', 'Archived'],
  editable: true
}
```

### Array (배열)

배열 값을 위한 다중 선택을 제공합니다.

```typescript
{
  field: 'tags',
  type: 'array',
  items: ['Feature', 'Bug', 'Enhancement'],
  editable: {
    allowAdditions: true,
  }
}
```

## 컬럼 정의 속성

### 공통 속성

모든 컬럼 타입은 다음 속성을 지원합니다:

| 속성              | 타입       | 설명                                |
| ----------------- | ---------- | ----------------------------------- |
| `header`          | `string`   | 헤더 텍스트 (기본값은 필드 이름)    |
| `detail`          | `boolean`  | 이 컬럼에 상세/확장 버튼 표시       |
| `primary`         | `boolean`  | 기본 컬럼으로 표시 (초기 전체 너비) |
| `sortable`        | `boolean`  | 이 컬럼에 대한 정렬 활성화          |
| `filterable`      | `boolean`  | 이 컬럼에 대한 필터링 활성화        |
| `headerIconClass` | `string`   | 헤더용 사용자 정의 아이콘 클래스    |
| `formatter`       | `function` | 사용자 정의 셀 값 포맷터            |

### 타입별 속성

각 컬럼 타입에는 추가 속성이 있습니다. 자세한 내용은 위의 **컬럼 타입** 섹션을 참조하세요.

## 데이터 그리드 옵션

`DataGridOptions`로 그리드 동작을 구성합니다:

```typescript
interface DataGridOptions {
  /** 고유 식별자 (상태 지속성을 위해 필수) */
  id?: string;

  /** 갤러리 및 캘린더 뷰를 위한 필드 매핑 */
  imageField?: string;
  titleField?: string;
  descriptionField?: string;
  startDateField?: string;
  endDateField?: string;
  badgeField?: string;

  /** 상태 지속성 구성 */
  persist?: DataGridPersistConfig;
}
```

## 상태 지속성

데이터 그리드는 다음을 포함한 사용자 환경설정을 자동으로 유지합니다:

- 현재 뷰 모드 (테이블/갤러리/캘린더)
- 페이지네이션 설정
- 컬럼 정렬
- 컬럼 필터
- 컬럼 가시성
- 컬럼 크기 조정
- 컬럼 순서
- 검색 쿼리

### 지속성 구성

```typescript
const options: DataGridOptions = {
  id: 'my-grid',
  persist: {
    enabled: true, // 기본값: true
    storage: 'indexeddb', // 또는 'localstorage'
    ttl: 7 * 24 * 60 * 60 * 1000, // 7일 (밀리초 단위)
    state: {
      view: true,
      pagination: true,
      sorting: true,
      filters: true,
      search: true,
      columnOrder: true,
      columnVisibility: false, // 가시성 지속성 비활성화
      columnSizing: true,
    },
  },
};
```

### 프로그래밍 방식으로 상태 초기화

```typescript
import { Component, viewChild } from '@angular/core';
import { DataGridComponent } from '@ng-lepisode';

@Component({
  // ...
})
export class MyPage {
  dataGrid = viewChild<DataGridComponent>('dataGrid');

  async resetGrid() {
    await this.dataGrid()?.resetState();
  }
}
```

```html
<lepi-data-grid #dataGrid [rowData]="data()" [columns]="columns" />
```

## 이벤트

### onCellEdit

셀이 인라인으로 편집될 때 발생합니다.

```typescript
handleCellEdit(editedRow: any) {
  // editedRow는 업데이트된 값이 포함된 전체 행 데이터를 포함합니다
  this.updateRecord(editedRow.id, editedRow);
}
```

### onDetailClick

상세 버튼이 클릭될 때 발생합니다 (컬럼에 `detail: true` 필요).

```typescript
handleDetailClick(row: any) {
  this.router.navigate(['/detail', row.id]);
}
```

## 뷰 모드

### 테이블 뷰

기본 뷰는 다음과 같은 기능을 갖춘 전통적인 테이블 형식으로 데이터를 표시합니다:

- 크기 조절 가능한 컬럼
- 정렬 가능한 헤더
- 인라인 편집
- 컬럼 필터링

### 갤러리 뷰

구성된 필드를 사용하는 카드 기반 레이아웃:

```typescript
const options: DataGridOptions = {
  id: 'gallery-example',
  imageField: 'thumbnailUrl',
  titleField: 'name',
  descriptionField: 'description',
  badgeField: 'status',
};
```

**참고**: `imageField`와 `titleField`가 구성되지 않은 경우 갤러리 뷰는 자동으로 비활성화됩니다.

### 캘린더 뷰

날짜 필드를 사용하는 타임라인/캘린더 표시:

```typescript
const options: DataGridOptions = {
  id: 'calendar-example',
  titleField: 'eventName',
  startDateField: 'startDate',
  endDateField: 'endDate',
};
```

**참고**: `startDateField`가 구성되지 않은 경우 캘린더 뷰는 자동으로 비활성화됩니다.

## 사용자 정의 콘텐츠 프로젝션

툴바에 사용자 정의 버튼이나 컨트롤 추가:

```html
<lepi-data-grid [rowData]="data()" [columns]="columns">
  <button buttons class="btn btn-primary" (click)="export()">내보내기</button>
  <button buttons class="btn btn-secondary" (click)="import()">가져오기</button>
</lepi-data-grid>
```

## 고급 기능

### 사용자 정의 포맷터

사용자 정의 로직으로 셀 값 포맷팅:

```typescript
{
  field: 'price',
  type: 'number',
  formatter: (cell) => {
    const value = cell.getValue();
    return `$${value.toFixed(2)}`;
  }
}
```

### 프로그래밍 방식 뷰 제어

```typescript
import { Component, viewChild } from '@angular/core';
import { DataGridComponent } from '@ng-lepisode';

@Component({
  // ...
})
export class MyPage {
  dataGrid = viewChild<DataGridComponent>('dataGrid');

  switchToGallery() {
    this.dataGrid()?.setView('gallery');
  }

  switchToCalendar() {
    this.dataGrid()?.setView('calendar');
  }
}
```

### 페이지네이션 제어

```typescript
import { Component, viewChild } from '@angular/core';
import { DataGridComponent } from '@ng-lepisode';

@Component({
  // ...
})
export class MyPage {
  dataGrid = viewChild<DataGridComponent>('dataGrid');

  navigatePages() {
    const grid = this.dataGrid();
    grid?.goNextPage();
    grid?.goPreviousPage();
    grid?.goFirstPage();
    grid?.goLastPage();
  }
}
```

## 전체 예제

```typescript
import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataGridComponent, DataGridColumnDef, DataGridOptions } from '@ng-lepisode';
import { TaskStore } from './task.store';
import { TaskStatus, TaskPriority } from './task.types';

@Component({
  selector: 'app-tasks',
  imports: [DataGridComponent],
  template: `
    <div class="flex flex-col h-full gap-4">
      <h2>Tasks</h2>

      <lepi-data-grid [rowData]="taskStore.tasks$.value()" [columns]="columns" [options]="options" (onCellEdit)="onCellEdit($event)" (onDetailClick)="onDetailClick($event)">
        <button buttons class="btn btn-primary" (click)="taskStore.create()">Add Task</button>
      </lepi-data-grid>
    </div>
  `,
})
export default class TasksPage {
  protected readonly taskStore = inject(TaskStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  columns: DataGridColumnDef[] = [
    { type: 'rowNumber' },
    {
      field: 'title',
      detail: true,
      editable: true,
      primary: true,
      placeholder: 'Enter task title...',
    },
    {
      field: 'status',
      type: 'list',
      items: Object.keys(TaskStatus),
      editable: { items: Object.keys(TaskStatus) },
    },
    {
      field: 'priority',
      type: 'list',
      items: Object.keys(TaskPriority),
      editable: { items: Object.keys(TaskPriority) },
    },
    {
      field: 'startDate',
      type: 'date',
      editable: true,
    },
    {
      field: 'endDate',
      type: 'date',
      editable: true,
    },
    {
      field: 'updatedAt',
      type: 'date',
      sortable: true,
    },
  ];

  options: DataGridOptions = {
    id: 'tasks-grid',
    titleField: 'title',
    startDateField: 'startDate',
    endDateField: 'endDate',
    badgeField: 'status',
    persist: {
      enabled: true,
      storage: 'indexeddb',
      ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  };

  onCellEdit(task: any) {
    this.taskStore.update(task.id, task);
  }

  onDetailClick(task: any) {
    this.router.navigate([task.id], { relativeTo: this.route });
  }
}
```

## TypeScript 타입

### DataGridColumnDef

모든 컬럼 정의의 유니온 타입:

```typescript
type DataGridColumnDef = DataGridTextColumnDef | DataGridDateColumnDef | DataGridNumberColumnDef | DataGridBooleanColumnDef | DataGridArrayColumnDef | DataGridListColumnDef | DataGridRowNumberColumnDef;
```

### DataGridPersistedState

지속된 상태의 구조:

```typescript
type DataGridPersistedState = {
  view?: 'table' | 'gallery' | 'calendar';
  pagination?: { pageIndex: number; pageSize: number };
  search?: string;
  sorting?: Array<{ id: string; desc: boolean }>;
  columnOrder?: string[];
  columnVisibility?: Record<string, boolean>;
  columnFilters?: Array<{ id: string; value: unknown }>;
  columnSizing?: Record<string, number>;
  updatedAt?: number;
};
```

## 모범 사례

1. **항상 `DataGridOptions`에 `id`를 제공**하여 상태 지속성을 활성화하세요.
2. **더 나은 UX를 위해 타입별 컬럼을 사용**하세요 (예: 날짜의 경우 `type: 'date'`).
3. **더 나은 초기 레이아웃을 위해 하나의 컬럼을 `primary`로 표시**하세요.
4. **쉬운 탐색을 위해 기본 컬럼에 `detail`을 활성화**하세요.
5. **모든 뷰 모드를 활성화하려면 뷰별 필드(`titleField`, `startDateField` 등)를 구성**하세요.
6. **소스 데이터를 변환하는 대신 복잡한 표시 로직에는 사용자 정의 포맷터를 사용**하세요.
7. **백엔드에 변경 사항을 유지하려면 `onCellEdit` 이벤트를 처리**하세요.

## 문제 해결

### 갤러리 뷰가 표시되지 않음

옵션에 `imageField`와 `titleField`가 모두 구성되어 있는지 확인하세요.

### 캘린더 뷰가 표시되지 않음

옵션에 `startDateField`가 구성되어 있는지 확인하세요.

### 상태가 유지되지 않음

- `DataGridOptions`에 `id`가 설정되어 있는지 확인하세요.
- `persist.enabled`가 `false`로 설정되어 있지 않은지 확인하세요.
- 환경에서 IndexedDB를 사용할 수 있는지 확인하세요.

### 편집 가능한 셀이 작동하지 않음

- 컬럼 정의에 `editable` 속성이 설정되어 있는지 확인하세요.
- `onCellEdit` 이벤트를 처리하고 있는지 확인하세요.
- 행 데이터에 해당 필드가 존재하는지 확인하세요.

## 의존성

데이터 그리드 컴포넌트는 다음을 사용합니다:

- **@tanstack/angular-table** - 핵심 테이블 기능
- **@ngx-translate/core** - 국제화
- **ngxtension** - Angular 유틸리티

## 라이선스

`@ng-lepisode` 라이브러리의 일부입니다.
