import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'tdk_nihongo_db';
const DB_VERSION = 1;
const STORE_NAME = 'keyval';

// Check if IndexedDB is available in the current browser/runtime environment
const isIndexedDBSupported =
  typeof window !== 'undefined' &&
  typeof window.indexedDB !== 'undefined';

// In-memory cache layer (Map) to eliminate redundant disk I/O and support instant reads
const memoryCache = new Map<string, any>();

let dbPromise: Promise<IDBPDatabase | null> | null = null;

/**
 * Lazily open and cache the IndexedDB database instance with safety error handlers.
 */
export async function getDB(): Promise<IDBPDatabase | null> {
  if (!isIndexedDBSupported) {
    return null;
  }

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    }).catch((error) => {
      console.warn('[IndexedDB] Could not open database (private mode or cookies restricted):', error);
      return null;
    });
  }

  return dbPromise;
}

/**
 * Retrieve an item from storage.
 * Reads from in-memory cache first, then fetches from IndexedDB if not cached.
 */
export async function getItem<T = any>(key: string): Promise<T | null> {
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }

  try {
    const db = await getDB();
    if (!db) {
      return null;
    }
    const val = (await db.get(STORE_NAME, key)) as T | undefined;
    if (val !== undefined) {
      memoryCache.set(key, val);
      return val;
    }
    return null;
  } catch (error) {
    console.warn(`[IndexedDB] Error reading key "${key}":`, error);
    return null;
  }
}

/**
 * Store an item in storage.
 * Stores directly as native Objects, Arrays, Numbers, or Blobs without manual JSON.stringify.
 * Immediately updates in-memory cache and asynchronously persists to IndexedDB.
 */
export async function setItem<T = any>(key: string, value: T): Promise<void> {
  memoryCache.set(key, value);

  try {
    const db = await getDB();
    if (db) {
      await db.put(STORE_NAME, value, key);
    }
  } catch (error) {
    console.warn(`[IndexedDB] Error writing key "${key}":`, error);
  }
}

/**
 * Remove an item from storage.
 */
export async function removeItem(key: string): Promise<void> {
  memoryCache.delete(key);

  try {
    const db = await getDB();
    if (db) {
      await db.delete(STORE_NAME, key);
    }
  } catch (error) {
    console.warn(`[IndexedDB] Error removing key "${key}":`, error);
  }
}

/**
 * Clear all items from the store and in-memory cache.
 */
export async function clear(): Promise<void> {
  memoryCache.clear();

  try {
    const db = await getDB();
    if (db) {
      await db.clear(STORE_NAME);
    }
  } catch (error) {
    console.warn('[IndexedDB] Error clearing database:', error);
  }
}

/**
 * Batch write multiple key-value pairs in a single transaction for maximum performance.
 */
export async function setMany(entries: Array<[string, any]>): Promise<void> {
  for (const [key, val] of entries) {
    memoryCache.set(key, val);
  }

  try {
    const db = await getDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      await Promise.all([
        ...entries.map(([k, v]) => tx.store.put(v, k)),
        tx.done,
      ]);
    }
  } catch (error) {
    console.warn('[IndexedDB] Error in batch write:', error);
  }
}

/**
 * Synchronous in-memory cache accessor for keystroke-level instant reads.
 */
export function getCachedItem<T = any>(key: string): T | undefined {
  return memoryCache.get(key) as T | undefined;
}

/**
 * Synchronous in-memory cache setter.
 */
export function setCachedItem<T = any>(key: string, value: T): void {
  memoryCache.set(key, value);
}

/**
 * Automatic migration helper: Transfers legacy localStorage data to IndexedDB,
 * clears the old localStorage keys, and sets the migration_completed flag.
 */
export async function migrateFromLocalStorage(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const localMigrationFlag = localStorage.getItem('tdk_migration_completed');
    if (localMigrationFlag === 'true') {
      return false;
    }

    const dbMigrationFlag = await getItem<boolean>('migration_completed');
    if (dbMigrationFlag) {
      localStorage.setItem('tdk_migration_completed', 'true');
      return false;
    }

    const legacySettingsKey = 'flick_lab_settings_v1';
    const legacyProgressKey = 'flick_lab_progress_v1';

    const rawSettings = localStorage.getItem(legacySettingsKey);
    const rawProgress = localStorage.getItem(legacyProgressKey);

    const batchEntries: Array<[string, any]> = [];

    if (rawSettings) {
      try {
        const parsedSettings = JSON.parse(rawSettings);
        batchEntries.push([legacySettingsKey, parsedSettings]);
      } catch {}
    }

    if (rawProgress) {
      try {
        const parsedProgress = JSON.parse(rawProgress);
        batchEntries.push([legacyProgressKey, parsedProgress]);
      } catch {}
    }

    batchEntries.push(['migration_completed', true]);

    if (batchEntries.length > 0) {
      await setMany(batchEntries);
    }

    // Clean up old localStorage keys after successful transfer
    localStorage.removeItem(legacySettingsKey);
    localStorage.removeItem(legacyProgressKey);
    localStorage.setItem('tdk_migration_completed', 'true');

    return true;
  } catch (error) {
    console.warn('[Migration] Failed migrating localStorage to IndexedDB:', error);
    return false;
  }
}
