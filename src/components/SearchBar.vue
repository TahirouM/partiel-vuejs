<script setup>
import { CATEGORIES } from '../constants'

// Deux v-model : un pour la recherche texte, un pour la catégorie.
const search = defineModel('search', { type: String, default: '' })
const category = defineModel('category', { type: String, default: '' })
</script>

<template>
  <div class="searchbar">
    <input
      v-model="search"
      type="search"
      class="searchbar__input"
      placeholder="Rechercher un événement…"
    />
    <select v-model="category" class="searchbar__select">
      <option value="">Toutes les catégories</option>
      <option v-for="c in CATEGORIES" :key="c.value" :value="c.value">
        {{ c.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.searchbar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
}

@media (min-width: 640px) {
  .searchbar {
    flex-direction: row;
  }
}

.searchbar__input {
  flex: 1;
}

.searchbar__input,
.searchbar__select {
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font: inherit;
  background: var(--surface);
  color: var(--text);
}

.searchbar__input:focus,
.searchbar__select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft);
}
</style>
