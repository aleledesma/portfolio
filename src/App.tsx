import { ContactFooter } from "./components/ContactFooter/ContactFooter"
import { DotMatrixBackground } from "./components/DotMatrixBackground/DotMatrixBackground"
import { Hero } from "./components/Hero/Hero"
import { Vignette } from "./components/Vignette/Vignette"
import styles from "./App.module.css"

// Layout principal: fondo animado + viñeta + contenido
export default function App() {
  return (
    <>
      {/* Capas de fondo */}
      <DotMatrixBackground blur={1.5} />
      <Vignette opacity={1} />

      {/* Contenido */}
      <main className={styles.main}>
        <Hero />
        <ContactFooter />
      </main>
    </>
  )
}
