import { ContactFooter } from "./components/ContactFooter/ContactFooter"
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

      {/* Contenido: hero a la izquierda, actividad de GitHub a la derecha y footer abajo */}
      <main className={styles.main}>
        <Hero className={styles.hero} />
        <aside className={styles.side}>
          <PinnedRepos username={githubUser} className={styles.repos} />
          <ContributionGraph username={githubUser} />
        </aside>
        <ContactFooter className={styles.footer} />
      </main>
    </>
  )
}
