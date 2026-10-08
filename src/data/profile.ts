import type { BrandIconName } from "./brandIcons"

// Contenido del portfolio: editar acá para cambiar textos, etiquetas y enlaces

export interface Tag {
  id: string
  name: string
  icon: BrandIconName // logo definido en brandIcons.ts
  logoOnly?: boolean // el logo ya incluye el nombre: se oculta el texto
}

export interface ContactLink {
  label: string
  href: string
  external?: boolean
}

export const profile = {
  name: "Alejo Ledesma",
  role: "Desarrollador de Software",
  title: "Analista de Sistemas",
  bio: "Construyo software claro, escalable y bien pensado. Me interesa el punto donde la arquitectura se encuentra con el detalle: productos simples de usar y sólidos por dentro.",
}

export const tags: Tag[] = [
  { id: "aws", name: "AWS", icon: "aws", logoOnly: true },
  { id: "next", name: "Next.js", icon: "nextjs" },
  { id: "ci", name: "CI/CD", icon: "githubActions" },
]

export const contactLinks: ContactLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/alejoledesma/",
    external: true,
  },
  { label: "Email", href: "mailto:aleledesma1212@gmail.com" },
]

export const githubUrl = "https://github.com/aleledesma"
