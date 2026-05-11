<template>
  <div>
    <SearchSection :initial-values="searchFormInitial" @search="handleSearch" />

    <div class="main-content has-bottom-bar">
      <FilterSidebar class="sidebar-area" @filter-change="sidebarFilters = $event" />

      <div class="results-section">
        <!-- Round trip step indicator -->
        <div v-if="tripType === 'roundtrip'" class="trip-step-banner">
          <div class="step-item" :class="{ active: currentStep === 'outbound', done: !!selectedOutbound }">
            <span class="step-num">{{ selectedOutbound ? '✓' : '1' }}</span>
            <span>ขาไป</span>
          </div>
          <div class="step-connector"></div>
          <div class="step-item" :class="{ active: currentStep === 'return', done: !!selectedReturn, muted: !selectedOutbound }">
            <span class="step-num">{{ selectedReturn ? '✓' : '2' }}</span>
            <span>ขากลับ</span>
          </div>
        </div>

        <!-- Selected outbound summary (shown when picking return) -->
        <div v-if="tripType === 'roundtrip' && currentStep === 'return' && selectedOutbound" class="selected-leg-card">
          <div class="selected-leg-inner">
            <span class="leg-badge-pill out">ขาไป</span>
            <div class="selected-leg-info">
              <span class="selected-leg-route">{{ selectedOutbound.from }} → {{ selectedOutbound.to }}</span>
              <span class="selected-leg-time">{{ selectedOutbound.departTime }} — {{ selectedOutbound.arriveTime }} · {{ selectedOutbound.type }}</span>
            </div>
            <span class="selected-leg-price">฿{{ totalOutboundPrice.toLocaleString() }}</span>
          </div>
          <button class="change-leg-btn" @click="changeOutbound"><i class="fas fa-pencil-alt"></i> เปลี่ยน</button>
        </div>

        <!-- Return step section header -->
        <div v-if="tripType === 'roundtrip' && currentStep === 'return'" class="step-section-header">
          <span class="leg-badge-pill ret">ขากลับ</span>
          เลือกเที่ยวเรือขากลับ
        </div>

        <div class="results-header">
          <div class="results-title">
            <i class="fas fa-list"></i> {{ t('results.title') }} ({{ sortedTickets.length }} {{ t('results.tickets') }})
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

        <div v-if="loading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i> Searching...
        </div>

        <div v-else-if="sortedTickets.length === 0" class="empty-state">
          <i class="fas fa-ship"></i>
          <p>No tickets found. Try adjusting your search or filters.</p>
        </div>

        <TicketCard
          v-else
          v-for="ticket in sortedTickets"
          :key="ticket.id"
          :ticket="ticket"
          :search-params="searchParams"
          :managed="true"
          :force-selected="isTicketSelected(ticket)"
          @ticket-select="handleTicketSelect"
        />
      </div>
    </div>

    <!-- Mobile sticky bottom bar -->
    <MobileBookingBar
      :trip-type="tripType"
      :current-step="currentStep"
      :selected-oneway="selectedOneway"
      :selected-outbound="selectedOutbound"
      :selected-return="selectedReturn"
      :total-price="totalBarPrice"
      :outbound-price="totalOutboundPrice"
      :return-price="totalReturnPrice"
      :can-proceed="canProceed"
      @change-oneway="changeOneway"
      @change-outbound="changeOutbound"
      @change-return="changeReturn"
      @proceed="handleProceed"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import SearchSection from '../components/SearchSection.vue'
import FilterSidebar from '../components/FilterSidebar.vue'
import TicketCard from '../components/TicketCard.vue'
import MobileBookingBar from '../components/MobileBookingBar.vue'
import { ticketService } from '../services/api'
import { LOCATIONS } from '../services/mockData'
import { useBookingStore } from '../stores/booking'
import { t } from '../i18n'

const emit = defineEmits(['go-cart'])
const bookingStore = useBookingStore()

const sortBy = ref('fastest')
const loading = ref(false)
const baseTickets = ref([])
const sidebarFilters = ref({})
const searchParams = ref({ adults: 1, childAges: [] })
const searchFormInitial = ref(null)

const today = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

const DEFAULT_SEARCH = {
  tripType: 'oneway',
  from: 'Bangkok (BKK)',
  to: 'Koh Samui (KSM)',
  departDate: today,
  returnDate: nextWeek,
  adults: 1,
  children: 0,
  childAges: [],
}

// Round trip state
const tripType = ref('oneway')
const currentStep = ref('outbound')
const selectedOneway = ref(null)
const selectedOutbound = ref(null)
const selectedReturn = ref(null)
const returnTickets = ref([])
const lastSearchParams = ref({})

const sortOptions = computed(() => [
  { key: 'fastest', label: t('results.fastest') },
  { key: 'cheapest', label: t('results.cheapest') },
  { key: 'longest', label: t('results.longest') },
])

const normalizeLocationInput = (value) =>
  String(value || '')
    .replace(/\s*\([A-Z0-9]+\)\s*$/, '')
    .trim()

const getLocationId = (value) => {
  const text = String(value || '').trim()
  const inlineCode = text.match(/\(([A-Z0-9]+)\)\s*$/)?.[1]
  if (inlineCode) return inlineCode

  const lower = text.toLowerCase()
  const match = LOCATIONS.find((item) =>
    item.label.toLowerCase() === lower ||
    item.value.toLowerCase() === lower ||
    normalizeLocationInput(item.label).toLowerCase() === lower
  )

  if (!match) return text
  return match.label.match(/\(([A-Z0-9]+)\)\s*$/)?.[1] || match.value
}

const toLocationLabel = (raw, fallback) => {
  const normalized = String(raw || '').trim()
  if (!normalized) return fallback
  const lower = normalized.toLowerCase()
  const match = LOCATIONS.find((item) =>
    item.label.match(/\(([A-Z0-9]+)\)\s*$/)?.[1]?.toLowerCase() === lower ||
    item.label.toLowerCase() === lower ||
    item.value.toLowerCase() === lower ||
    normalizeLocationInput(item.label).toLowerCase() === lower
  )
  return match ? match.label : normalized
}

const buildQueryFromSearch = (params) => {
  const query = new URLSearchParams()
  query.set('tripType', params.tripType)
  query.set('from', getLocationId(params.from))
  query.set('to', getLocationId(params.to))
  if (params.departDate) {
    query.set('departDate', params.departDate)
  }
  if (params.tripType === 'roundtrip' && params.returnDate) {
    query.set('returnDate', params.returnDate)
  }
  query.set('adults', String(params.adults ?? 1))
  query.set('children', String(params.children ?? 0))
  if (params.childAges?.length) {
    const ages = params.childAges.filter((age) => age !== null && age !== undefined)
    if (ages.length) query.set('childAges', ages.join(','))
  }
  return query
}

const pushSearchToUrl = (params) => {
  const query = buildQueryFromSearch(params)
  const nextUrl = `${window.location.pathname}?${query.toString()}`
  window.history.pushState({}, '', nextUrl)
}

const parseSearchFromUrl = () => {
  const query = new URLSearchParams(window.location.search)
  const hasAnyQuery = query.toString().length > 0
  const hasFromTo = Boolean(query.get('from') && query.get('to'))
  const tripTypeValue = query.get('tripType')
  const tripType = tripTypeValue === 'roundtrip' ? 'roundtrip' : DEFAULT_SEARCH.tripType

  const adults = Math.max(1, Number(query.get('adults') || DEFAULT_SEARCH.adults))
  const children = Math.max(0, Number(query.get('children') || DEFAULT_SEARCH.children))

  const childAges = (query.get('childAges') || '')
    .split(',')
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isFinite(v) && v >= 0)
    .slice(0, children)

  return {
    tripType,
    from: toLocationLabel(query.get('from'), DEFAULT_SEARCH.from),
    to: toLocationLabel(query.get('to'), DEFAULT_SEARCH.to),
    departDate: hasFromTo && !query.get('departDate')
      ? ''
      : (query.get('departDate') || (hasAnyQuery ? '' : DEFAULT_SEARCH.departDate)),
    returnDate: query.get('returnDate') || (hasAnyQuery ? '' : DEFAULT_SEARCH.returnDate),
    adults,
    children,
    childAges,
  }
}

const isInTimeSlot = (departTime, slot) => {
  if (!departTime) return true
  const hour = parseInt(departTime.split(':')[0])
  if (slot === 'morning') return hour >= 6 && hour < 12
  if (slot === 'afternoon') return hour >= 12 && hour < 18
  if (slot === 'evening') return hour >= 18 || hour < 6
  return true
}

const displayedTickets = computed(() => {
  let list = [...currentBaseTickets.value]
  const f = sidebarFilters.value

  if (!f) return list

  if (f.maxPrice != null) {
    list = list.filter((t) => t.price <= f.maxPrice)
  }

  if (f.ferryTypes?.length) {
    list = list.filter((t) => f.ferryTypes.includes(t.type))
  }

  if (f.timeSlots?.length) {
    list = list.filter((t) => f.timeSlots.some((slot) => isInTimeSlot(t.departTime, slot)))
  }

  if (f.amenities?.length) {
    list = list.filter((ticket) =>
      f.amenities.some((wanted) =>
        ticket.amenities?.some((a) => a.label.toLowerCase().includes(wanted.toLowerCase()))
      )
    )
  }

  if (f.operators?.length) {
    list = list.filter((ticket) => f.operators.includes(ticket.operator))
  }

  return list
})

const sortedTickets = computed(() => {
  const list = [...displayedTickets.value]
  if (sortBy.value === 'cheapest') return list.sort((a, b) => a.price - b.price)
  if (sortBy.value === 'fastest') return list.sort((a, b) => a.durationMinutes - b.durationMinutes)
  if (sortBy.value === 'longest') return list.sort((a, b) => b.durationMinutes - a.durationMinutes)
  return list
})

// -- Round trip helpers --
const currentBaseTickets = computed(() => {
  if (tripType.value === 'roundtrip' && currentStep.value === 'return') {
    return returnTickets.value
  }
  return baseTickets.value
})

const computeBreakdown = (ticket) => {
  if (!ticket) return []
  const rows = []
  const { adults = 1, childAges = [] } = searchParams.value
  const p = ticket.pricing
  if (adults > 0) rows.push({ label: `Adult x${adults}`, amount: adults * p.adult })
  childAges.forEach((age) => {
    if (age === null) return
    const amount = age >= 12 ? p.adult : age >= 5 ? p.child : 0
    const cat = age >= 12 ? 'Adult' : age >= 5 ? 'Child' : 'Toddler'
    rows.push({ label: `${cat} (age ${age}) x1`, amount })
  })
  return rows
}

const outboundBreakdown = computed(() => computeBreakdown(selectedOutbound.value))
const returnBreakdown = computed(() => computeBreakdown(selectedReturn.value))
const onewayBreakdown = computed(() => computeBreakdown(selectedOneway.value))
const totalOutboundPrice = computed(() => outboundBreakdown.value.reduce((s, r) => s + r.amount, 0))
const totalReturnPrice = computed(() => returnBreakdown.value.reduce((s, r) => s + r.amount, 0))
const totalOnewayPrice = computed(() => onewayBreakdown.value.reduce((s, r) => s + r.amount, 0))
const totalCombinedPrice = computed(() => totalOutboundPrice.value + totalReturnPrice.value)
const totalBarPrice = computed(() =>
  tripType.value === 'roundtrip' ? totalCombinedPrice.value : totalOnewayPrice.value
)
const canProceed = computed(() =>
  tripType.value === 'roundtrip'
    ? !!(selectedOutbound.value && selectedReturn.value)
    : !!selectedOneway.value
)

const isTicketSelected = (ticket) => {
  if (tripType.value === 'oneway') return selectedOneway.value?.id === ticket.id
  if (currentStep.value === 'outbound') return selectedOutbound.value?.id === ticket.id
  return selectedReturn.value?.id === ticket.id
}

const handleTicketSelect = async (ticket) => {
  if (tripType.value === 'oneway') {
    selectedOneway.value = selectedOneway.value?.id === ticket.id ? null : ticket
    return
  }
  if (currentStep.value === 'outbound') {
    selectedOutbound.value = ticket
    currentStep.value = 'return'
    await loadReturnTickets()
  } else {
    selectedReturn.value = selectedReturn.value?.id === ticket.id ? null : ticket
  }
}

const loadReturnTickets = async () => {
  loading.value = true
  try {
    returnTickets.value = await ticketService.searchTickets({
      from: lastSearchParams.value.to,
      to: lastSearchParams.value.from,
      departDate: lastSearchParams.value.returnDate,
    })
  } finally {
    loading.value = false
  }
}

const changeOutbound = () => {
  selectedOutbound.value = null
  selectedReturn.value = null
  currentStep.value = 'outbound'
}

const changeReturn = () => {
  selectedReturn.value = null
}

const changeOneway = () => {
  selectedOneway.value = null
}

const handleProceed = () => {
  if (tripType.value === 'oneway' && selectedOneway.value) {
    bookingStore.addToCart({
      id: `ow-${selectedOneway.value.id}-${Date.now()}`,
      departure: selectedOneway.value.from,
      destination: selectedOneway.value.to,
      date: selectedOneway.value.departDate,
      time: selectedOneway.value.departTime,
      type: selectedOneway.value.type,
      price: totalOnewayPrice.value || selectedOneway.value.pricing.adult,
      priceBreakdown: onewayBreakdown.value,
    })
    emit('go-cart')
    return
  }
  if (selectedOutbound.value) {
    bookingStore.addToCart({
      id: `out-${selectedOutbound.value.id}-${Date.now()}`,
      departure: selectedOutbound.value.from,
      destination: selectedOutbound.value.to,
      date: selectedOutbound.value.departDate,
      time: selectedOutbound.value.departTime,
      type: selectedOutbound.value.type,
      leg: 'ขาไป',
      price: totalOutboundPrice.value || selectedOutbound.value.pricing.adult,
      priceBreakdown: outboundBreakdown.value,
    })
  }
  if (selectedReturn.value) {
    bookingStore.addToCart({
      id: `ret-${selectedReturn.value.id}-${Date.now()}`,
      departure: selectedReturn.value.from,
      destination: selectedReturn.value.to,
      date: selectedReturn.value.departDate,
      time: selectedReturn.value.departTime,
      type: selectedReturn.value.type,
      leg: 'ขากลับ',
      price: totalReturnPrice.value || selectedReturn.value.pricing.adult,
      priceBreakdown: returnBreakdown.value,
    })
  }
  emit('go-cart')
}

const loadTickets = async (params = {}) => {
  loading.value = true
  try {
    baseTickets.value = await ticketService.searchTickets(params)
  } finally {
    loading.value = false
  }
}

const handleSearch = (params, options = { updateUrl: true }) => {
  tripType.value = params.tripType
  currentStep.value = 'outbound'
  selectedOneway.value = null
  selectedOutbound.value = null
  selectedReturn.value = null
  returnTickets.value = []
  lastSearchParams.value = {
    from: params.from,
    to: params.to,
    departDate: params.departDate,
    returnDate: params.returnDate,
  }
  searchParams.value = {
    adults: params.adults,
    childAges: params.childAges,
  }

  searchFormInitial.value = {
    ...params,
  }

  if (options.updateUrl) {
    pushSearchToUrl(params)
  }

  loadTickets({
    from: params.from,
    to: params.to,
    departDate: params.departDate,
  })
}

const handlePopState = () => {
  const parsed = parseSearchFromUrl()
  handleSearch(parsed, { updateUrl: false })
}

onMounted(() => {
  const parsed = parseSearchFromUrl()
  searchFormInitial.value = { ...parsed }
  handleSearch(parsed, { updateUrl: false })
  window.addEventListener('popstate', handlePopState)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handlePopState)
})
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

.loading-state,
.empty-state {
  background: white;
  border: 0.5px solid rgb(227, 228, 232);
  border-radius: 4px;
  padding: 48px 24px;
  text-align: center;
  color: var(--text-light);
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-state i,
.loading-state i {
  font-size: 32px;
  color: var(--primary);
  opacity: 0.4;
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

.has-bottom-bar {
  padding-bottom: 160px;
}

@media (max-width: 768px) {
  .has-bottom-bar {
    padding-bottom: 200px;
  }
}

/* Round trip step banner */
.trip-step-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 12px 16px;
  border-radius: 4px;
  border: 0.5px solid rgb(227, 228, 232);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-lighter);
  transition: color 150ms;
}

.step-item.active {
  color: var(--primary);
  font-weight: 600;
}

.step-item.done {
  color: #4caf50;
}

.step-item.muted {
  opacity: 0.4;
}

.step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--border);
  color: var(--text-light);
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-item.active .step-num {
  background: var(--primary);
  color: white;
}

.step-item.done .step-num {
  background: #4caf50;
  color: white;
}

.step-connector {
  flex: 1;
  height: 1px;
  background: var(--border);
}

/* Selected leg summary */
.selected-leg-card {
  background: #f0f9f4;
  border: 0.5px solid #a5d6b0;
  border-radius: 4px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.selected-leg-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.leg-badge-pill {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 10px;
  flex-shrink: 0;
}

.leg-badge-pill.out {
  background: var(--primary);
  color: white;
}

.leg-badge-pill.ret {
  background: var(--accent);
  color: white;
}

.selected-leg-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.selected-leg-route {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selected-leg-time {
  font-size: 11px;
  color: var(--text-light);
}

.selected-leg-price {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
  flex-shrink: 0;
}

.change-leg-btn {
  font-size: 12px;
  color: var(--primary);
  background: none;
  border: 1px solid var(--primary);
  border-radius: 4px;
  padding: 4px 10px;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}

.change-leg-btn:hover {
  background: var(--primary-light);
}

/* Return section header */
.step-section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  padding: 4px 0;
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
  .has-bottom-bar {
    padding-bottom: 180px;
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
