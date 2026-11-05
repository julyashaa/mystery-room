# MYSTERY ROOM

Cinematic Russian-language detective landing page, built with React 19, TypeScript, Vite, Tailwind CSS 4, Motion for React, Lucide, and React Router.

## Run

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Deploy `dist/` to any static host. Configure an SPA rewrite to `index.html` so directly opening `/case/404` works.

## Structure

- `src/App.tsx`: investigation explanation, featured evidence, placeholder, and routing.
- `src/components/HotelHero.tsx`: staggered introduction, dust, and cinematic hotel entrance.
- `src/components/HotelDoors.tsx`: room metadata, accessible door interactions, 3D opening, and completion-driven navigation.
- `src/hotel.css`: door architecture, brass hardware, lighting, responsive hotel styling.
- `src/components/UI.tsx`: navigation, footer, reveal, CTA, image fallback.
- `src/styles.css`: visual system, responsive layout, reduced-motion support.
- `public/images/hero.png`: original generated cinematic artwork.

Only case 404 has a route. Gameplay is deliberately a clearly labeled placeholder. Rooms 207 and 313 are marked “Скоро”; their doors reveal teasers without navigating. No backend or account is required.

Fonts load from Google Fonts with local serif/sans-serif fallbacks. All current imagery is local. Space Mono provides archival labels. Hero artwork is original AI-generated imagery, not a film still. Gradient overlays are used only for photographic shading and readability.

## Interaction checks

1. Click **Войти в отель**: the corridor image moves inward, a short transition covers the scroll, and focus lands on the door gallery heading.
2. Hover or Tab to a door: its light and plaque brighten, its handle turns, and the panel opens slightly.
3. Click room **404** or **Повернуть ключ** (Enter/Space also work): the door rotates on its left hinge, exposes red light, then routes to `/case/404` after animation completion. Repeat input is guarded during opening.
4. Tap rooms **207** and **313**: reveal their atmosphere and teaser without leaving the gallery. Their coming-soon status stays visible.
5. At mobile widths, doors stack vertically and teasers remain readable without hover.
6. Enable system **Reduce motion**: entrances and navigation happen immediately, 3D door movement and dust are disabled.

No Three.js, additional dependencies, backend, or gameplay were introduced.
