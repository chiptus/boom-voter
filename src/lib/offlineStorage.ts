import { Artist, FestivalSet } from "@/services/queries";
import { openDB, IDBPDatabase } from "idb";

interface OfflineVote {
  id: string;
  setId: string;
  voteType: number;
  userId: string;
  timestamp: number;
  synced: boolean;
}

interface OfflineNote {
  id: string;
  setId: string; // New field for set-based notes
  content: string;
  userId: string;
  timestamp: number;
  synced: boolean;
}

export type OffineProfile = {
  created_at: string;
  email: string | null;
  id: string;
  username: string | null;
};

export type OfflineSetting = {
  action: "archive";
  artistId: string;
  timestamp: number;
  synced: boolean;
};

class OfflineStorageManager {
  private db: IDBPDatabase | null = null;
  private dbName = "festival-offline-db";
  private version = 2;

  async init(): Promise<void> {
    this.db = await openDB(this.dbName, this.version, {
      upgrade(db) {
        // Artists store
        if (!db.objectStoreNames.contains("artists")) {
          db.createObjectStore("artists", { keyPath: "id" });
        }

        // Sets store
        if (!db.objectStoreNames.contains("sets")) {
          db.createObjectStore("sets", { keyPath: "id" });
        }

        // Votes store
        if (!db.objectStoreNames.contains("votes")) {
          const votesStore = db.createObjectStore("votes", { keyPath: "id" });
          votesStore.createIndex("setId", "setId", { unique: false });
          votesStore.createIndex("synced", "synced", { unique: false });
        }

        // Notes store
        if (!db.objectStoreNames.contains("notes")) {
          const notesStore = db.createObjectStore("notes", { keyPath: "id" });
          notesStore.createIndex("setId", "setId", { unique: false });
          notesStore.createIndex("synced", "synced", { unique: false });
        }

        // Schedule store
        if (!db.objectStoreNames.contains("schedule")) {
          db.createObjectStore("schedule", { keyPath: "id" });
        }

        // Settings store
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
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
  async saveArtists(artists: Artist[]): Promise<void> {
    const db = await this.ensureDB();
    const tx = db.transaction("artists", "readwrite");
    const store = tx.objectStore("artists");
    await Promise.all(artists.map((artist) => store.put(artist)));
    await tx.done;
  }

  async getArtists(): Promise<Artist[]> {
    const db = await this.ensureDB();
    return db.getAll("artists");
  }

  async getArtist(id: string): Promise<Artist | null> {
    const db = await this.ensureDB();
    return db.get("artists", id);
  }

  // Sets methods
  async saveSets(sets: FestivalSet[]): Promise<void> {
    const db = await this.ensureDB();
    const tx = db.transaction("sets", "readwrite");
    const store = tx.objectStore("sets");
    await Promise.all(sets.map((set) => store.put(set)));
    await tx.done;
  }

  async getSets(): Promise<FestivalSet[]> {
    const db = await this.ensureDB();
    return db.getAll("sets");
  }

  async getSet(id: string): Promise<FestivalSet | null> {
    const db = await this.ensureDB();
    const set = await db.get("sets", id);

    if (!set) {
      return null;
    }

    // Get all votes for this set from offline storage
    const votes = await this.getVotes(id);

    // Transform offline votes to match server format
    const transformedVotes = votes.map((vote) => ({
      vote_type: vote.voteType,
      user_id: vote.userId,
    }));

    return {
      ...set,
      votes: transformedVotes,
    };
  }

  // Votes methods
  async saveVote(vote: Omit<OfflineVote, "id">): Promise<string> {
    const db = await this.ensureDB();
    const id = `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const voteWithId = { ...vote, id };
    await db.put("votes", voteWithId);
    return id;
  }

  async getVotes(setId?: string): Promise<OfflineVote[]> {
    const db = await this.ensureDB();
    if (setId) {
      const tx = db.transaction("votes", "readonly");
      const setIndex = tx.objectStore("votes").index("setId");
      return setIndex.getAll(setId);
    }
    return db.getAll("votes");
  }

  async getUnsyncedVotes(): Promise<OfflineVote[]> {
    const db = await this.ensureDB();
    const allVotes = await db.getAll("votes");
    return allVotes.filter((vote: OfflineVote) => !vote.synced);
  }

  async markVoteSynced(id: string): Promise<void> {
    const db = await this.ensureDB();
    const vote = await db.get("votes", id);
    if (vote) {
      await db.put("votes", { ...vote, synced: true });
    }
  }

  async deleteVote(id: string): Promise<void> {
    const db = await this.ensureDB();
    await db.delete("votes", id);
  }

  // Notes methods
  async saveNote(note: Omit<OfflineNote, "id">): Promise<string> {
    const db = await this.ensureDB();
    const id = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const noteWithId = { ...note, id };
    await db.put("notes", noteWithId);
    return id;
  }

  async getNotes(id?: string): Promise<OfflineNote[]> {
    const db = await this.ensureDB();
    if (id) {
      try {
        const tx = db.transaction("notes", "readonly");
        const setIndex = tx.objectStore("notes").index("setId");
        return setIndex.getAll(id);
      } catch (err) {
        return [];
      }
    }
    return db.getAll("notes");
  }

  async getUnsyncedNotes(): Promise<OfflineNote[]> {
    const db = await this.ensureDB();
    const allNotes = await db.getAll("notes");
    return allNotes.filter((note: OfflineNote) => !note.synced);
  }

  async markNoteSynced(id: string): Promise<void> {
    const db = await this.ensureDB();
    const note = await db.get("notes", id);
    if (note) {
      await db.put("notes", { ...note, synced: true });
    }
  }

  async deleteNote(id: string): Promise<void> {
    const db = await this.ensureDB();
    await db.delete("notes", id);
  }

  // Profile methods (secure offline caching)
  async saveProfile(userId: string, profile: OffineProfile): Promise<void> {
    const db = await this.ensureDB();
    // Only cache non-sensitive profile data
    const safeProfile = {
      id: profile.id,
      username: profile.username,
      email: profile.email, // Email is generally safe to cache
      created_at: profile.created_at,
      timestamp: Date.now(),
    };
    await db.put("settings", { key: `profile_${userId}`, value: safeProfile });
  }

  async getProfile(userId: string): Promise<OffineProfile> {
    const db = await this.ensureDB();
    const result = await db.get("settings", `profile_${userId}`);
    return result?.value;
  }

  async clearProfile(userId: string): Promise<void> {
    const db = await this.ensureDB();
    await db.delete("settings", `profile_${userId}`);
  }

  // Settings methods
  async saveSetting(key: string, value: OfflineSetting): Promise<void> {
    const db = await this.ensureDB();
    await db.put("settings", { key, value });
  }

  async getSetting(key: string): Promise<OfflineSetting> {
    const db = await this.ensureDB();
    const result = await db.get("settings", key);
    return result?.value;
  }

  // Group voting methods
  async getSetGroupVotes(
    setId: string,
    _groupId: string,
  ): Promise<
    Array<{
      vote_type: number;
      user_id: string;
      username: string | null;
    }>
  > {
    try {
      // Get all votes for this set
      const setVotes = await this.getVotes(setId);

      // For now, return all votes since we don't have group member filtering offline
      // In a real implementation, you'd also cache group member data
      return setVotes.map((vote) => ({
        vote_type: vote.voteType,
        user_id: vote.userId,
        username: null, // We don't store usernames in offline votes currently
      }));
    } catch (error) {
      console.error("Error fetching offline group votes:", error);
      return [];
    }
  }

  // Utility methods
  async clear(): Promise<void> {
    const db = await this.ensureDB();
    const tx = db.transaction(
      ["artists", "sets", "votes", "notes", "schedule", "settings"],
      "readwrite",
    );
    await Promise.all([
      tx.objectStore("artists").clear(),
      tx.objectStore("sets").clear(),
      tx.objectStore("votes").clear(),
      tx.objectStore("notes").clear(),
      tx.objectStore("schedule").clear(),
      tx.objectStore("settings").clear(),
    ]);
    await tx.done;
  }
}

export const offlineStorage = new OfflineStorageManager();
