/// <reference types="vite/client" />

export {};

// Global env typings for client
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_DEV_SERVER_PORT?: string;
    readonly VITE_APP_TITLE?: string;
    // add other VITE_... vars here
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
