/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TMDB_API_KEY: string;
  readonly TMDB_API_KEY: string;
  readonly JWT_SECRET: string;
  readonly DATABASE_URL: string;
  readonly SMTP_HOST: string;
  readonly SMTP_PORT: string;
  readonly SMTP_USER: string;
  readonly SMTP_PASS: string;
  readonly SMTP_FROM: string;
  readonly NODE_ENV: "development" | "production";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "$env/static/private" {
  export const JWT_SECRET: string;
  export const DATABASE_URL: string;
  export const TMDB_API_KEY: string;
  export const SMTP_HOST: string;
  export const SMTP_PORT: string;
  export const SMTP_USER: string;
  export const SMTP_PASS: string;
  export const SMTP_FROM: string;
  export const NODE_ENV: "development" | "production";
}

declare module "$env/static/public" {
  export const PUBLIC_TMDB_API_KEY: string;
}
