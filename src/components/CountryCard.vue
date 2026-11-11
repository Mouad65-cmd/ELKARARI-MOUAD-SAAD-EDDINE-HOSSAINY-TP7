<template>
  <router-link
    :to="countryCode ? `/pays/${countryCode}` : '#'"
    class="country-card"
    :title="`Voir les détails de ${countryName}`"
  >
    <div class="flag-container">
      <img
        :src="flagSrc"
        :alt="flagAlt"
        class="country-flag"
        loading="lazy"
      />
      <span v-if="country.region" class="region-pill">
        {{ country.region }}
      </span>
    </div>

    <div class="card-body">
      <div class="card-header-row">
        <h3 class="country-name" :title="countryName">
          {{ countryName }}
        </h3>
        <span v-if="countryCode" class="cca3-badge">
          {{ countryCode }}
        </span>
      </div>

      <p v-if="country.name?.official && country.name?.official !== countryName" class="country-official">
        {{ country.name.official }}
      </p>

      <div class="info-list">
        <div class="info-item">
          <span class="info-label">Capitale</span>
          <span class="info-value">{{ capitalText }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Population</span>
          <span class="info-value">{{ populationFormatted }}</span>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <span class="action-text">En savoir plus</span>
      <span class="action-arrow">→</span>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'CountryCard',
  props: {
    country: {
      type: Object,
      required: true
    }
  },
  computed: {
    countryName() {
      return this.country?.name?.common || 'Pays Inconnu'
    },
    countryCode() {
      return this.country?.cca3 || this.country?.cca2 || this.country?.cioc || ''
    },
    flagSrc() {
      return this.country?.flags?.svg || this.country?.flags?.png || ''
    },
    flagAlt() {
      return this.country?.flags?.alt || `Drapeau de ${this.countryName}`
    },
    capitalText() {
      if (Array.isArray(this.country?.capital) && this.country.capital.length > 0) {
        return this.country.capital.join(', ')
      }
      return 'N/A'
    },
    populationFormatted() {
      if (typeof this.country?.population === 'number') {
        return this.country.population.toLocaleString('fr-FR') + ' hab.'
      }
      return 'N/A'
    }
  }
}
</script>

<style scoped>
.country-card {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: var(--card-shadow);
  transition: var(--transition);
  position: relative;
  text-decoration: none;
  color: inherit;
}

.country-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--card-shadow-hover);
  border-color: #cbd5e1;
}

.flag-container {
  position: relative;
  width: 100%;
  height: 160px;
  background: #e2e8f0;
  overflow: hidden;
}

.country-flag {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.country-card:hover .country-flag {
  transform: scale(1.05);
}

.region-pill {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(6px);
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  letter-spacing: 0.02em;
}

.card-body {
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.country-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cca3-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  background: #f1f5f9;
  color: #475569;
  letter-spacing: 0.05em;
}

.country-official {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 0.85rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--border);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.84rem;
}

.info-label {
  color: var(--text-muted);
}

.info-value {
  font-weight: 600;
  color: #1e293b;
  text-align: right;
  max-width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-footer {
  padding: 0.75rem 1.15rem;
  background: #f8fafc;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--primary);
  transition: var(--transition);
}

.country-card:hover .card-footer {
  background: var(--primary-light);
}

.action-arrow {
  transition: transform 0.2s ease;
}

.country-card:hover .action-arrow {
  transform: translateX(4px);
}
</style>
