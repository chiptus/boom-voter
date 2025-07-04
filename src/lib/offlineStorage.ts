import { openDB, IDBPDatabase } from 'idb';

interface OfflineVote {
  id: string;
  artistId: string;
  voteType: number;
  userId: string;
  timestamp: number;
  synced: boolean;
}

interface OfflineNote {
  id: string;
  artistId: string;
  content: string;
  userId: string;
  timestamp: number;
  synced: boolean;
}

class OfflineStorageManager {
  private db: IDBPDatabase | null = null;
  private dbName = 'festival-offline-db';
  private version = 1;

  async init(): Promise<void> {
    this.db = await openDB(this.dbName, this.version, {
      upgrade(db) {
        // Artists store
        if (!db.objectStoreNames.contains('artists')) {
          db.createObjectStore('artists', { keyPath: 'id' });
        }

        // Votes store
        if (!db.objectStoreNames.contains('votes')) {
          const votesStore = db.createObjectStore('votes', { keyPath: 'id' });
          votesStore.createIndex('artistId', 'artistId', { unique: false });
          votesStore.createIndex('synced', 'synced', { unique: false });
        }

        // Notes store
        if (!db.objectStoreNames.contains('notes')) {
          const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
          notesStore.createIndex('artistId', 'artistId', { unique: false });
          notesStore.createIndex('synced', 'synced', { unique: false });
        }

        // Schedule store
        if (!db.objectStoreNames.contains('schedule')) {
          db.createObjectStore('schedule', { keyPath: 'id' });
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      },
    });
  }

  async ensureDB(): Promise<IDBPDatabase> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  // Artists methods
  async saveArtists(artists: any[]): Promise<void> {
    const db = await this.ensureDB();
    const tx = db.transaction('artists', 'readwrite');
    const store = tx.objectStore('artists');
    await Promise.all(artists.map(artist => store.put(artist)));
    await tx.done;
  }

  async getArtists(): Promise<any[]> {
    const db = await this.ensureDB();
    return db.getAll('artists');
  }

  async getArtist(id: string): Promise<any> {
    const db = await this.ensureDB();
    return db.get('artists', id);
  }

  // Votes methods
  async saveVote(vote: Omit<OfflineVote, 'id'>): Promise<string> {
    const db = await this.ensureDB();
    const id = `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const voteWithId = { ...vote, id };
    await db.put('votes', voteWithId);
    return id;
  }

  async getVotes(artistId?: string): Promise<OfflineVote[]> {
    const db = await this.ensureDB();
    if (artistId) {
      const tx = db.transaction('votes', 'readonly');
      const index = tx.objectStore('votes').index('artistId');
      return index.getAll(artistId);
    }
    return db.getAll('votes');
  }

  async getUnsyncedVotes(): Promise<OfflineVote[]> {
    const db = await this.ensureDB();
    const allVotes = await db.getAll('votes');
    return allVotes.filter((vote: OfflineVote) => !vote.synced);
  }

  async markVoteSynced(id: string): Promise<void> {
    const db = await this.ensureDB();
    const vote = await db.get('votes', id);
    if (vote) {
      await db.put('votes', { ...vote, synced: true });
    }
  }

  async deleteVote(id: string): Promise<void> {
    const db = await this.ensureDB();
    await db.delete('votes', id);
  }

  // Notes methods
  async saveNote(note: Omit<OfflineNote, 'id'>): Promise<string> {
    const db = await this.ensureDB();
    const id = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const noteWithId = { ...note, id };
    await db.put('notes', noteWithId);
    return id;
  }

  async getNotes(artistId?: string): Promise<OfflineNote[]> {
    const db = await this.ensureDB();
    if (artistId) {
      const tx = db.transaction('notes', 'readonly');
      const index = tx.objectStore('notes').index('artistId');
      return index.getAll(artistId);
    }
    return db.getAll('notes');
  }

  async getUnsyncedNotes(): Promise<OfflineNote[]> {
    const db = await this.ensureDB();
    const allNotes = await db.getAll('notes');
    return allNotes.filter((note: OfflineNote) => !note.synced);
  }

  async markNoteSynced(id: string): Promise<void> {
    const db = await this.ensureDB();
    const note = await db.get('notes', id);
    if (note) {
      await db.put('notes', { ...note, synced: true });
    }
  }

  async deleteNote(id: string): Promise<void> {
    const db = await this.ensureDB();
    await db.delete('notes', id);
  }

  // Schedule methods
  async saveSchedule(schedule: any): Promise<void> {
    const db = await this.ensureDB();
    await db.put('schedule', { id: 'current', data: schedule, timestamp: Date.now() });
  }

  async getSchedule(): Promise<any> {
    const db = await this.ensureDB();
    const result = await db.get('schedule', 'current');
    return result?.data;
  }

  // Settings methods
  async saveSetting(key: string, value: any): Promise<void> {
    const db = await this.ensureDB();
    await db.put('settings', { key, value });
  }

  async getSetting(key: string): Promise<any> {
    const db = await this.ensureDB();
    const result = await db.get('settings', key);
    return result?.value;
  }

  // Utility methods
  async clear(): Promise<void> {
    const db = await this.ensureDB();
    const tx = db.transaction(['artists', 'votes', 'notes', 'schedule', 'settings'], 'readwrite');
    await Promise.all([
      tx.objectStore('artists').clear(),
      tx.objectStore('votes').clear(),
      tx.objectStore('notes').clear(),
      tx.objectStore('schedule').clear(),
      tx.objectStore('settings').clear(),
    ]);
    await tx.done;
  }
}

export const offlineStorage = new OfflineStorageManager();