<template>
  <div>
    <SearchSection @search="handleSearch" />
    <PromoBanner />

    <div class="main-content">
      <FilterSidebar class="sidebar-area" />

      <div class="results-section">
        <div class="results-header">
          <div class="results-title">
            <i class="fas fa-list"></i> {{ t('results.title') }} ({{ tickets.length }} {{ t('results.tickets') }})
          </div>
          <div class="sort-controls">
            <span>{{ t('results.sortBy') }}</span>
            <button
              v-for="s in sortOptions"
              :key="s.key"
              :class="['sort-btn', { active: sortBy === s.key }]"
              @click="sortBy = s.key"
            >{{ s.label }}</button>
          </div>
        </div>

        <TicketCard v-for="ticket in sortedTickets" :key="ticket.id" :ticket="ticket" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SearchSection from '../components/SearchSection.vue'
import PromoBanner from '../components/PromoBanner.vue'
import FilterSidebar from '../components/FilterSidebar.vue'
import TicketCard from '../components/TicketCard.vue'
import { t } from '../i18n'

const sortBy = ref('fastest')

const sortOptions = computed(() => [
  { key: 'fastest', label: t('results.fastest') },
  { key: 'cheapest', label: t('results.cheapest') },
  { key: 'longest', label: t('results.longest') },
])

const tickets = ref([
  {
    id: 1,
    code: 'SF',
    type: '⭐ Speed Ferry Premium',
    from: 'Bangkok',
    fromPort: 'Bangkok Pier (BKK)',
    to: 'Koh Samui',
    toPort: 'Koh Samui Pier (KSM)',
    departTime: '11:10',
    arriveTime: '15:45',
    departDate: '2026-05-01',
    departGate: '5',
    arriveGate: '2',
    checkinTime: '30 mins before',
    checkoutTime: '15 mins',
    duration: '4h 35m',
    durationMinutes: 275,
    seats: 45,
    price: 850,
    fee: 50,
    amenities: [
      { icon: 'fas fa-wifi', label: 'WiFi' },
      { icon: 'fas fa-utensils', label: 'Food and drinks' },
      { icon: 'fas fa-check-double', label: 'Full amenities' },
    ],
    details: [
      { label: 'Seat', value: 'Premium seat with USB charger' },
      { label: 'Restroom', value: 'VIP restroom' },
      { label: 'Luggage', value: 'Under-seat + overhead storage' },
    ],
    notes: '• Check in 30 minutes before departure • No cancellation after booking • Schedule change is allowed with no additional fee',
  },
  {
    id: 2,
    code: 'CF',
    type: 'Comfort Ferry',
    from: 'Bangkok',
    fromPort: 'Bangkok Pier (BKK)',
    to: 'Koh Samui',
    toPort: 'Koh Samui Pier (KSM)',
    departTime: '08:55',
    arriveTime: '13:45',
    departDate: '2026-05-01',
    departGate: '3',
    arriveGate: '1',
    checkinTime: '45 mins before',
    checkoutTime: '20 mins',
    duration: '4h 50m',
    durationMinutes: 290,
    seats: 78,
    price: 650,
    fee: 40,
    logoColor: 'linear-gradient(135deg, #FFE0B2 0%, #FFD0A0 100%)',
    logoTextColor: 'var(--accent)',
    amenities: [
      { icon: 'fas fa-utensils', label: 'Food and drinks' },
      { icon: 'fas fa-couch', label: 'Comfort seats' },
      { icon: 'fas fa-check-double', label: 'Excellent service' },
    ],
    details: [
      { label: 'Seat', value: 'Reclining seats with entertainment' },
      { label: 'Restroom', value: '2 standard restrooms' },
      { label: 'Meal', value: 'Lunch and snacks included' },
    ],
    notes: '• Check in 45 minutes before departure • Free cancellation up to 24 hours • Free schedule change',
  },
  {
    id: 3,
    code: 'EE',
    type: 'Economy Express',
    from: 'Bangkok',
    fromPort: 'Bangkok Pier (BKK)',
    to: 'Koh Samui',
    toPort: 'Koh Samui Pier (KSM)',
    departTime: '18:55',
    arriveTime: '22:05',
    departDate: '2026-05-01',
    departGate: '7',
    arriveGate: '4',
    checkinTime: '1 hour before',
    checkoutTime: '30 mins',
    duration: '3h 10m',
    durationMinutes: 190,
    seats: 5,
    price: 450,
    fee: 30,
    logoColor: 'linear-gradient(135deg, #E0F2FF 0%, #FFF0E0 100%)',
    logoTextColor: 'var(--accent)',
    amenities: [
      { icon: 'fas fa-toilet', label: 'Restroom' },
      { icon: 'fas fa-user-check', label: 'Onboard support staff' },
    ],
    details: [
      { label: 'Seat', value: 'Standard seat' },
      { label: 'Restroom', value: '1 shared restroom' },
    ],
    notes: '• Check in 1 hour before departure • Limited seats available • Shared restroom',
  },
])

const sortedTickets = computed(() => {
  const list = [...tickets.value]
  if (sortBy.value === 'cheapest') return list.sort((a, b) => a.price - b.price)
  if (sortBy.value === 'fastest') return list.sort((a, b) => a.durationMinutes - b.durationMinutes)
  if (sortBy.value === 'longest') return list.sort((a, b) => b.durationMinutes - a.durationMinutes)
  return list
})

const handleSearch = (params) => {
  // Placeholder: filter/fetch tickets based on params
  console.log('Search params:', params)
}
</script>

<style scoped>
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}

.results-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px;
  border-radius: 4px;
  border: 0.5px solid rgb(227, 228, 232);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.results-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.results-title i {
  color: var(--primary);
}

.sort-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: var(--text-light);
}

.sort-btn {
  padding: 6px 12px;
  background: white;
  border: 0.5px solid rgb(227, 228, 232);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--text-light);
}

.sort-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.sort-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  .sidebar-area {
    display: none;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 12px;
    gap: 12px;
  }
  .results-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>


<style scoped>
.home-view {
  color: white;
}

.hero {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 3rem;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #667eea;
  color: white;
}

.btn-primary:hover {
  background-color: #5568d3;
  transform: translateY(-2px);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 0.5rem;
}
</style>
