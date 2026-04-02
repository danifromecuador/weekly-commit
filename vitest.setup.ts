import "@testing-library/jest-dom/vitest";

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.get(String(key)) ?? null;
    },
    setItem(key: string, value: string) {
      map.set(String(key), String(value));
    },
    removeItem(key: string) {
      map.delete(String(key));
    },
    key(index: number) {
      return [...map.keys()][index] ?? null;
    },
  };
}

const memoryStorage = createMemoryStorage();
Object.defineProperty(globalThis, "localStorage", {
  value: memoryStorage,
  configurable: true,
  writable: true,
});
if (typeof globalThis.window !== "undefined") {
  Object.defineProperty(globalThis.window, "localStorage", {
    value: memoryStorage,
    configurable: true,
    writable: true,
  });
}
