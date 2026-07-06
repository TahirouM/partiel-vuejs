<script setup>
import BaseCard from './BaseCard.vue'
import BaseButton from './BaseButton.vue'
import { categoryLabel, formatDate } from '../constants'

// L'événement à afficher est reçu du parent via une prop.
defineProps({
  event: { type: Object, required: true },
})

// On remonte au parent l'événement sélectionné via un emit.
const emit = defineEmits(['select'])
</script>

<template>
  <BaseCard>
    <span class="badge">{{ categoryLabel(event.category) }}</span>
    <h3 class="title">{{ event.title }}</h3>
    <p class="meta">📅 {{ formatDate(event.date) }} · 📍 {{ event.location }}</p>
    <p class="desc">{{ event.description }}</p>

    <template #footer>
      <div class="footer">
        <span class="capacity">{{ event.capacity }} places</span>
        <BaseButton variant="ghost" @click="emit('select', event._id)">
          Voir le détail →
        </BaseButton>
      </div>
    </template>
  </BaseCard>
</template>

<style scoped>
.title {
  margin: 0.6rem 0 0.3rem;
  font-size: 1.15rem;
}

.meta {
  color: var(--muted);
  font-size: 0.85rem;
  margin: 0 0 0.6rem;
}

.desc {
  margin: 0;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.capacity {
  font-size: 0.85rem;
  color: var(--muted);
}
</style>
