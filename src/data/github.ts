// Usuario de GitHub del portfolio (se define en .env como VITE_GITHUB_USER).
// El plugin de Vite lo lee por su cuenta con loadEnv (ver vite.config.ts).
export const githubUser = (import.meta.env.VITE_GITHUB_USER ?? '').trim()
