import { Menu, MenuContent, MenuItem } from '@angular/aria/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Column } from '@tanstack/angular-table';
import { DataGridComponentStore } from '../../data-grid.component.store';

@Component({
  selector: 'app-header-menu',
  imports: [TranslatePipe, Menu, OverlayModule, MenuContent, MenuItem],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css',
})
export class HeaderMenuComponent {
  close = output<void>();
  private readonly store = inject(DataGridComponentStore);

  column = input.required<Column<any, unknown>>();
  sortMenu = viewChild<Menu<string>>('sortMenu');

  hasInteracted = signal(false);

  isSorted = computed(() => this.column().getIsSorted());

  setSortDirection(direction: 'asc' | 'desc') {
    const column = this.column();
    if (column.getCanSort()) {
      column.toggleSorting(direction === 'asc');
    }
  }

  addFilter() {
    this.store.addFilter(this.column().id);
    this.close.emit();
  }
}
