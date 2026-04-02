# Weekly Commit

App para planificar metas semanales con una cuadricula de lunes a sabado, control de duracion por actividad y seguimiento visual del progreso.

## Features

- Cuadricula semanal por actividad con check de dias completados.
- Duraciones predefinidas y totales por fila, por dia y semanal.
- Temas (`paper-planner`, `graphite`, `botanical-flow`) y modo claro/oscuro.
- Persistencia en `localStorage` (tema, apariencia y actividades validas).
- Suite de tests con **Vitest + Testing Library**:
  - 11 archivos de test
  - 57 tests pasando
  - cobertura de casos nominales y de excepcion (parseo invalido, SSR/no `window`, merge de estado persistido, drafts no persistibles, etc.)

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand
- Vitest + Testing Library

## Quickstart

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Scripts

- `npm run dev` - desarrollo
- `npm run build` - build de produccion
- `npm run start` - ejecutar build
- `npm run lint` - eslint
- `npm run test` - vitest en watch
- `npm run test:run` - vitest una sola corrida

## Notas

- Proyecto privado (`package.json`).
- Config principal de tests en `vitest.config.mts` y setup en `vitest.setup.ts`.
