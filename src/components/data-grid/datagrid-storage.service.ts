import { Injectable, inject } from '@angular/core';
import type { DataGridPersistedState } from './data-grid.type';
import { RxDBService } from './rxdb.service';

/**
 * DataGrid Storage Service
 * Handles persistence of DataGrid state using IndexedDB (via RxDB) with localStorage fallback
 */
@Injectable({ providedIn: 'root' })
export class DataGridStorageService {
  private rxdbService = inject(RxDBService);

  /**
   * Save DataGrid state to storage
   * @param key Unique identifier for the grid
   * @param state State to persist
   * @param storage Storage mechanism (indexeddb or localstorage)
   */
  async saveState(
    key: string,
    state: DataGridPersistedState,
    storage: 'indexeddb' | 'localstorage' = 'indexeddb',
  ): Promise<void> {
    if (storage === 'indexeddb') {
      await this.saveToIndexedDB(key, state);
    } else {
      this.saveToLocalStorage(key, state);
    }
  }

  /**
   * Load DataGrid state from storage
   * @param key Unique identifier for the grid
   * @param storage Storage mechanism (indexeddb or localstorage)
   * @returns Persisted state or null if not found
   */
  async loadState(
    key: string,
    storage: 'indexeddb' | 'localstorage' = 'indexeddb',
  ): Promise<DataGridPersistedState | null> {
    if (storage === 'indexeddb') {
      return await this.loadFromIndexedDB(key);
    } else {
      return this.loadFromLocalStorage(key);
    }
  }

  /**
   * Clear DataGrid state from storage
   * @param key Unique identifier for the grid
   * @param storage Storage mechanism (indexeddb or localstorage)
   */
  async clearState(
    key: string,
    storage: 'indexeddb' | 'localstorage' = 'indexeddb',
  ): Promise<void> {
    if (storage === 'indexeddb') {
      await this.clearFromIndexedDB(key);
    } else {
      this.clearFromLocalStorage(key);
    }
  }

  /**
   * Save state to IndexedDB via RxDB
   * Falls back to localStorage on error
   */
  private async saveToIndexedDB(
    key: string,
    state: DataGridPersistedState,
  ): Promise<void> {
    try {
      const collection =
        await this.rxdbService.getCollection('datagrid_states');
      await collection.upsert({
        key,
        state,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error(
        'Failed to save to IndexedDB, falling back to localStorage',
        error,
      );
      this.saveToLocalStorage(key, state);
    }
  }

  /**
   * Load state from IndexedDB via RxDB
   * Falls back to localStorage on error
   */
  private async loadFromIndexedDB(
    key: string,
  ): Promise<DataGridPersistedState | null> {
    try {
      const collection =
        await this.rxdbService.getCollection('datagrid_states');
      const doc = await collection.findOne(key).exec();
      return doc ? doc.state : null;
    } catch (error) {
      console.error(
        'Failed to load from IndexedDB, falling back to localStorage',
        error,
      );
      return this.loadFromLocalStorage(key);
    }
  }

  /**
   * Clear state from IndexedDB via RxDB
   */
  private async clearFromIndexedDB(key: string): Promise<void> {
    try {
      const collection =
        await this.rxdbService.getCollection('datagrid_states');
      const doc = await collection.findOne(key).exec();
      if (doc) {
        await doc.remove();
      }
    } catch (error) {
      console.error('Failed to clear from IndexedDB', error);
    }
  }

  /**
   * Save state to localStorage
   */
  private saveToLocalStorage(key: string, state: DataGridPersistedState): void {
    try {
      localStorage.setItem(`datagrid-${key}`, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save to localStorage', error);
    }
  }

  /**
   * Load state from localStorage
   */
  private loadFromLocalStorage(key: string): DataGridPersistedState | null {
    try {
      const data = localStorage.getItem(`datagrid-${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load from localStorage', error);
      return null;
    }
  }

  /**
   * Clear state from localStorage
   */
  private clearFromLocalStorage(key: string): void {
    try {
      localStorage.removeItem(`datagrid-${key}`);
    } catch (error) {
      console.error('Failed to clear from localStorage', error);
    }
  }
}
