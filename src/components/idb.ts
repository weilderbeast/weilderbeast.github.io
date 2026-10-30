export class IDBCache<T = unknown> {
  private name: string;
  private ttl: number;
  private store: string = "entries";
  private dbPromise?: Promise<IDBDatabase>;

  constructor(name: string, ttl = 24 * 60 * 60 * 1000, store = "entries") {
    this.name = name;
    this.ttl = ttl;
    this.store = store;
  }

  private db(): Promise<IDBDatabase> {
    return (this.dbPromise ??= new Promise((resolve, reject) => {
      const req = indexedDB.open(this.name, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(this.store);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }));
  }

  private async run<R>(
    mode: IDBTransactionMode,
    fn: (s: IDBObjectStore) => IDBRequest<R>,
  ): Promise<R> {
    const db = await this.db();
    return new Promise((resolve, reject) => {
      const req = fn(db.transaction(this.store, mode).objectStore(this.store));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async get(key: string): Promise<T | undefined> {
    const entry = await this.run<{ value: T; at: number } | undefined>(
      "readonly",
      (s) => s.get(key),
    );
    return entry && Date.now() - entry.at < this.ttl ? entry.value : undefined;
  }

  async set(key: string, value: T): Promise<void> {
    await this.run("readwrite", (s) => s.put({ value, at: Date.now() }, key));
  }

  async delete(key: string): Promise<void> {
    await this.run("readwrite", (s) => s.delete(key));
  }

  async clear(): Promise<void> {
    await this.run("readwrite", (s) => s.clear());
  }

  async fetch(
    key: string,
    loader: () => Promise<T>,
    force = false,
  ): Promise<T> {
    if (!force) {
      const hit = await this.get(key);
      if (hit !== undefined) return hit;
    }
    const value = await loader();
    await this.set(key, value);
    return value;
  }
}
