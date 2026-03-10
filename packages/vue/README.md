# @zynq/vue

Synchronize application state with the URL in Vue 3 apps using composables and Vue Router. Keep filters, pagination, search, and other UI state in the query string so users can share and bookmark links.

## Requirements

- **Vue** ^3.0.0
- **Vue Router** ^4.0.0

## Installation

```bash
npm install @zynq/vue
# or
pnpm add @zynq/vue
# or
yarn add @zynq/vue
```

Install Vue and Vue Router if you don't have them yet:

```bash
npm install vue vue-router
```

## Quick start

1. Define a schema with the `s` builders and call `useZynq(schema)` inside a component that has access to the router (e.g. under `<RouterView>` or where `useRouter()` works).

2. The returned `state` is reactive and stays in sync with the URL: when the user changes the URL (or back/forward), state updates; when you change `state`, the URL updates (via `replaceState` by default).

```vue
<script setup lang="ts">
import { useZynq, s } from '@zynq/vue';

const schema = {
  name: s.string(),
  count: s.number(0),
  active: s.boolean(true),
};

const { state } = useZynq(schema);
</script>

<template>
  <div>
    <input v-model="state.name" placeholder="Name" />
    <input v-model.number="state.count" type="number" />
    <label>
      <input v-model="state.active" type="checkbox" />
      Active
    </label>
  </div>
</template>
```

Visiting `/?name=foo&count=10&active=false` will set `state` to `{ name: 'foo', count: 10, active: false }`. Changing `state` in the UI will update the query string without full page reloads.

## API

### `useZynq(schema)`

- **Parameters:** `schema` – object of keys to codecs (e.g. from `s.string()`, `s.number()`, `s.boolean()`, `s.object()`).
- **Returns:** `{ state }` – reactive object whose keys match the schema and stay synced with the URL query.

Must be called in a component that runs in a Vue Router context (so `useRouter()` and `useRoute()` are available).

### Schema builders (`s`)

Included in this package for convenience:

- `s.string(default?)` – string with optional default
- `s.number(default?)` – number with optional default
- `s.boolean(default?)` – boolean with optional default
- `s.object(shape)` – nested object; `shape` is a schema (same codecs). Encoded as a single JSON query param.

### `VueRouterAdapter`

Adapter that implements Zynq’s router interface using Vue Router. Used internally by `useZynq`; you typically don’t need to use it directly unless you’re building custom integration.

### Types

- `Schema` – schema shape
- `InferState<S>` – inferred state type from schema `S`

## Building

This package is built with [tsup](https://tsup.egoist.dev/). From the repo root (monorepo) or package directory:

```bash
pnpm build
# or
pnpm --filter @zynq/vue build
```

Output is emitted to `dist/` (ESM, CJS, and type declarations). Vue and Vue Router are external and not bundled.

## License

MIT
