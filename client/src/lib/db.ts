import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Photo, photoSchema } from '@shared/schema';

interface PhotoDB extends DBSchema {
  photos: {
    key: string;
    value: Photo;
    indexes: {
      'by-created': Date;
      'by-expires': Date;
    };
  };
}

let db: IDBPDatabase<PhotoDB>;

export async function initDB() {
  db = await openDB<PhotoDB>('photo-app', 1, {
    upgrade(db) {
      const photoStore = db.createObjectStore('photos', { keyPath: 'id' });
      photoStore.createIndex('by-created', 'createdAt');
      photoStore.createIndex('by-expires', 'expiresAt');
    },
  });

  // Clean up expired photos
  const now = new Date();
  const tx = db.transaction('photos', 'readwrite');
  const store = tx.objectStore('photos');
  const index = store.index('by-expires');
  const expiredPhotos = await index.getAllKeys(IDBKeyRange.upperBound(now));
  await Promise.all(expiredPhotos.map(id => store.delete(id)));
  await tx.done;
}

export async function savePhoto(imageData: string): Promise<Photo> {
  if (!db) {
    throw new Error('Database not initialized');
  }

  const photo: Photo = {
    id: crypto.randomUUID(),
    imageData,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
  };

  await db.put('photos', photo);
  return photo;
}

export async function getPhotosByDate(date: Date): Promise<Photo[]> {
  if (!db) {
    throw new Error('Database not initialized');
  }

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const tx = db.transaction('photos', 'readonly');
  const index = tx.objectStore('photos').index('by-created');
  return index.getAll(IDBKeyRange.bound(start, end));
}

export async function getAllPhotos(): Promise<Photo[]> {
  if (!db) {
    throw new Error('Database not initialized');
  }

  const tx = db.transaction('photos', 'readonly');
  const index = tx.objectStore('photos').index('by-created');
  return index.getAll();
}