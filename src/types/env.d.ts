/// <reference types="vite/client" />

// Variables de entorno públicas (prefijo VITE_): se incrustan en el bundle del navegador
interface ImportMetaEnv {
  readonly VITE_GITHUB_USER?: string
  readonly VITE_CONTACT_EMAIL?: string
  readonly VITE_LINKEDIN_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
