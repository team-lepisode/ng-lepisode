# Calendar View 컴포넌트

Data Grid의 캘린더 뷰를 위한 컴포넌트 모음입니다.

## 구조

```
calendar/
├── calendar-view.component.ts      # 메인 캘린더 뷰 컴포넌트
├── calendar-view.component.html
├── calendar-view.component.css
├── calendar-toolbar.component.ts   # 커스텀 툴바 컴포넌트
├── calendar-event.component.ts     # 커스텀 이벤트 컴포넌트
└── README.md
```

## 컴포넌트

### CalendarViewComponent

메인 캘린더 뷰 컴포넌트입니다. FullCalendar를 래핑하고 커스텀 툴바, 이벤트 렌더링을 통합합니다.

**Inputs:**

- `rowData` - Data Grid Store에서 자동 주입
- `options` - Data Grid Store에서 자동 주입

**Outputs:**

- `onCellEdit` - 이벤트 드래그/리사이즈 시 발생
- `onDetailClick` - 이벤트 클릭 시 발생

### CalendarToolbarComponent

캘린더 네비게이션 및 뷰 전환을 담당합니다.

**Inputs:**
| 속성 | 타입 | 설명 |
|------|------|------|
| `title` | `string` | 현재 캘린더 타이틀 (예: "2024년 2월") |
| `currentView` | `CalendarViewType` | 현재 활성 뷰 |
| `availableViews` | `{ value: CalendarViewType; label: string }[]` | 사용 가능한 뷰 목록 |

**Outputs:**
| 속성 | 타입 | 설명 |
|------|------|------|
| `action` | `CalendarToolbarAction` | 툴바 액션 이벤트 |

**Action Types:**

```typescript
type CalendarToolbarAction = {
  type: 'prev' | 'next' | 'today' | 'viewChange';
  view?: CalendarViewType;
};

type CalendarViewType = 'dayGridMonth' | 'listWeek' | 'timeGridWeek' | 'timeGridDay';
```

### CalendarEventComponent

개별 이벤트 렌더링을 담당합니다.

**Inputs:**
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `event` | `EventApi \| null` | `null` | FullCalendar 이벤트 객체 |
| `eventColor` | `string` | `'var(--color-primary)'` | 이벤트 색상 |
| `showTime` | `boolean` | `false` | 시간 표시 여부 |
| `badge` | `string \| null` | `null` | 배지 텍스트 |
| `badgeClass` | `string` | `''` | 배지 스타일 클래스 |

## 데이터 흐름

```
┌─────────────────────────────────────────────────────────┐
│  CalendarToolbarComponent                               │
│  ┌────────┐ ┌────────┐ ┌──────┐    ┌──────────────────┐ │
│  │  < 이전 │ │ 다음 > │ │ 오늘  │    │  월  │  주  │    │ │
│  └────────┘ └────────┘ └──────┘    └──────────────────┘ │
│       │         │         │              │              │
│       └─────────┴─────────┴──────────────┘              │
│                         │                               │
│                    (action) output                      │
└─────────────────────────┼───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  CalendarViewComponent                                  │
│                                                         │
│  onToolbarAction(action) {                              │
│    calendarApi.prev()      // 이전 달                   │
│    calendarApi.next()      // 다음 달                   │
│    calendarApi.today()     // 오늘                      │
│    calendarApi.changeView() // 뷰 전환                  │
│  }                                                      │
│                                                         │
│  datesSet 콜백 → calendarApi 캡처 + title 업데이트      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  FullCalendar                                           │
│  - calendarApi로 제어                                   │
│  - datesSet 이벤트 발생 시 title, currentView 업데이트   │
│  - eventContent 템플릿으로 CalendarEventComponent 렌더링│
└─────────────────────────────────────────────────────────┘
```

## Calendar API 캡처 방식

`datesSet` 콜백을 통해 Calendar API를 캡처합니다.

```typescript
calendarOptions: CalendarOptions = {
  // ...
  datesSet: (args: DatesSetArg) => {
    this.calendarApi = args.view.calendar; // API 캡처
    this.currentTitle.set(args.view.title); // 타이틀 업데이트
    this.currentView.set(args.view.type); // 현재 뷰 업데이트
  },
};
```

**왜 datesSet을 사용하는가?**

- `datesSet`은 캘린더 초기화, 네비게이션, 뷰 전환 시 항상 호출됨
- `args.view.calendar`로 안전하게 API 참조 획득
- `effect`나 `afterNextRender`보다 타이밍 이슈가 적음

## 단방향 데이터 흐름

```
사용자 클릭 → onToolbarAction → calendarApi.prev()
                                   ↓
                              datesSet 발생
                                   ↓
                              currentTitle.set("2024년 2월")
                                   ↓
                              Toolbar에 [title] 전달
```

1. **사용자 액션** → Toolbar에서 `action` output emit
2. **API 호출** → View Component에서 `calendarApi` 메서드 호출
3. **상태 동기화** → `datesSet` 콜백에서 상태 업데이트
4. **UI 업데이트** → 변경된 상태가 Toolbar에 input으로 전달

## 이벤트 색상 전략

```typescript
getEventColor(event: EventApi): string {
  // 1. colorField 옵션이 있으면 해당 필드 값 사용
  const colorField = this.store.options().colorField;
  if (colorField && event.extendedProps?.[colorField]) {
    return event.extendedProps[colorField];
  }

  // 2. 없으면 ID 기반 팔레트에서 자동 선택
  const index = Math.abs(event.id?.toString().length ?? 0) % this.colorPalette.length;
  return this.colorPalette[index];
}
```

**색상 팔레트:**

- `--color-primary`
- `--color-secondary`
- `--color-accent`
- `--color-info`
- `--color-success`
- `--color-warning`
- `--color-error`

## 사용 예시

### 기본 사용법

```typescript
const options: DataGridOptions = {
  id: 'calendar-example',
  titleField: 'title',
  startDateField: 'startDate',
  endDateField: 'endDate',
  colorField: 'categoryColor', // 선택사항: 커스텀 색상 필드
};
```

### 커스텀 이벤트 컴포넌트 확장

```typescript
@Component({
  template: ` <app-calendar-event [event]="event()" [eventColor]="color()" [showTime]="true" [badge]="status()" [badgeClass]="statusClass()" /> `,
})
export class CustomCalendarEventComponent {
  event = input<EventApi | null>(null);

  status = computed(() => this.event()?.extendedProps?.status);

  statusClass = computed(() => {
    switch (this.status()) {
      case 'DONE':
        return 'badge-success';
      case 'IN_PROGRESS':
        return 'badge-warning';
      case 'TODO':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  });
}
```

## 기술 스택

- **Angular 21** - signal, input, output, computed, viewChild
- **FullCalendar 6.x** - 캘린더 엔진
- **TailwindCSS** - 스타일링
- **DaisyUI** - 디자인 시스템 토큰
