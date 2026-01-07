import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface SlashCommand {
  title: string;
  description: string;
  icon: string;
  keywords?: string[];
  command: (args: any) => void;
}

@Component({
  selector: 'app-editor-slash-command',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editor-slash-command.component.html',
  styleUrls: ['./editor-slash-command.component.css'],
})
export class EditorSlashCommandComponent {
  props = input<any>(null);
  isMobile = input<boolean>(false);
  selectedIndex = signal(0);

  // Filtered commands based on the query typed after '/'
  readonly filteredCommands = computed(() => {
    const query = (this.props()?.query || '').toLowerCase().trim();
    if (!query) {
      return this.slashCommands;
    }
    return this.slashCommands.filter(
      cmd =>
        cmd.title.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query) ||
        cmd.keywords?.some(k => k.toLowerCase().includes(query))
    );
  });

  // Check if menu should appear above the cursor
  readonly shouldShowAbove = computed(() => {
    const props = this.props();
    if (!props?.clientRect) return false;

    const rect = props.clientRect();
    if (!rect) return false;

    const menuHeight = this.isMobile() ? 200 : 320; // Estimated menu height
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Show above if not enough space below but enough space above
    return spaceBelow < menuHeight && spaceAbove > menuHeight;
  });

  // Calculate top position based on direction
  readonly menuTopPosition = computed(() => {
    const props = this.props();
    if (!props?.clientRect) return 0;

    const rect = props.clientRect();
    if (!rect) return 0;

    if (this.shouldShowAbove()) {
      // Position above: estimate menu height and offset
      const menuHeight = this.isMobile() ? 200 : 320;
      return rect.top - menuHeight - 8;
    } else {
      // Position below
      return rect.bottom + 8;
    }
  });

  constructor() {
    effect(() => {
      // props가 변경될 때(메뉴가 열리거나 검색어가 바뀔 때) 선택 인덱스 초기화
      const props = this.props();
      if (props) {
        // 검색어가 변경되면 인덱스 리셋
        this.selectedIndex.set(0);
      }
    });

    // 필터된 결과가 변경되면 선택 인덱스 리셋
    effect(() => {
      const filtered = this.filteredCommands();
      if (this.selectedIndex() >= filtered.length) {
        this.selectedIndex.set(0);
      }
    });
  }

  // Grid column count for mobile mode
  private readonly MOBILE_GRID_COLS = 3;

  onKeyDown(event: KeyboardEvent): boolean {
    if (this.isMobile()) {
      // Mobile: 4-direction grid navigation
      switch (event.key) {
        case 'ArrowUp':
          this.moveUp();
          return true;
        case 'ArrowDown':
          this.moveDown();
          return true;
        case 'ArrowLeft':
          this.moveLeft();
          return true;
        case 'ArrowRight':
          this.moveRight();
          return true;
        case 'Enter':
          this.enterHandler();
          return true;
      }
    } else {
      // Desktop: vertical navigation
      if (event.key === 'ArrowUp') {
        this.moveUp();
        return true;
      }
      if (event.key === 'ArrowDown') {
        this.moveDown();
        return true;
      }
      if (event.key === 'Enter') {
        this.enterHandler();
        return true;
      }
    }
    return false;
  }

  private moveUp() {
    const len = this.filteredCommands().length;
    if (len === 0) return;
    if (this.isMobile()) {
      // Move up by column count
      const newIndex = this.selectedIndex() - this.MOBILE_GRID_COLS;
      if (newIndex >= 0) {
        this.selectedIndex.set(newIndex);
      }
    } else {
      this.selectedIndex.update(i => (i + len - 1) % len);
    }
    this.scrollSelectedIntoView();
  }

  private moveDown() {
    const len = this.filteredCommands().length;
    if (len === 0) return;
    if (this.isMobile()) {
      // Move down by column count
      const newIndex = this.selectedIndex() + this.MOBILE_GRID_COLS;
      if (newIndex < len) {
        this.selectedIndex.set(newIndex);
      }
    } else {
      this.selectedIndex.update(i => (i + 1) % len);
    }
    this.scrollSelectedIntoView();
  }

  private moveLeft() {
    const len = this.filteredCommands().length;
    if (len === 0) return;
    const currentIndex = this.selectedIndex();
    // Don't wrap at row start
    if (currentIndex % this.MOBILE_GRID_COLS > 0) {
      this.selectedIndex.update(i => i - 1);
    }
    this.scrollSelectedIntoView();
  }

  private moveRight() {
    const len = this.filteredCommands().length;
    if (len === 0) return;
    const currentIndex = this.selectedIndex();
    // Don't wrap at row end and don't exceed length
    if (
      currentIndex % this.MOBILE_GRID_COLS < this.MOBILE_GRID_COLS - 1 &&
      currentIndex < len - 1
    ) {
      this.selectedIndex.update(i => i + 1);
    }
    this.scrollSelectedIntoView();
  }

  private scrollSelectedIntoView() {
    // Use setTimeout to ensure DOM is updated
    setTimeout(() => {
      const activeButton = document.querySelector(
        '.slash-command-suggestions button.active'
      );
      if (activeButton) {
        activeButton.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 0);
  }

  enterHandler() {
    const items = this.filteredCommands();
    const item = items[this.selectedIndex()];
    if (item) {
      this.props().command(item);
    }
  }

  readonly slashCommands: SlashCommand[] = [
    {
      title: '제목 1',
      description: '가장 큰 제목',
      icon: 'icon-[mdi--format-header-1]',
      keywords: ['heading', 'h1', '헤딩', '타이틀'],
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 1 })
          .run();
      },
    },
    {
      title: '제목 2',
      description: '중간 크기 제목',
      icon: 'icon-[mdi--format-header-2]',
      keywords: ['heading', 'h2', '헤딩'],
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 2 })
          .run();
      },
    },
    {
      title: '제목 3',
      description: '작은 크기 제목',
      icon: 'icon-[mdi--format-header-3]',
      keywords: ['heading', 'h3', '헤딩'],
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 3 })
          .run();
      },
    },
    {
      title: '불렛 리스트',
      description: '점 모양 목록',
      icon: 'icon-[mdi--format-list-bulleted]',
      keywords: ['bullet', 'list', 'ul', '목록', '리스트'],
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: '번호 리스트',
      description: '숫자 모양 목록',
      icon: 'icon-[mdi--format-list-numbered]',
      keywords: ['number', 'list', 'ol', '목록', '리스트', '순서'],
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: '표 삽입',
      description: '3x3 표를 삽입합니다',
      icon: 'icon-[mdi--table-large-plus]',
      keywords: ['table', '테이블'],
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
          .run();
      },
    },
    {
      title: '코드 블록',
      description: '코드를 작성합니다',
      icon: 'icon-[mdi--code-braces]',
      keywords: ['code', 'block', '코드'],
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      },
    },
    {
      title: '인용문',
      description: '인용 텍스트를 추가합니다',
      icon: 'icon-[mdi--format-quote-close]',
      keywords: ['quote', 'blockquote', '인용'],
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
    {
      title: '구분선',
      description: '수평 구분선을 삽입합니다',
      icon: 'icon-[mdi--minus]',
      keywords: ['divider', 'hr', 'horizontal', 'rule', '구분'],
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setHorizontalRule().run();
      },
    },
    {
      title: '하이라이트',
      description: '텍스트를 강조 표시합니다',
      icon: 'icon-[mdi--marker]',
      keywords: ['highlight', 'mark', '강조', '형광펜'],
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleHighlight().run();
      },
    },
  ];
}
