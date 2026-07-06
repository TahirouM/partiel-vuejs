<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useEventsStore } from '../stores/events'
import SearchBar from '../components/SearchBar.vue'
import EventCard from '../components/EventCard.vue'
import BaseButton from '../components/BaseButton.vue'

const store = useEventsStore()
const { filteredEvents, loading, error, search, category } = storeToRefs(store)
const router = useRouter()

onMounted(() => {
  // On ne recharge pas si la liste est déjà en mémoire (store partagé).
  if (store.events.length === 0) store.loadEvents()
})

function goToDetail(id) {
  router.push({ name: 'event-detail', params: { id } })
}
</script>

<template>
  <section>
    <div class="header">
      <div>
        <h1>Événements</h1>
        <p class="subtitle">Consultez, filtrez et créez les événements de l'EEMI.</p>
      </div>
    </div>

    <SearchBar v-model:search="search" v-model:category="category" />

    <!-- État : chargement -->
    <div v-if="loading" class="state">Chargement des événements…</div>

    <!-- État : erreur -->
    <div v-else-if="error" class="state state--error">
      <p>{{ error }}</p>
      <BaseButton variant="ghost" @click="store.loadEvents">Réessayer</BaseButton>
    </div>

    <!-- État : vide -->
    <div v-else-if="filteredEvents.length === 0" class="state">
      Aucun événement ne correspond à votre recherche.
    </div>

    <!-- Liste des événements -->
    <div v-else class="grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event._id"
        :event="event"
        @select="goToDetail"
      />
    </div>
  </section>
</template>

<style scoped>
.header {
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
}

.subtitle {
  color: var(--muted);
  margin: 0.25rem 0 0;
}
</style>
