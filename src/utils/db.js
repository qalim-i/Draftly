import { openDB } from 'idb';

const DB_NAME = 'draftly-db';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Habits store
      if (!db.objectStoreNames.contains('habits')) {
        db.createObjectStore('habits', { keyPath: 'id' });
      }

      // Habit records store: { habitId, date, completed }
      // distinct from local storage structure, we will store individual completion records
      if (!db.objectStoreNames.contains('habit_records')) {
        const store = db.createObjectStore('habit_records', { keyPath: ['habitId', 'date'] });
        store.createIndex('by-habit', 'habitId');
        store.createIndex('by-date', 'date');
      }

      // Calendar events store
      if (!db.objectStoreNames.contains('events')) {
        db.createObjectStore('events', { keyPath: 'id' });
      }

      // Notes/Editor store
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }
    },
  });
};

export const dbRequest = async (storeName, mode, callback) => {
  const db = await initDB();
  const tx = db.transaction(storeName, mode);
  const store = tx.objectStore(storeName);
  const result = await callback(store);
  await tx.done;
  return result;
};

// Generic Helpers
export const getAll = async (storeName) => {
  return dbRequest(storeName, 'readonly', (store) => store.getAll());
};

export const getById = async (storeName, id) => {
  return dbRequest(storeName, 'readonly', (store) => store.get(id));
};

export const putItem = async (storeName, item) => {
  return dbRequest(storeName, 'readwrite', (store) => store.put(item));
};

export const deleteItem = async (storeName, id) => {
  return dbRequest(storeName, 'readwrite', (store) => store.delete(id));
};

// Specific Helpers for Habit Records to match existing logic
export const getHabitRecordsObj = async () => {
  // Convert flat records back to nested object structure needed by context
  // { [habitId]: { [date]: true } }
  const records = await getAll('habit_records');
  const recordsObj = {};

  records.forEach(r => {
    if (!recordsObj[r.habitId]) {
      recordsObj[r.habitId] = {};
    }
    recordsObj[r.habitId][r.date] = true;
  });

  return recordsObj;
};

export const toggleHabitRecordInDb = async (habitId, date, isCompleted) => {
  const db = await initDB();
  const tx = db.transaction('habit_records', 'readwrite');
  const store = tx.objectStore('habit_records');

  if (isCompleted) {
    await store.put({ habitId, date, completed: true });
  } else {
    await store.delete([habitId, date]);
  }

  await tx.done;
};
