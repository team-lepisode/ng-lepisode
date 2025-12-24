import { Injectable } from '@angular/core';
import { createRxDatabase, type RxDatabase, type RxCollection } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import type { DataGridPersistedState } from './data-grid.type';

/**
 * Document structure for DataGrid state in RxDB
 */
export type DataGridStateDocument = {
  key: string;
  state: DataGridPersistedState;
  updatedAt: number;
};

/**
 * RxDB schema for DataGrid state persistence
 */
const datagridStateSchema = {
  version: 0,
  primaryKey: 'key',
  type: 'object' as const,
  properties: {
    key: {
      type: 'string' as const,
      maxLength: 100,
    },
    state: {
      type: 'object' as const,
    },
    updatedAt: {
      type: 'number' as const,
    },
  },
  required: ['key', 'state', 'updatedAt'],
};

/**
 * RxDB Service
 * Provides IndexedDB-backed database for client-side persistence
 */
@Injectable({ providedIn: 'root' })
export class RxDBService {
  private db: RxDatabase | null = null;
  private initPromise: Promise<RxDatabase> | null = null;

  /**
   * Initialize the RxDB database with required collections
   * Returns singleton instance
   */
  async initDatabase(): Promise<RxDatabase> {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        this.db = await createRxDatabase({
          name: 'planyv2_client_db',
          storage: getRxStorageDexie(),
        });

        await this.db.addCollections({
          datagrid_states: {
            schema: datagridStateSchema,
          },
        });

        return this.db;
      } catch (error) {
        console.error('Failed to initialize RxDB:', error);
        this.initPromise = null;
        throw error;
      }
    })();

    return this.initPromise;
  }

  /**
   * Get a specific collection from the database
   */
  async getCollection(
    name: 'datagrid_states',
  ): Promise<RxCollection<DataGridStateDocument>> {
    const db = await this.initDatabase();
    return db.collections[name] as RxCollection<DataGridStateDocument>;
  }

  /**
   * Destroy the database (useful for cleanup/testing)
   */
  async destroy(): Promise<void> {
    if (this.db) {
      await this.db.remove();
      this.db = null;
      this.initPromise = null;
    }
  }
}
