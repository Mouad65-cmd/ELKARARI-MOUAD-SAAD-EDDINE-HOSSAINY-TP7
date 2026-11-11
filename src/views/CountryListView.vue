<template>
  <div class="country-list-view fade-in">
    <!-- Hero / Header Section -->
    <header class="view-header">
      <div class="header-content">
        <h1 class="page-title">Explorateur des Pays du Monde</h1>
        <p class="page-desc">
          Recherchez et explorez les informations détaillées de plus de 250 pays à travers l'API REST Countries.
        </p>
      </div>

      <!-- Controls: Search bar + Region Filter -->
      <div class="search-controls">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input
            v-model="recherche"
            type="text"
            class="search-input"
            placeholder="Rechercher un pays par son nom (ex: Morocco, France, Canada)..."
            :disabled="loading"
          />
          <button
            v-if="recherche"
            @click="recherche = ''"
            class="clear-btn"
            title="Effacer la recherche"
          >
            ✕
          </button>
        </div>

        <div class="region-filter-bar">
          <button
            v-for="region in regions"
            :key="region.id"
            @click="selectedRegion = region.id"
            class="region-btn"
            :class="{ active: selectedRegion === region.id }"
          >
            {{ region.label }}
          </button>
        </div>
      </div>
    </header>

    <!-- State 1: Loading state -->
    <section v-if="loading" class="state-container loading-state">
      <div class="spinner"></div>
      <h3 class="state-title">Chargement des pays en cours...</h3>
      <p class="state-desc">Récupération des données depuis l'API REST Countries</p>
    </section>

    <!-- State 2: Error state -->
    <section v-else-if="error" class="state-container error-state">
      <div class="error-icon">⚠️</div>
      <h3 class="state-title">Erreur de chargement</h3>
      <p class="state-desc">{{ error }}</p>
      <button @click="chargerPays" class="retry-btn">
        <span>🔄</span> Réessayer
      </button>
    </section>

    <!-- State 3: Success state with countries list -->
    <section v-else class="content-section">
      <!-- Status bar -->
      <div class="results-bar">
        <span class="results-count">
          <strong>{{ paysAffiches.length }}</strong>
          {{ paysAffiches.length > 1 ? 'pays trouvés' : 'pays trouvé' }}
        </span>
        <span v-if="recherche" class="search-term-badge">
          Filtre : "{{ recherche }}"
        </span>
      </div>

      <!-- Empty state if search yields no results -->
      <div v-if="paysAffiches.length === 0" class="empty-state">
        <div class="empty-icon">🌍</div>
        <h3 class="empty-title">Aucun pays ne correspond à votre recherche</h3>
        <p class="empty-desc">
          Aucun résultat pour <strong>"{{ recherche }}"</strong>. Essayez un autre mot-clé ou réinitialisez les filtres.
        </p>
        <button @click="resetFilters" class="reset-btn">
          Réinitialiser la recherche
        </button>
      </div>

      <!-- Grid of CountryCard components -->
      <div v-else class="countries-grid">
        <CountryCard
          v-for="country in paysAffiches"
          :key="country.cca3 || country.name.common"
          :country="country"
        />
      </div>
    </section>
  </div>
</template>

<script>
import CountryCard from '../components/CountryCard.vue'

export default {
  name: 'CountryListView',
  components: {
    CountryCard
  },
  data() {
    return {
      countries: [],
      loading: false,
      error: null,
      recherche: '',
      selectedRegion: 'all',
      regions: [
        { id: 'all', label: 'Tous' },
        { id: 'Africa', label: 'Afrique' },
        { id: 'Americas', label: 'Amériques' },
        { id: 'Asia', label: 'Asie' },
        { id: 'Europe', label: 'Europe' },
        { id: 'Oceania', label: 'Océanie' }
      ]
    }
  },
  computed: {
    /**
     * Filtrage des pays selon this.recherche (comparaison sur country.name.common, insensible à la casse)
     * et selon la région sélectionnée.
     */
    paysAffiches() {
      let resultats = this.countries

      // 1. Filtre par recherche de nom (sensible/insensible à la casse)
      if (this.recherche && this.recherche.trim() !== '') {
        const terme = this.recherche.trim().toLowerCase()
        resultats = resultats.filter(country => {
          const commonName = country?.name?.common
          return typeof commonName === 'string' && commonName.toLowerCase().includes(terme)
        })
      }

      // 2. Filtre optionnel par région pour enrichir l'expérience utilisateur
      if (this.selectedRegion !== 'all') {
        resultats = resultats.filter(c => c.region === this.selectedRegion)
      }

      return resultats
    }
  },
  methods: {
    /**
     * Charge la liste de tous les pays depuis l'API REST Countries
     * Gère les 3 états : en cours (loading), réussi (countries), erreur (error)
     */
    async chargerPays() {
      this.loading = true
      this.error = null

      try {
        const API_URL = 'https://restcountries.com/v3.1/all?fields=name,cca3,flags,capital,region,population'
        let data

        try {
          const reponse = await fetch(API_URL)
          if (!reponse.ok) {
            throw new Error(`Erreur ${reponse.status}`)
          }
          data = await reponse.json()

          // Détection d'un message d'erreur ou d'une dépréciation upstream de restcountries.com
          if (!Array.isArray(data) || data.errors) {
            throw new Error("L'API publique a retourné un format non-conforme ou est dépréciée.")
          }
        } catch (errApi) {
          // Miroir robuste de secours : données officielles REST Countries hébergées localement & raw github
          console.warn("API REST Countries indisponible ou dépréciée, recours au miroir :", errApi.message)
          const fallback = await fetch('/countriesV3.1.json').catch(() =>
            fetch('https://raw.githubusercontent.com/restcountries/restcountries/master/src/main/resources/countriesV3.1.json')
          )
          if (!fallback.ok) {
            throw new Error(`Erreur de secours ${fallback.status}`)
          }
          data = await fallback.json()
        }

        this.countries = data
      } catch (e) {
        this.error = "Impossible de charger les données."
      } finally {
        this.loading = false
      }
    },
    resetFilters() {
      this.recherche = ''
      this.selectedRegion = 'all'
    }
  },
  mounted() {
    this.chargerPays()
  }
}
</script>

<style scoped>
.country-list-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.view-header {
  background: #ffffff;
  padding: 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-title {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.025em;
  margin-bottom: 0.35rem;
}

.page-desc {
  color: var(--text-muted);
  font-size: 0.98rem;
  max-width: 720px;
}

.search-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1.15rem;
  font-size: 1.1rem;
  pointer-events: none;
  opacity: 0.6;
}

.search-input {
  width: 100%;
  padding: 0.95rem 2.8rem 0.95rem 3.1rem;
  font-size: 1rem;
  font-family: inherit;
  color: var(--text-main);
  background: #f8fafc;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  transition: var(--transition);
  outline: none;
}

.search-input:focus {
  background: #ffffff;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.clear-btn {
  position: absolute;
  right: 1rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  transition: var(--transition);
}

.clear-btn:hover {
  background: #cbd5e1;
  color: #0f172a;
}

.region-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.region-btn {
  padding: 0.45rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 9999px;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid transparent;
  transition: var(--transition);
}

.region-btn:hover {
  background: #e2e8f0;
  color: var(--text-main);
}

.region-btn.active {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

/* States */
.state-container {
  background: #ffffff;
  padding: 3.5rem 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 320px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
  margin-bottom: 0.5rem;
}

.error-icon {
  font-size: 3rem;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.state-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
}

.state-desc {
  font-size: 0.92rem;
  color: var(--text-muted);
  max-width: 480px;
}

.retry-btn {
  margin-top: 0.75rem;
  background: var(--primary);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.92rem;
  padding: 0.65rem 1.4rem;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);
}

.retry-btn:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

/* Results Content */
.content-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.results-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-muted);
  padding: 0 0.25rem;
}

.results-count strong {
  color: var(--text-main);
  font-weight: 700;
}

.search-term-badge {
  background: #e0f2fe;
  color: #0369a1;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
}

.countries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1.5rem;
}

/* Empty state */
.empty-state {
  background: #ffffff;
  padding: 3rem 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.2rem;
  font-weight: 700;
}

.empty-desc {
  color: var(--text-muted);
  font-size: 0.92rem;
  max-width: 420px;
}

.reset-btn {
  margin-top: 0.5rem;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: underline;
  cursor: pointer;
}

@media (max-width: 640px) {
  .view-header {
    padding: 1.25rem;
  }
  .page-title {
    font-size: 1.45rem;
  }
  .countries-grid {
    grid-template-columns: 1fr;
  }
}
</style>
