<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventsStore } from '../stores/events'
import BaseCard from '../components/BaseCard.vue'
import BaseButton from '../components/BaseButton.vue'
import { categoryLabel, formatDate } from '../constants'

const route = useRoute()
const router = useRouter()
const store = useEventsStore()

const event = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    event.value = await store.loadEvent(route.params.id)
    if (!event.value) error.value = 'Événement introuvable.'
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section>
    <BaseButton variant="ghost" @click="router.push('/')">← Retour</BaseButton>

    <div v-if="loading" class="state">Chargement…</div>
    <div v-else-if="error" class="state state--error">{{ error }}</div>

    <BaseCard v-else class="detail">
      <span class="badge">{{ categoryLabel(event.category) }}</span>
      <h1>{{ event.title }}</h1>
      <p class="meta">📅 {{ formatDate(event.date) }} · 📍 {{ event.location }}</p>
      <p class="desc">{{ event.description }}</p>

      <template #footer>
        <strong>{{ event.capacity }}</strong> places disponibles
      </template>
    </BaseCard>
  </section>
</template>

<style scoped>
.detail {
  margin-top: 1rem;
}

h1 {
  margin: 0.6rem 0 0.3rem;
}

.meta {
  color: var(--muted);
  margin: 0 0 1rem;
}

.desc {
  margin: 0;
  white-space: pre-line;
}
</style>
