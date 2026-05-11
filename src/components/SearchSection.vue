<template>
  <div class="search-section">
    <div class="search-container">
      <div v-if="!showSearchSummary" class="trip-type-tabs">
        <button :class="['trip-type-tab', { active: tripType === 'roundtrip' }]" @click="tripType = 'roundtrip'">
          <i class="fas fa-exchange-alt"></i> {{ t('search.roundTrip') }}
        </button>
        <button :class="['trip-type-tab', { active: tripType === 'oneway' }]" @click="tripType = 'oneway'">
          <i class="fas fa-arrow-right"></i> {{ t('search.oneWay') }}
        </button>
      </div>

      <div v-if="showSearchSummary" class="search-summary-card">
        <div class="summary-main">
          <div class="summary-route">
            <span class="summary-city">{{ form.from }}</span>
            <i class="fas fa-arrow-right"></i>
            <span class="summary-city">{{ form.to }}</span>
          </div>

          <button class="summary-edit-btn" @click="editSearch" :title="t('search.search')">
            <i class="fas fa-pencil-alt"></i>
          </button>
        </div>

        <div class="summary-meta">
          <span>{{ formattedDepartDate }}</span>
          <span class="summary-dot">•</span>
          <span>{{ passengerSummaryCompact }}</span>
        </div>
      </div>

      <form v-else class="search-form" @submit.prevent="handleSearch">
        <div class="form-group">
          <label>{{ t('search.from') }}</label>
          <div class="form-group-wrapper">
            <LocationCombobox
              v-model="form.from"
              :options="LOCATIONS"
              :placeholder="t('search.selectFrom')"
            />
            <div class="swap-icon" @click="swapLocations" :title="t('search.swapDirection')">
              <i class="fas fa-exchange-alt"></i>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('search.to') }}</label>
          <div class="form-group-wrapper">
            <LocationCombobox
              v-model="form.to"
              :options="LOCATIONS"
              :placeholder="t('search.selectTo')"
            />
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

        <div class="form-group passengers-group" ref="passengerGroupRef">
          <label>{{ t('search.passengers') }}</label>
          <button type="button" class="passenger-trigger" @click.stop="showPassengerDropdown = !showPassengerDropdown">
            <span>{{ passengerSummary }}</span>
            <i class="fas fa-chevron-down" :class="{ rotated: showPassengerDropdown }"></i>
          </button>

          <div class="passenger-dropdown" v-if="showPassengerDropdown" @click.stop>
            <div class="passenger-row">
              <div class="passenger-info">
                <i class="fas fa-user"></i>
                <div>
                  <span class="passenger-label">Adult</span>
                  <span class="passenger-sublabel">Age 12 and above</span>
                </div>
              </div>
              <div class="counter">
                <button type="button" @click="adults = Math.max(1, adults - 1)" :disabled="adults <= 1">−</button>
                <span>{{ adults }}</span>
                <button type="button" @click="adults++">+</button>
              </div>
            </div>

            <div class="passenger-row">
              <div class="passenger-info">
                <i class="fas fa-child"></i>
                <div>
                  <span class="passenger-label">Child</span>
                  <span class="passenger-sublabel">Age 2 - 11</span>
                </div>
              </div>
              <div class="counter">
                <button type="button" @click="setChildren(children - 1)" :disabled="children <= 0">−</button>
                <span>{{ children }}</span>
                <button type="button" @click="setChildren(children + 1)">+</button>
              </div>
            </div>

            <div class="child-ages" v-if="children > 0">
              <p class="section-label">Child Ages</p>
              <div class="child-age-inputs">
                <div v-for="(_, index) in childAges" :key="index" class="child-age-item">
                  <label>Child {{ index + 1 }}</label>
                  <select
                    v-model="childAges[index]"
                    :class="{ 'input-error': childAgesError && childAges[index] === null }"
                  >
                    <option :value="null" disabled>Select age</option>
                    <option v-for="age in 10" :key="age" :value="age + 1">{{ age + 1 }} yrs</option>
                  </select>
                </div>
              </div>
              <p v-if="childAgesError" class="age-error-msg">Please select an age for each child.</p>
            </div>

            <button type="button" class="confirm-btn" @click="showPassengerDropdown = false">Confirm</button>
          </div>
        </div>

        <button type="submit" class="search-btn" style="margin-top: 20px;">
          <i class="fas fa-search"></i> {{ t('search.search') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { i18nState, t } from '../i18n'
import LocationCombobox from './LocationCombobox.vue'
import { LOCATIONS } from '../services/mockData.js'

const props = defineProps({
  initialValues: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['search'])

const tripType = ref('roundtrip')
const showPassengerDropdown = ref(false)
const passengerGroupRef = ref(null)
const hasSearched = ref(false)
const isMobileView = ref(false)

const adults = ref(1)
const children = ref(0)
const childAges = ref([])
const childAgesError = ref(false)

const passengerSummary = computed(() => {
  const total = adults.value + children.value
  return `${total} Passenger${total > 1 ? 's' : ''}`
})

const passengerSummaryCompact = computed(() => {
  const total = adults.value + children.value
  if (i18nState.lang === 'th') return `${total} ผู้โดยสาร`
  return passengerSummary.value
})

const showSearchSummary = computed(() => hasSearched.value && isMobileView.value)

const setChildren = (count) => {
  const newCount = Math.max(0, count)
  children.value = newCount
  if (newCount > childAges.value.length) {
    for (let i = childAges.value.length; i < newCount; i++) {
      childAges.value.push(null)
    }
  } else {
    childAges.value = childAges.value.slice(0, newCount)
  }
}

const handleClickOutside = (event) => {
  if (passengerGroupRef.value && !passengerGroupRef.value.contains(event.target)) {
    showPassengerDropdown.value = false
  }
}

const syncMobileState = () => {
  isMobileView.value = window.innerWidth <= 768
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  syncMobileState()
  window.addEventListener('resize', syncMobileState)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('resize', syncMobileState)
})

const today = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

const form = reactive({
  from: 'Bangkok (BKK)',
  to: 'Koh Samui (KSM)',
  departDate: today,
  returnDate: nextWeek,
})

const applyInitialValues = (initial) => {
  if (!initial) return
  if (initial.from !== undefined) form.from = initial.from
  if (initial.to !== undefined) form.to = initial.to
  if (initial.departDate !== undefined) form.departDate = initial.departDate
  if (initial.returnDate !== undefined) form.returnDate = initial.returnDate
  if (initial.tripType !== undefined) tripType.value = initial.tripType

  adults.value = Math.max(1, Number(initial.adults ?? adults.value))
  const initialChildren = Math.max(0, Number(initial.children ?? 0))
  setChildren(initialChildren)

  const incomingAges = Array.isArray(initial.childAges)
    ? initial.childAges
        .map((age) => Number(age))
        .filter((age) => Number.isFinite(age) && age >= 0)
    : []

  if (incomingAges.length) {
    childAges.value = incomingAges.slice(0, initialChildren)
    if (childAges.value.length < initialChildren) {
      for (let i = childAges.value.length; i < initialChildren; i++) {
        childAges.value.push(null)
      }
    }
  }
}

watch(
  () => props.initialValues,
  (initial) => {
    applyInitialValues(initial)
  },
  { immediate: true, deep: true }
)

const formattedDepartDate = computed(() => {
  const date = new Date(form.departDate)
  if (Number.isNaN(date.getTime())) return form.departDate
  return date.toLocaleDateString(i18nState.lang === 'th' ? 'th-TH' : 'en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
})

const editSearch = () => {
  hasSearched.value = false
}

const swapLocations = () => {
  const temp = form.from
  form.from = form.to
  form.to = temp
}

const handleSearch = () => {
  const hasUnselectedAge = childAges.value.some(age => age === null)
  if (hasUnselectedAge) {
    childAgesError.value = true
    showPassengerDropdown.value = true
    return
  }

  childAgesError.value = false
  emit('search', {
    ...form,
    tripType: tripType.value,
    adults: adults.value,
    children: children.value,
    childAges: childAges.value,
  })

  hasSearched.value = true
  showPassengerDropdown.value = false
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

.search-summary-card {
  margin: 16px 24px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #f4f4f4;
  border: 1px solid #e8e8e8;
}

.summary-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.summary-route {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
}

.summary-city {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary-route i {
  color: var(--accent);
  font-size: 18px;
  flex-shrink: 0;
}

.summary-edit-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  border-radius: 50%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-meta {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: var(--text-light);
}

.summary-dot {
  color: var(--text-lighter);
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

  .search-summary-card {
    margin: 12px 16px;
    padding: 12px 14px;
  }

  .summary-route {
    font-size: 18px;
  }

  .summary-route i {
    font-size: 15px;
  }

  .summary-meta {
    font-size: 14px;
  }
}

/* Passenger dropdown */
.passengers-group {
  position: relative;
}

.passenger-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  border: 0.5px solid rgb(227, 228, 232);
  border-radius: 4px;
  font-size: 13px;
  background: white;
  cursor: pointer;
  color: var(--text);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.passenger-trigger:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.passenger-trigger .fa-chevron-down {
  font-size: 11px;
  color: var(--text-light);
  transition: transform 200ms;
  flex-shrink: 0;
  margin-left: 6px;
}

.passenger-trigger .fa-chevron-down.rotated {
  transform: rotate(180deg);
}

.passenger-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 320px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--border);
  padding: 16px;
  z-index: 100;
}

.passenger-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.passenger-row:last-of-type {
  border-bottom: none;
}

.passenger-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-light);
  font-size: 14px;
}

.passenger-info > div {
  display: flex;
  flex-direction: column;
}

.passenger-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.passenger-sublabel {
  font-size: 11px;
  color: var(--text-lighter);
  margin-top: 2px;
}

.counter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.counter button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid var(--primary);
  background: white;
  color: var(--primary);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms;
  line-height: 1;
}

.counter button:hover:not(:disabled) {
  background: var(--primary);
  color: white;
}

.counter button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: var(--border);
  color: var(--text-lighter);
}

.counter span {
  font-size: 15px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
  color: var(--text);
}

/* Child age inputs */
.child-ages {
  margin-top: 12px;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 10px;
}

.child-age-inputs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.child-age-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.child-age-item label {
  font-size: 11px;
  color: var(--text-light);
}

.child-age-item select {
  padding: 7px 10px;
  border: 0.5px solid rgb(227, 228, 232);
  border-radius: 4px;
  font-size: 13px;
  background: white;
  cursor: pointer;
}

.child-age-item select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.child-age-item select.input-error {
  border-color: #d32f2f;
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
}

.age-error-msg {
  margin: 6px 0 0;
  font-size: 12px;
  color: #d32f2f;
}

/* Confirm button */
.confirm-btn {
  margin-top: 14px;
  width: 100%;
  padding: 10px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 150ms;
}

.confirm-btn:hover {
  background: var(--primary-dark);
}
</style>
