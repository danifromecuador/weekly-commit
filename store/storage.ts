import type { StateStorage } from "zustand/middleware";

/** SSR / no-window: persist skips I/O until the client hydrates. */
export const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
