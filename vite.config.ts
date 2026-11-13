import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { githubPinned } from './plugins/githubPinned.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Se cargan todas las variables de .env. Las que no tienen prefijo VITE_ (como GITHUB_TOKEN)
  // solo se leen acá, en Node, y nunca llegan al navegador.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), githubPinned({ usernames: [env.VITE_GITHUB_USER ?? ''], token: env.GITHUB_TOKEN })],
  }
})
