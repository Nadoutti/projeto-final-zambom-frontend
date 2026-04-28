/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EVENTS_API?: string;
  readonly VITE_TICKETS_API?: string;
  readonly VITE_USERS_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
