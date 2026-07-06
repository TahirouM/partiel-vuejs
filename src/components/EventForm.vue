<script setup>
import { ref, reactive } from 'vue'
import BaseButton from './BaseButton.vue'
import { CATEGORIES } from '../constants'

// Le parent décide quoi faire de la soumission via l'emit "submit".
const emit = defineEmits(['submit'])
defineProps({
  submitting: { type: Boolean, default: false },
})

const form = reactive({
  title: '',
  description: '',
  date: '',
  location: '',
  category: '',
  capacity: 30,
})

const errors = ref({})

// Validation simple, alignée sur les règles du backend.
function validate() {
  const e = {}
  if (form.title.trim().length < 3) e.title = 'Le titre doit faire au moins 3 caractères.'
  if (form.description.trim().length < 10) e.description = 'La description doit faire au moins 10 caractères.'
  if (!form.date) e.date = 'La date est requise.'
  if (!form.location.trim()) e.location = 'Le lieu est requis.'
  if (!form.category) e.category = 'Choisissez une catégorie.'
  if (!form.capacity || form.capacity < 1) e.capacity = 'La capacité doit être au moins de 1.'
  errors.value = e
  return Object.keys(e).length === 0
}

function onSubmit() {
  if (!validate()) return
  emit('submit', { ...form, capacity: Number(form.capacity) })
}
</script>

<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div class="field">
      <label for="title">Titre</label>
      <input id="title" v-model="form.title" type="text" />
      <span v-if="errors.title" class="error-text">{{ errors.title }}</span>
    </div>

    <div class="field">
      <label for="description">Description</label>
      <textarea id="description" v-model="form.description" rows="4"></textarea>
      <span v-if="errors.description" class="error-text">{{ errors.description }}</span>
    </div>

    <div class="row">
      <div class="field">
        <label for="date">Date</label>
        <input id="date" v-model="form.date" type="date" />
        <span v-if="errors.date" class="error-text">{{ errors.date }}</span>
      </div>

      <div class="field">
        <label for="location">Lieu</label>
        <input id="location" v-model="form.location" type="text" />
        <span v-if="errors.location" class="error-text">{{ errors.location }}</span>
      </div>
    </div>

    <div class="row">
      <div class="field">
        <label for="category">Catégorie</label>
        <select id="category" v-model="form.category">
          <option value="" disabled>Choisir…</option>
          <option v-for="c in CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>
        <span v-if="errors.category" class="error-text">{{ errors.category }}</span>
      </div>

      <div class="field">
        <label for="capacity">Capacité</label>
        <input id="capacity" v-model="form.capacity" type="number" min="1" />
        <span v-if="errors.capacity" class="error-text">{{ errors.capacity }}</span>
      </div>
    </div>

    <BaseButton type="submit" :disabled="submitting">
      {{ submitting ? 'Création…' : "Créer l'événement" }}
    </BaseButton>
  </form>
</template>

<style scoped>
.row {
  display: grid;
  gap: 0 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .row {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
