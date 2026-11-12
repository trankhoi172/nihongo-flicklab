import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'tdk_nihongo_db';
const DB_VERSION = 1;
const STORE_NAME = 'keyval';

// Check if IndexedDB is available in the current browser/runtime environment
export const isIndexedDBSupported =
  typeof window !== 'undefined' &&
  typeof window.indexedDB !== 'undefined';

// In-memory cache layer (Map) to eliminate redundant disk I/O and support instant synchronous reads
const memoryCache = new Map<string, any>();

/**
 * Synchronously populate memoryCache from localStorage.
 * Runs on module load for instant 0ms F5 hydration.
 */
export function populateMemoryCacheFromLocalStorage(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('flick_lab_') || k.startsWith('tdk_'))) {
          const raw = localStorage.getItem(k);
          if (raw) {
            try {
              memoryCache.set(k, JSON.parse(raw));
            } catch {
              memoryCache.set(k, raw);
            }
          }
        }
      }
    } catch {}
  }
}

// Initial populate on load
populateMemoryCacheFromLocalStorage();

/**
 * Clears the in-memory cache (useful for testing F5 refresh simulations).
 */
export function clearMemoryCache(): void {
  memoryCache.clear();
}

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
 * Priority: 1. Memory Cache -> 2. IndexedDB -> 3. LocalStorage fallback.
 */
export async function getItem<T = any>(key: string): Promise<T | null> {
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }

  // 1. Try reading from IndexedDB
  try {
    const db = await getDB();
    if (db) {
      const val = (await db.get(STORE_NAME, key)) as T | undefined;
      if (val !== undefined && val !== null) {
        memoryCache.set(key, val);
        // Sync to localStorage as synchronous backup
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
          } catch {}
        }
        return val;
      }
    }
  } catch (error) {
    console.warn(`[IndexedDB] Error reading key "${key}":`, error);
  }

  // 2. Fallback to localStorage if IndexedDB had no value
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          memoryCache.set(key, parsed);
          return parsed as T;
        } catch {
          memoryCache.set(key, raw);
          return raw as unknown as T;
        }
      }
    } catch {}
  }

  return null;
}

/**
 * Store an item in storage.
 * Writes to memory cache + localStorage (instant sync backup) + IndexedDB (deep persistent storage).
 */
export async function setItem<T = any>(key: string, value: T): Promise<void> {
  memoryCache.set(key, value);

  // 1. Synchronously persist to localStorage as immediate F5 protection
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch {}
  }

  // 2. Persist to IndexedDB
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
 * Remove an item from memory cache, localStorage, and IndexedDB.
 */
export async function removeItem(key: string): Promise<void> {
  memoryCache.delete(key);

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(key);
    } catch {}
  }

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

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem('flick_lab_settings_v1');
      localStorage.removeItem('flick_lab_progress_v1');
      localStorage.removeItem('tdk_migration_completed');
    } catch {}
  }

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
 * Batch write multiple key-value pairs.
 */
export async function setMany(entries: Array<[string, any]>): Promise<void> {
  for (const [key, val] of entries) {
    memoryCache.set(key, val);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
      } catch {}
    }
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
 * Automatic migration helper: Ensures legacy localStorage data is securely mirrored into IndexedDB.
 */
export async function migrateFromLocalStorage(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    if (localStorage.getItem('tdk_migration_completed') === 'true') {
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
        memoryCache.set(legacySettingsKey, parsedSettings);
      } catch {}
    }

    if (rawProgress) {
      try {
        const parsedProgress = JSON.parse(rawProgress);
        batchEntries.push([legacyProgressKey, parsedProgress]);
        memoryCache.set(legacyProgressKey, parsedProgress);
      } catch {}
    }

    batchEntries.push(['tdk_migration_completed', true]);
    localStorage.setItem('tdk_migration_completed', 'true');

    if (batchEntries.length > 0) {
      await setMany(batchEntries);
    }

    return true;
  } catch (error) {
    console.warn('[Migration] Failed syncing localStorage with IndexedDB:', error);
    return false;
  }
}
