<template>
  <div class="country-detail-view fade-in">
    <!-- Navigation back button -->
    <div class="nav-back-bar">
      <router-link to="/" class="btn-back">
        <span class="back-arrow">←</span>
        <span>Retour à la liste des pays</span>
      </router-link>
    </div>

    <!-- State 1: Loading -->
    <div v-if="loading" class="state-container loading-state">
      <div class="spinner"></div>
      <h3 class="state-title">Chargement des détails du pays...</h3>
      <p class="state-desc">Interrogation de l'API REST Countries pour le code "{{ $route.params.code }}"</p>
    </div>

    <!-- State 2: Error -->
    <div v-else-if="error" class="state-container error-state">
      <div class="error-icon">⚠️</div>
      <h3 class="state-title">Erreur lors de la récupération</h3>
      <p class="state-desc">{{ error }}</p>
      <div class="error-actions">
        <button @click="chargerPays" class="retry-btn">
          <span>🔄</span> Réessayer
        </button>
        <router-link to="/" class="secondary-btn">
          Retour à l'accueil
        </router-link>
      </div>
    </div>

    <!-- State 3: Country Detail Card -->
    <div v-else-if="country" class="detail-container">
      <div class="detail-hero">
        <!-- Flag & Visuals column -->
        <div class="flag-column">
          <div class="flag-wrapper">
            <img
              :src="flagSrc"
              :alt="flagAlt"
              class="flag-img"
            />
          </div>

          <div v-if="coatOfArmsSrc" class="coat-of-arms-card">
            <span class="coat-label">Armoiries nationales</span>
            <img
              :src="coatOfArmsSrc"
              :alt="`Armoiries de ${countryName}`"
              class="coat-img"
            />
          </div>
        </div>

        <!-- Details Info Column -->
        <div class="info-column">
          <div class="country-title-row">
            <div>
              <h1 class="country-main-name">{{ countryName }}</h1>
              <p v-if="officialName" class="country-official-name">{{ officialName }}</p>
            </div>
            <span class="code-badge">{{ countryCode }}</span>
          </div>

          <div class="info-grid">
            <div class="info-card">
              <span class="info-card-icon">🏛️</span>
              <div class="info-card-text">
                <span class="label">Capitale</span>
                <span class="val">{{ capitalFormatted }}</span>
              </div>
            </div>

            <div class="info-card">
              <span class="info-card-icon">🧭</span>
              <div class="info-card-text">
                <span class="label">Région / Sous-région</span>
                <span class="val">{{ regionFormatted }}</span>
              </div>
            </div>

            <div class="info-card">
              <span class="info-card-icon">👥</span>
              <div class="info-card-text">
                <span class="label">Population</span>
                <span class="val">{{ populationFormatted }}</span>
              </div>
            </div>

            <div class="info-card">
              <span class="info-card-icon">📐</span>
              <div class="info-card-text">
                <span class="label">Superficie</span>
                <span class="val">{{ areaFormatted }}</span>
              </div>
            </div>

            <div class="info-card">
              <span class="info-card-icon">🗣️</span>
              <div class="info-card-text">
                <span class="label">Langues officielles</span>
                <span class="val">{{ languagesFormatted }}</span>
              </div>
            </div>

            <div class="info-card">
              <span class="info-card-icon">💰</span>
              <div class="info-card-text">
                <span class="label">Monnaies</span>
                <span class="val">{{ currenciesFormatted }}</span>
              </div>
            </div>

            <div class="info-card">
              <span class="info-card-icon">🌐</span>
              <div class="info-card-text">
                <span class="label">Domaine Internet (TLD)</span>
                <span class="val">{{ tldFormatted }}</span>
              </div>
            </div>

            <div class="info-card">
              <span class="info-card-icon">🗺️</span>
              <div class="info-card-text">
                <span class="label">Carte géographique</span>
                <a
                  v-if="country.maps?.googleMaps"
                  :href="country.maps.googleMaps"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="map-link"
                >
                  Ouvrir sur Google Maps ↗
                </a>
                <span v-else class="val">Non disponible</span>
              </div>
            </div>
          </div>

          <!-- Section Frontières (Démonstration du Bonus watch) -->
          <div class="borders-section">
            <h3 class="borders-title">
              <span>🤝</span> Pays Frontaliers (Borders) :
            </h3>

            <div v-if="country.borders && country.borders.length > 0" class="borders-list">
              <router-link
                v-for="borderCode in country.borders"
                :key="borderCode"
                :to="`/pays/${borderCode}`"
                class="border-tag"
                :title="`Aller à la fiche de ${borderCode}`"
              >
                {{ borderCode }}
              </router-link>
            </div>
            <p v-else class="no-borders-text">
              Ce pays n'a pas de frontières terrestres directes (territoire insulaire ou enclavé sans voisins directs).
            </p>

            <div class="bonus-notice">
              <small>
                💡 <strong>Bonus actif :</strong> Cliquer sur un pays frontalier réutilise ce même composant
                sans le remonter, et <code>watch: { '$route.params.code' }</code> recharge automatiquement la fiche.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CountryDetailView',
  data() {
    return {
      country: null,
      loading: false,
      error: null
    }
  },
  computed: {
    countryName() {
      return this.country?.name?.common || 'Pays Inconnu'
    },
    officialName() {
      return this.country?.name?.official || ''
    },
    countryCode() {
      return this.country?.cca3 || this.country?.cca2 || this.$route.params.code || ''
    },
    flagSrc() {
      return this.country?.flags?.svg || this.country?.flags?.png || ''
    },
    flagAlt() {
      return this.country?.flags?.alt || `Drapeau de ${this.countryName}`
    },
    coatOfArmsSrc() {
      return this.country?.coatOfArms?.svg || this.country?.coatOfArms?.png || ''
    },
    capitalFormatted() {
      if (Array.isArray(this.country?.capital) && this.country.capital.length > 0) {
        return this.country.capital.join(', ')
      }
      return 'Non renseignée'
    },
    regionFormatted() {
      const parts = []
      if (this.country?.region) parts.push(this.country.region)
      if (this.country?.subregion) parts.push(`(${this.country.subregion})`)
      return parts.join(' ') || 'N/A'
    },
    populationFormatted() {
      if (typeof this.country?.population === 'number') {
        return this.country.population.toLocaleString('fr-FR') + ' habitants'
      }
      return 'N/A'
    },
    areaFormatted() {
      if (typeof this.country?.area === 'number') {
        return this.country.area.toLocaleString('fr-FR') + ' km²'
      }
      return 'N/A'
    },
    languagesFormatted() {
      if (this.country?.languages && typeof this.country.languages === 'object') {
        return Object.values(this.country.languages).join(', ')
      }
      return 'N/A'
    },
    currenciesFormatted() {
      if (this.country?.currencies && typeof this.country.currencies === 'object') {
        return Object.values(this.country.currencies)
          .map(curr => curr.symbol ? `${curr.name} (${curr.symbol})` : curr.name)
          .join(', ')
      }
      return 'N/A'
    },
    tldFormatted() {
      if (Array.isArray(this.country?.tld) && this.country.tld.length > 0) {
        return this.country.tld.join(', ')
      }
      return 'N/A'
    }
  },
  watch: {
    /**
     * BONUS TP 7 :
     * Détection du changement de paramètre de route dans l'URL.
     * Lorsque l'utilisateur clique sur un pays voisin / frontière, Vue Router
     * réutilise l'instance du composant sans déclencher mounted().
     * Grâce à ce watcher sur '$route.params.code', on recharge immédiatement les données.
     */
    '$route.params.code'(newCode, oldCode) {
      if (newCode && newCode !== oldCode) {
        this.chargerPays()
      }
    }
  },
  methods: {
    /**
     * Charge les données du pays correspondant au code passé en paramètre de route.
     * Gère :
     * 1. Les 3 états : loading, succès, error
     * 2. Le piège classique : vérification de !reponse.ok
     * 3. Le cas où l'API renvoie un objet unique OU un tableau contenant un seul objet.
     */
    async chargerPays() {
      const code = this.$route.params.code
      if (!code) return

      this.loading = true
      this.error = null
      this.country = null

      try {
        const URL = `https://restcountries.com/v3.1/alpha/${code}?fields=name,flags,population,capital,region,subregion,languages,currencies,borders,cca3,cca2,coatOfArms,maps,area,tld`
        let rawData

        try {
          const reponse = await fetch(URL)
          if (!reponse.ok) {
            throw new Error(`Erreur ${reponse.status} lors de l'appel API`)
          }
          rawData = await reponse.json()

          // Détection d'un message d'erreur ou d'une dépréciation de l'API
          if (rawData && rawData.errors) {
            throw new Error("L'API v3.1 a retourné une erreur ou est dépréciée.")
          }
        } catch (errApi) {
          // Secours miroir local / raw github
          console.warn("API REST Countries alpha inaccessible ou dépréciée, recours au miroir local :", errApi.message)
          const fallback = await fetch('/countriesV3.1.json').catch(() =>
            fetch('https://raw.githubusercontent.com/restcountries/restcountries/master/src/main/resources/countriesV3.1.json')
          )
          if (!fallback.ok) {
            throw new Error(`Erreur de secours ${fallback.status}`)
          }
          const allCountries = await fallback.json()
          const codeUpper = code.toUpperCase()
          const found = allCountries.find(
            c => (c.cca3 && c.cca3.toUpperCase() === codeUpper) ||
                 (c.cca2 && c.cca2.toUpperCase() === codeUpper) ||
                 (c.cioc && c.cioc.toUpperCase() === codeUpper)
          )

          if (!found) {
            throw new Error(`Aucun pays trouvé pour le code "${code}"`)
          }
          rawData = found
        }

        // =========================================================================
        // IMPORTANT (Spécification TP) :
        // Selon la version de l'API, la réponse peut être un objet unique
        // ou un tableau contenant un seul objet. On gère les deux cas avant affectation :
        // =========================================================================
        if (Array.isArray(rawData)) {
          if (rawData.length > 0) {
            this.country = rawData[0]
          } else {
            throw new Error(`Aucun pays trouvé avec le code "${code}"`)
          }
        } else if (rawData && typeof rawData === 'object') {
          this.country = rawData
        } else {
          throw new Error("Format de réponse inattendu.")
        }
      } catch (e) {
        this.error = e.message || "Impossible de charger les données du pays."
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.chargerPays()
  }
}
</script>

<style scoped>
.country-detail-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.nav-back-bar {
  display: flex;
  align-items: center;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: #ffffff;
  padding: 0.65rem 1.25rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-main);
  box-shadow: var(--card-shadow);
  transition: var(--transition);
}

.btn-back:hover {
  background: var(--surface-alt);
  border-color: #cbd5e1;
  transform: translateX(-3px);
}

.back-arrow {
  font-size: 1.1rem;
}

/* States */
.state-container {
  background: #ffffff;
  padding: 4rem 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 380px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
  margin-bottom: 0.5rem;
}

.error-icon {
  font-size: 3.5rem;
  line-height: 1;
}

.state-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-main);
}

.state-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  max-width: 500px;
}

.error-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.retry-btn {
  background: var(--primary);
  color: #ffffff;
  font-weight: 600;
  padding: 0.65rem 1.3rem;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);
}

.retry-btn:hover {
  background: var(--primary-hover);
}

.secondary-btn {
  background: #f1f5f9;
  color: var(--text-main);
  font-weight: 600;
  padding: 0.65rem 1.3rem;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.secondary-btn:hover {
  background: #e2e8f0;
}

/* Detail Card Container */
.detail-container {
  background: #ffffff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--card-shadow);
  padding: 2.5rem;
}

.detail-hero {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 3rem;
}

.flag-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.flag-wrapper {
  width: 100%;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background: #f8fafc;
}

.flag-img {
  width: 100%;
  height: auto;
  max-height: 280px;
  object-fit: cover;
  display: block;
}

.coat-of-arms-card {
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.coat-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.coat-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

/* Info Column */
.info-column {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.country-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 1.25rem;
}

.country-main-name {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-main);
  line-height: 1.2;
}

.country-official-name {
  font-size: 1rem;
  color: var(--text-muted);
  margin-top: 0.35rem;
}

.code-badge {
  font-size: 1rem;
  font-weight: 800;
  background: var(--primary-light);
  color: var(--primary);
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-sm);
  border: 1px solid #bfdbfe;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-card {
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.9rem 1.1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.info-card-icon {
  font-size: 1.4rem;
  line-height: 1;
  margin-top: 2px;
}

.info-card-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.info-card-text .label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.info-card-text .val {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
}

.map-link {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--primary);
  text-decoration: underline;
}

.map-link:hover {
  color: var(--primary-hover);
}

/* Borders Section */
.borders-section {
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.borders-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.borders-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.border-tag {
  background: #ffffff;
  border: 1px solid var(--border);
  color: var(--text-main);
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-sm);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: var(--transition);
}

.border-tag:hover {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.25);
}

.no-borders-text {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-style: italic;
}

.bonus-notice {
  margin-top: 0.35rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--border);
  color: #475569;
}

.bonus-notice code {
  background: #e2e8f0;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: monospace;
}

@media (max-width: 960px) {
  .detail-hero {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .flag-column {
    max-width: 460px;
    margin: 0 auto;
    width: 100%;
  }
}

@media (max-width: 640px) {
  .detail-container {
    padding: 1.25rem;
  }
  .country-main-name {
    font-size: 1.65rem;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
