export interface Cache {
  read: (key: string) => Promise<string | null>;
  write: (key: string, value: string) => Promise<void>;
  flush: () => Promise<void>;
}
