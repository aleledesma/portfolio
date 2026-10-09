import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { githubPinned } from './plugins/githubPinned.ts'
import { githubUser } from './src/data/github.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Variables sin prefijo VITE_: solo se leen acá (Node) y nunca llegan al navegador
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), githubPinned({ usernames: [githubUser], token: env.GITHUB_TOKEN })],
  }
})
