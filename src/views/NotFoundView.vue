<script setup>
import BaseButton from '../components/BaseButton.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <section class="state">
    <h1>404</h1>
    <p>Cette page n'existe pas.</p>
    <BaseButton @click="router.push('/')">Retour à l'accueil</BaseButton>
  </section>
</template>
