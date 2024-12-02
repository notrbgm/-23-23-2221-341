/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
declare global {
  namespace App {
    interface Error {
      message: string;
      code?: string;
    }
    interface Locals {
      user: {
        id: number;
        username: string;
        email: string;
        isAdmin: boolean;
      } | null;
    }
    interface PageData {
      user: {
        id: number;
        username: string;
        email: string;
        isAdmin: boolean;
      } | null;
    }
    interface Platform {}
  }

  namespace NodeJS {
    interface ProcessEnv {
      TMDB_API_KEY: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }
}

export {};
