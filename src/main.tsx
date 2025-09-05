import { createRoot } from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App.tsx";
import "./index.css";

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
});

// Create a client with offline-first configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000, // 15 minutes - longer for offline support
      gcTime: 24 * 60 * 60 * 1000, // 24 hours - keep data longer for offline
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (
          "status" in error &&
          typeof error.status === "number" &&
          error?.status >= 400 &&
          error?.status < 500
        ) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true, // Refetch when coming back online
    },
    mutations: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister }}
  >
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </PersistQueryClientProvider>,
);
