<script setup>
// Carte générique : gère l'apparence (fond, bordure, ombre).
// Le contenu est libre via le slot par défaut, plus un slot "footer" optionnel.
</script>

<template>
  <div class="card">
    <div class="card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card__body {
  padding: 1.25rem;
  flex: 1;
}

.card__footer {
  padding: 0.9rem 1.25rem;
  border-top: 1px solid var(--border);
  background: var(--bg);
}
</style>
