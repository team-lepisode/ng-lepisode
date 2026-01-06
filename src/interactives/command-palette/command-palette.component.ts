import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  HostListener,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

interface CommandItem {
  id: string;
  icon: string;
  label: string;
  shortcut?: string;
  category: 'Actions' | 'Navigation';
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.css'],
})
export class CommandPalette {
  isOpen = signal(false);
  query = signal('');
  selectedIndex = signal(0);

  @ViewChild('searchInput') searchInput!: ElementRef;

  items: CommandItem[] = [
    {
      id: '1',
      label: 'Create New Project',
      icon: '✨',
      category: 'Actions',
      shortcut: 'C',
    },
    { id: '2', label: 'Search Documentation', icon: '📚', category: 'Actions' },
    {
      id: '3',
      label: 'Go to Settings',
      icon: '⚙️',
      category: 'Navigation',
      shortcut: 'S',
    },
    { id: '4', label: 'View Profile', icon: '👤', category: 'Navigation' },
    {
      id: '5',
      label: 'Dark Mode Toggle',
      icon: '🌙',
      category: 'Actions',
      shortcut: 'D',
    },
  ];

  // 검색 필터링 로직 (Computed)
  filteredItems = computed(() => {
    const q = this.query().toLowerCase();
    return this.items.filter(item => item.label.toLowerCase().includes(q));
  });

  // 카테고리별 그룹화 (Computed)
  groupedItems = computed(() => {
    const groups: { category: string; items: CommandItem[] }[] = [];
    const filtered = this.filteredItems();

    ['Actions', 'Navigation'].forEach(cat => {
      const catItems = filtered.filter(i => i.category === cat);
      if (catItems.length) groups.push({ category: cat, items: catItems });
    });
    return groups;
  });

  // 키보드 단축키 (Cmd+K / Ctrl+K)
  @HostListener('window:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      this.isOpen.set(true);
      setTimeout(() => this.searchInput.nativeElement.focus(), 0);
    }
    if (e.key === 'Escape') {
      this.close();
    }
  }

  close() {
    this.isOpen.set(false);
    this.query.set('');
    this.selectedIndex.set(0);
  }

  navigate(dir: number, e: Event) {
    e.preventDefault();
    const len = this.filteredItems().length;
    this.selectedIndex.update(i => (i + dir + len) % len);
  }

  execute() {
    const item = this.filteredItems()[this.selectedIndex()];
    this.selectItem(item);
  }

  selectItem(item: CommandItem) {
    console.log('Command executed:', item.label);
    // 실제 동작 로직 (Router 이동 등)
    this.close();
  }

  setIndex(item: CommandItem) {
    this.selectedIndex.set(this.getGlobalIndex(item));
  }

  getGlobalIndex(item: CommandItem) {
    return this.filteredItems().indexOf(item);
  }
}
