import { useState, useEffect, useCallback } from "react";
import { offlineStorage } from "@/lib/offlineStorage";
import { Artist } from "@/hooks/queries/artists/useArtists";
import { FestivalSet } from "@/hooks/queries/sets/useSets";
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      return setIsOnline(true);
    }
    function handleOffline() {
      return setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

export function useOfflineQueue() {
  const [queueSize, setQueueSize] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const updateQueueSize = useCallback(async () => {
    try {
      const [unsyncedVotes, unsyncedNotes] = await Promise.all([
        offlineStorage.getUnsyncedVotes(),
        offlineStorage.getUnsyncedNotes(),
      ]);
      setQueueSize(unsyncedVotes.length + unsyncedNotes.length);
    } catch (error) {
      console.error("Error updating queue size:", error);
    }
  }, []);

  const syncQueue = useCallback(async () => {
    if (syncing) return;

    setSyncing(true);
    try {
      // Get unsynced items
      const [unsyncedVotes, unsyncedNotes] = await Promise.all([
        offlineStorage.getUnsyncedVotes(),
        offlineStorage.getUnsyncedNotes(),
      ]);

      // Sync votes
      for (const vote of unsyncedVotes) {
        try {
          // Here you would sync with your backend
          // For now, we'll just mark as synced
          await offlineStorage.markVoteSynced(vote.id);
        } catch (error) {
          console.error("Error syncing vote:", error);
        }
      }

      // Sync notes
      for (const note of unsyncedNotes) {
        try {
          // Here you would sync with your backend
          // For now, we'll just mark as synced
          await offlineStorage.markNoteSynced(note.id);
        } catch (error) {
          console.error("Error syncing note:", error);
        }
      }

      await updateQueueSize();
    } catch (error) {
      console.error("Error syncing queue:", error);
    } finally {
      setSyncing(false);
    }
  }, [syncing, updateQueueSize]);

  useEffect(() => {
    updateQueueSize();
  }, [updateQueueSize]);

  return {
    queueSize,
    syncing,
    syncQueue,
    updateQueueSize,
  };
}

export function useOfflineData() {
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    async function initOfflineStorage() {
      try {
        await offlineStorage.init();
        setOfflineReady(true);
      } catch (error) {
        console.error("Error initializing offline storage:", error);
      }
    }

    initOfflineStorage();
  }, []);

  const saveArtistsOffline = useCallback(async (artists: Artist[]) => {
    try {
      await offlineStorage.saveArtists(artists);
    } catch (error) {
      console.error("Error saving artists offline:", error);
    }
  }, []);

  const getArtistsOffline = useCallback(async () => {
    try {
      return await offlineStorage.getArtists();
    } catch (error) {
      console.error("Error getting artists offline:", error);
      return [];
    }
  }, []);

  const saveSetsOffline = useCallback(async (artists: FestivalSet[]) => {
    try {
      await offlineStorage.saveSets(artists);
    } catch (error) {
      console.error("Error saving artists offline:", error);
    }
  }, []);

  const getSetsOffline = useCallback(async () => {
    try {
      return await offlineStorage.getSets();
    } catch (error) {
      console.error("Error getting artists offline:", error);
      return [];
    }
  }, []);

  return {
    offlineReady,
    saveArtistsOffline,
    getArtistsOffline,
    saveSetsOffline,
    getSetsOffline,
  };
}
