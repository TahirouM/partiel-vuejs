<script setup>
// Barre de navigation entre les pages via RouterLink.
</script>

<template>
  <header class="navbar">
    <div class="container navbar__inner">
      <RouterLink to="/" class="navbar__brand">🎫 EventHub <span>EEMI</span></RouterLink>
      <nav class="navbar__links">
        <RouterLink to="/">Événements</RouterLink>
        <RouterLink to="/create" class="navbar__cta">+ Créer</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.navbar__brand {
  font-weight: 800;
  font-size: 1.15rem;
}

.navbar__brand span {
  color: var(--primary);
}

.navbar__links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-weight: 600;
}

.navbar__links a.router-link-exact-active {
  color: var(--primary);
}

.navbar__cta {
  background: var(--primary);
  color: #fff !important;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
}

.navbar__cta:hover {
  background: var(--primary-dark);
}
</style>
