<template>
  <div class="search-section">
    <div class="search-container">
      <div class="trip-type-tabs">
        <button :class="['trip-type-tab', { active: tripType === 'roundtrip' }]" @click="tripType = 'roundtrip'">
          <i class="fas fa-exchange-alt"></i> {{ t('search.roundTrip') }}
        </button>
        <button :class="['trip-type-tab', { active: tripType === 'oneway' }]" @click="tripType = 'oneway'">
          <i class="fas fa-arrow-right"></i> {{ t('search.oneWay') }}
        </button>
      </div>

      <form class="search-form" @submit.prevent="handleSearch">
        <div class="form-group">
          <label>{{ t('search.from') }}</label>
          <div class="form-group-wrapper">
            <input v-model="form.from" type="text" :placeholder="t('search.selectFrom')">
            <button type="button" class="clear-btn" @click="form.from = ''" v-if="form.from">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('search.to') }}</label>
          <div class="form-group-wrapper" style="position: relative;">
            <input v-model="form.to" type="text" :placeholder="t('search.selectTo')">
            <button type="button" class="clear-btn" @click="form.to = ''" v-if="form.to">
              <i class="fas fa-times"></i>
            </button>
            <div class="swap-icon" @click="swapLocations" :title="t('search.swapDirection')">
              <i class="fas fa-exchange-alt"></i>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('search.departDate') }}</label>
          <input v-model="form.departDate" type="date">
        </div>

        <div class="form-group" v-if="tripType === 'roundtrip'">
          <label>{{ t('search.returnDate') }}</label>
          <input v-model="form.returnDate" type="date">
        </div>

        <div class="form-group">
          <label>{{ t('search.passengers') }}</label>
          <select v-model="form.passengers">
            <option v-for="n in 10" :key="n" :value="n">{{ n }} {{ t('search.person') }}</option>
          </select>
        </div>

        <button type="submit" class="search-btn" style="margin-top: 20px;">
          <i class="fas fa-search"></i> {{ t('search.search') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { i18nState, t } from '../i18n'

const emit = defineEmits(['search'])

const tripType = ref('roundtrip')

const today = new Date().toISOString().split('T')[0]
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

const form = reactive({
  from: i18nState.lang === 'en' ? 'Bangkok (BKK)' : 'กรุงเทพ (BKK)',
  to: i18nState.lang === 'en' ? 'Koh Samui (KSM)' : 'เกาะสมุย (KSM)',
  departDate: today,
  returnDate: nextWeek,
  passengers: 1
})

const swapLocations = () => {
  const temp = form.from
  form.from = form.to
  form.to = temp
}

const handleSearch = () => {
  emit('search', { ...form, tripType: tripType.value })
}
</script>

<style scoped>
.search-section {
  background: #FFFFFF;
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-1);
}

.search-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.trip-type-tabs {
  display: flex;
  border-bottom: 2px solid var(--border);
  padding: 0 24px;
}

.trip-type-tab {
  padding: 14px 20px;
  border: none;
  background: transparent;
  color: var(--text-light);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.trip-type-tab:hover {
  color: var(--text);
  background: rgba(25, 118, 210, 0.04);
}

.trip-type-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.search-form {
  display: grid;
  grid-template-columns: 1.3fr 1.3fr 1fr 1fr 0.8fr auto;
  gap: 12px;
  align-items: center;
  padding: 16px 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 0.5px solid rgb(227, 228, 232);
  border-radius: 4px;
  font-size: 13px;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  width: 100%;
}

.form-group input::placeholder {
  color: var(--text-lighter);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23616161' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 18px;
  padding-right: 32px;
  cursor: pointer;
}

.clear-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-lighter);
  font-size: 14px;
  transition: color 200ms;
  z-index: 5;
  padding: 0 4px;
}

.clear-btn:hover {
  color: var(--primary);
}

.swap-icon {
  position: absolute;
  right: -18px;
  background: var(--primary);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  z-index: 10;
  border: 3px solid white;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-2);
}

.swap-icon:hover {
  background: var(--primary-dark);
  transform: scale(1.1);
}

.search-btn {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 42px;
  white-space: nowrap;
}

.search-btn:hover {
  background: linear-gradient(135deg, var(--primary-dark) 0%, #0D47A1 100%);
  transform: translateY(-2px);
  box-shadow: var(--shadow-2);
}

@media (max-width: 1024px) {
  .search-form {
    grid-template-columns: repeat(2, 1fr);
  }
  .search-btn {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .search-form {
    grid-template-columns: 1fr;
    padding: 12px 16px;
  }
  .trip-type-tabs {
    padding: 0 16px;
  }
  .search-container {
    padding: 0;
  }
}
</style>
