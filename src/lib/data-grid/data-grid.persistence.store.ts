import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { DataGridComponentStore } from './data-grid.component.store';
import { DataGridPersistedState } from './data-grid.type';
import { DataGridStorageService } from './datagrid-storage.service';

@Injectable()
export class DataGridPersistenceStore {
  private store = inject(DataGridComponentStore);
  private storageService = inject(DataGridStorageService);

  persistenceInitialized = signal<boolean>(false);
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Auto-save state changes (debounced via effect)
    effect(() => {
      // Read all reactive dependencies from component store
      this.store.view();
      this.store.pageIndex();
      this.store.pageSize();
      this.store.query();
      this.store.sorting();
      this.store.columnFilters();
      this.store.columnSizingState();

      // Only save after initial load to avoid overwriting on init
      if (this.persistenceInitialized() && this.shouldPersist()) {
        // Debounce saves to avoid excessive writes
        if (this.saveTimeout) {
          clearTimeout(this.saveTimeout);
        }
        this.saveTimeout = setTimeout(() => {
          this.saveCurrentState();
        }, 100);
      }
    });
  }

  /**
   * Check if persistence should be enabled for this grid
   */
  shouldPersist(): boolean {
    const options = this.store.options();
    const config = options.persist;

    // Explicit disable
    if (config?.enabled === false) return false;

    // Need an ID or custom key
    if (!options.id && !config?.key) {
      return false;
    }

    return true;
  }

  /**
   * Get the storage key for this grid
   */
  getPersistenceKey(): string {
    const options = this.store.options();
    return options.persist?.key || options.id || '';
  }

  /**
   * Load persisted state from storage and apply to component
   */
  async loadPersistedState(): Promise<void> {
    if (!this.shouldPersist()) {
      this.persistenceInitialized.set(true);
      return;
    }

    const key = this.getPersistenceKey();
    const storage = this.store.options().persist?.storage || 'indexeddb';

    try {
      const state = await this.storageService.loadState(key, storage);

      if (state) {
        // Use untracked to apply state without triggering the effect
        untracked(() => {
          this.applyPersistedState(state);
        });
      }
    } catch (error) {
      console.error('Failed to load persisted state:', error);
    } finally {
      // Delay initialization flag slightly to ensure all signals are set
      setTimeout(() => {
        this.persistenceInitialized.set(true);
      }, 100);
    }
  }

  /**
   * Apply loaded state to component signals
   */
  private applyPersistedState(state: DataGridPersistedState): void {
    const config = this.store.options().persist?.state || {};

    // Apply view mode
    if (config.view !== false && state.view) {
      this.store.view.set(state.view);
    }

    // Apply pagination
    if (config.pagination !== false && state.pagination) {
      this.store.pageIndex.set(state.pagination.pageIndex);
      this.store.pageSize.set(state.pagination.pageSize);
    }

    // Apply search query
    if (config.search !== false && state.search !== undefined) {
      this.store.query.set(state.search);
    }

    // Apply sorting
    if (config.sorting !== false && state.sorting) {
      this.store.sorting.set(state.sorting);
    }

    // Apply column filters
    if (config.filters !== false && state.columnFilters) {
      this.store.columnFilters.set(state.columnFilters);
    }

    // Apply column sizing
    if (config.columnSizing !== false && state.columnSizing) {
      this.store.columnSizingState.set(state.columnSizing);
    }
  }

  /**
   * Save current state to storage
   */
  async saveCurrentState(): Promise<void> {
    const key = this.getPersistenceKey();
    const storage = this.store.options().persist?.storage || 'indexeddb';
    const config = this.store.options().persist?.state || {};

    const state: DataGridPersistedState = {
      updatedAt: Date.now(),
    };

    // Collect state based on config
    if (config.view !== false) {
      state.view = this.store.view();
    }

    if (config.pagination !== false) {
      state.pagination = {
        pageIndex: this.store.pageIndex(),
        pageSize: this.store.pageSize(),
      };
    }

    if (config.search !== false) {
      state.search = this.store.query();
    }

    if (config.sorting !== false) {
      state.sorting = this.store.sorting();
    }

    if (config.filters !== false) {
      state.columnFilters = this.store.columnFilters();
    }

    if (config.columnSizing !== false) {
      state.columnSizing = this.store.columnSizingState();
    }

    try {
      await this.storageService.saveState(key, state, storage);
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }

  /**
   * Clear persisted state and reset to defaults
   */
  async resetState(): Promise<void> {
    if (!this.shouldPersist()) return;

    const key = this.getPersistenceKey();
    const storage = this.store.options().persist?.storage || 'indexeddb';

    try {
      await this.storageService.clearState(key, storage);

      // Reset to defaults
      this.store.view.set('table');
      this.store.pageIndex.set(0);
      this.store.pageSize.set(10);
      this.store.query.set('');
      this.store.sorting.set([]);
      this.store.columnFilters.set([]);
      this.store.columnSizingState.set({});
    } catch (error) {
      console.error('Failed to reset state:', error);
    }
  }
}
