import { ContactCta } from "./components/ContactCta/ContactCta"
import { ContributionGraph } from "./components/ContributionGraph/ContributionGraph"
import { DotMatrixBackground } from "./components/DotMatrixBackground/DotMatrixBackground"
import { Hero } from "./components/Hero/Hero"
import { PinnedRepos } from "./components/PinnedRepos/PinnedRepos"
import { Vignette } from "./components/Vignette/Vignette"
import { githubUser } from "./data/github"
import styles from "./App.module.css"

// Layout principal: fondo animado + viñeta + contenido
export default function App() {
  return (
    <>
      {/* Capas de fondo */}
      <DotMatrixBackground blur={1.5} />
      <Vignette opacity={1} />

      {/* Contenido: arriba hero + repos; abajo contacto + contribuciones */}
      <main className={styles.main}>
        <Hero className={styles.hero} />
        {/* Las secciones de GitHub solo se muestran si hay usuario configurado */}
        {githubUser && <PinnedRepos username={githubUser} className={styles.repos} />}
        <ContactCta className={styles.contact} />
        {githubUser && <ContributionGraph username={githubUser} className={styles.contributions} />}
      </main>
    </>
  )
}
