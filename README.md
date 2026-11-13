# Portfolio — Alejo Ledesma

Portfolio personal: una landing de una sola pantalla con presentación, proyectos destacados de GitHub, calendario de contribuciones y contacto.

## Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) como bundler y servidor de desarrollo
- CSS Modules, sin librerías de UI
- [oxlint](https://oxc.rs) para el linting

## Características

- **Fondo de matriz de puntos**: curvas de nivel generadas con ruido simplex 3D sobre `<canvas>`, que reaccionan al puntero. El motor (`src/lib/dotMatrix`) no depende de React.
- **Repos fijados de GitHub**: un plugin de Vite (`plugins/githubPinned.ts`) consulta la API GraphQL de GitHub durante el build y expone los datos como módulo virtual (`virtual:github-pinned`). El token se usa solo en Node y nunca llega al navegador.
- **Calendario de contribuciones**: se obtiene en el cliente desde [github-contributions-api](https://github.com/grubersjoe/github-contributions-api), sin necesidad de token.

## Empezar

Requisitos: Node.js 20.19+ o 22.12+.

```bash
npm install
cp .env.example .env   # y completar los valores
npm run dev
```

### Variables de entorno

Todas son opcionales: si alguna falta, la sección o el enlace correspondiente no se muestra.

| Variable             | Descripción                                                                         |
| -------------------- | ----------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`       | Token *fine-grained* de solo lectura a repos públicos. Solo se usa en el build.     |
| `VITE_GITHUB_USER`   | Usuario de GitHub: repos fijados, calendario de contribuciones y enlace al perfil.  |
| `VITE_CONTACT_EMAIL` | Email del botón de contacto.                                                        |
| `VITE_LINKEDIN_URL`  | URL completa del perfil de LinkedIn.                                                |

> Las variables con prefijo `VITE_` se incluyen en el sitio publicado, así que no deben contener secretos.

## Scripts

| Comando           | Descripción                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Servidor de desarrollo                    |
| `npm run build`   | Chequeo de tipos y build de producción    |
| `npm run preview` | Sirve el build localmente                 |
| `npm run lint`    | Linting con oxlint                        |

## Estructura

```
plugins/            Plugin de Vite para los repos fijados
src/
  components/       Componentes de UI (cada uno con su CSS Module)
  data/             Contenido editable: perfil, etiquetas y textos
  hooks/            Hooks de React
  lib/dotMatrix/    Motor del fondo animado
  services/         Clientes de APIs externas
  styles/           Estilos y variables globales
  types/            Tipos compartidos
```

Para adaptar el contenido, los textos y las tecnologías se editan en `src/data/profile.ts`; el usuario de GitHub y los datos de contacto, en `.env`.
