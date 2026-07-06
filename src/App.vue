<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <Navbar />
  <main class="container page">
    <!-- Vue Router affiche ici la page correspondant à l'URL -->
    <RouterView />
  </main>
</template>
