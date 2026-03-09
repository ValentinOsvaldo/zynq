<script setup lang="ts">
import { s, useSynq } from '@synq/vue'

const filterSchema = {
  search: s.string(''),
  page: s.number(1),
  tags: s.array(s.string(), []),
  isAdmin: s.boolean(false),
}

const { state } = useSynq(filterSchema)

const addTag = () => state.tags.push('new-tag')
const nextPage = () => state.page++
</script>

<template>
  <div style="padding: 2rem; font-family: sans-serif">
    <h1>🧪 Synq Playground</h1>

    <section>
      <label>Buscar: </label>
      <input v-model="state.search" placeholder="Escribe algo..." />
    </section>

    <section style="margin-top: 1rem">
      <p>
        Página actual: <strong>{{ state.page }}</strong>
      </p>
      <button @click="nextPage">Siguiente Página</button>
    </section>

    <section style="margin-top: 1rem">
      <p>Tags: {{ state.tags }}</p>
      <button @click="addTag">Añadir Tag</button>
      <button @click="state.tags = []">Limpiar Tags</button>
    </section>

    <section style="margin-top: 1rem">
      <label>Is Admin: </label>
      <input v-model="state.isAdmin" type="checkbox" />
    </section>

    <hr style="margin: 2rem 0" />

    <div style="background: #f4f4f4; padding: 1rem; border-radius: 8px">
      <h3>Estado Interno (JS):</h3>
      <pre>{{ state }}</pre>

      <h3>URL Real:</h3>
      <code>{{ $route.fullPath }}</code>
    </div>
  </div>
</template>
