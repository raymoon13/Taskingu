interface ImportMetaEnv {
  readonly SUPABASE_URL: string
  readonly SUPABASE_ANON_KEY: string
  readonly GEMINI_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}