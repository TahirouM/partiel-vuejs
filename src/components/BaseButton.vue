<script setup>
// Bouton générique réutilisable. Le contenu passe par un slot.
defineProps({
  variant: { type: String, default: 'primary' }, // primary | ghost | danger
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <button :type="type" :disabled="disabled" :class="['btn', `btn--${variant}`]">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  border: 1px solid transparent;
  border-radius: 8px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, opacity 0.15s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--primary {
  background: var(--primary);
  color: #fff;
}

.btn--primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn--ghost {
  background: transparent;
  border-color: var(--border);
  color: var(--text);
}

.btn--ghost:hover:not(:disabled) {
  background: var(--bg);
}

.btn--danger {
  background: var(--danger);
  color: #fff;
}
</style>
