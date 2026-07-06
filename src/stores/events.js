import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchEvents, fetchEventById, createEvent } from '../services/api'

export const useEventsStore = defineStore('events', () => {
  // --- State ---
  const events = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Filtres pilotés par l'UI (recherche + catégorie)
  const search = ref('')
  const category = ref('')

  // --- Getters ---
  // Liste filtrée par titre et catégorie, recalculée automatiquement.
  const filteredEvents = computed(() => {
    const term = search.value.trim().toLowerCase()
    return events.value.filter((e) => {
      const matchTerm = !term || e.title.toLowerCase().includes(term)
      const matchCategory = !category.value || e.category === category.value
      return matchTerm && matchCategory
    })
  })

  // --- Actions ---
  async function loadEvents() {
    loading.value = true
    error.value = null
    try {
      events.value = await fetchEvents()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function loadEvent(id) {
    loading.value = true
    error.value = null
    try {
      return await fetchEventById(id)
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function addEvent(payload) {
    const created = await createEvent(payload)
    events.value.push(created)
    return created
  }

  return {
    events,
    loading,
    error,
    search,
    category,
    filteredEvents,
    loadEvents,
    loadEvent,
    addEvent,
  }
})
