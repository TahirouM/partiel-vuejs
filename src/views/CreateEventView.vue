<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEventsStore } from '../stores/events'
import EventForm from '../components/EventForm.vue'

const store = useEventsStore()
const router = useRouter()

const submitting = ref(false)
const error = ref(null)

async function handleSubmit(payload) {
  submitting.value = true
  error.value = null
  try {
    const created = await store.addEvent(payload)
    // Redirection vers le détail de l'événement fraîchement créé.
    router.push({ name: 'event-detail', params: { id: created._id } })
  } catch (err) {
    error.value = err.message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="create">
    <h1>Créer un événement</h1>
    <p class="subtitle">Remplissez le formulaire pour ajouter un événement.</p>

    <div v-if="error" class="state state--error">{{ error }}</div>

    <EventForm :submitting="submitting" @submit="handleSubmit" />
  </section>
</template>

<style scoped>
.create {
  max-width: 640px;
}

h1 {
  margin: 0;
}

.subtitle {
  color: var(--muted);
  margin: 0.25rem 0 1.5rem;
}
</style>
