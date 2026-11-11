<template>
  <div class="app-layout">
    <header class="navbar">
      <div class="nav-container">
        <router-link to="/" class="brand">
          <span class="brand-icon">🌍</span>
          <div class="brand-text">
            <span class="brand-title">Explorateur de Pays</span>
            <span class="brand-badge">TP 7 • REST Countries API</span>
          </div>
        </router-link>

        <nav class="nav-links">
          <router-link to="/" class="nav-link" active-class="active">
            Accueil
          </router-link>
          <a
            href="https://restcountries.com"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-link external"
          >
            API Docs ↗
          </a>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="footer">
      <div class="footer-container">
        <p>
          <strong>TP 7 – Explorateur d'API REST</strong> • Vue.js (Options API) &amp; Fetch
        </p>
        <p class="footer-sub">
          Réalisé par <strong>Mouad Elkarari</strong> &amp; <strong>Saad-Eddine Hossainy</strong> • ENSA Safi – Génie Informatique (Pr. Ahmed Bentajer)
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background: #ffffff;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.85rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: var(--transition);
}

.brand:hover {
  transform: translateY(-1px);
}

.brand-icon {
  font-size: 1.85rem;
  line-height: 1;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.brand-badge {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-muted);
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.nav-link:hover,
.nav-link.active {
  color: var(--primary);
  background: var(--primary-light);
}

.nav-link.external {
  opacity: 0.85;
}

.main-content {
  flex: 1;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.footer {
  background: #ffffff;
  border-top: 1px solid var(--border);
  padding: 1.5rem;
  margin-top: auto;
  text-align: center;
  font-size: 0.88rem;
  color: var(--text-muted);
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.footer-sub {
  font-size: 0.8rem;
  color: #94a3b8;
}

/* Page fade transition */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 640px) {
  .nav-container {
    padding: 0.75rem 1rem;
  }
  .brand-title {
    font-size: 1.05rem;
  }
  .main-content {
    padding: 1.25rem 1rem 2rem;
  }
}
</style>
