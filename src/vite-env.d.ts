/// <reference types="vite/client" />

interface ViteTypeOptions {
    // By adding this line, you can make the type of ImportMetaEnv strict
    // to disallow unknown keys.
    strictImportMetaEnv: unknown
  }
  
  interface ImportMetaEnv {
    readonly SUPABASE_URL: string
    readonly SUPABASE_PUBLISHABLE_KEY: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }