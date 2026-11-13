import type { BrandIconName } from "./brandIcons"
import { githubUser } from "./github"

// Contenido del portfolio: editar acá para cambiar textos, etiquetas y enlaces

export interface Tag {
  id: string
  name: string
  icon: BrandIconName // logo definido en brandIcons.ts
  logoOnly?: boolean // el logo ya incluye el nombre: se oculta el texto
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

// Datos de contacto: se definen en .env (ver .env.example). Si falta alguno, su enlace no se muestra.
export const contact = {
  email: (import.meta.env.VITE_CONTACT_EMAIL ?? "").trim(),
  emailSubject: "Proyecto desde tu portfolio", // asunto precargado del botón principal
  linkedinUrl: (import.meta.env.VITE_LINKEDIN_URL ?? "").trim(),
  githubUrl: githubUser ? `https://github.com/${githubUser}` : "",
}

// Textos del banner de contacto
export const contactCta = {
  title: "¿Tenés un proyecto en mente?",
  action: "Escribime",
}
