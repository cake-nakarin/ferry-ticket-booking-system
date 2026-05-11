<template>
  <div
    class="trip-card"
    :class="{ expanded: isExpanded, 'sold-out': isSoldOut }"
    style="position: relative;"
  >
    <button class="trip-expand-btn" @click.stop="isExpanded = !isExpanded">
      <i class="fas fa-chevron-down"></i>
    </button>

    <div v-if="isSoldOut" class="sold-out-badge">SOLD OUT</div>

    <div class="trip-card-main" @click="isExpanded = !isExpanded">
      <div class="trip-logo" :style="logoStyle" @click.stop="openPhotoTab">
        <img
          v-if="ticket.image"
          :src="ticket.image"
          :alt="ticket.type"
          class="trip-logo-img"
        />
        <span class="trip-logo-code">{{ ticket.code }}</span>
      </div>

      <div class="trip-details">
        <div class="trip-details-left">
          <div class="trip-airline" @click.stop="openPhotoTab">{{ ticket.type }}</div>
          <div class="trip-operator" v-if="ticket.operator">
            <i class="fas fa-building"></i> {{ ticket.operator }}
          </div>
          <div class="trip-route">
            {{ ticket.departTime }}
            <i class="fas fa-arrow-right"></i>
            {{ ticket.arriveTime }}
          </div>
          <div class="trip-duration">
            {{ ticket.duration }}
            <span v-if="isSoldOut" class="seats-badge sold">✕ Sold out</span>
            <span v-else-if="ticket.seats <= 10" class="seats-badge low">⚠ {{ ticket.seats }} seats left</span>
            <span v-else class="seats-badge ok">{{ ticket.seats }} {{ t('ticket.seatsLeft') }}</span>
          </div>
        </div>
        <div class="trip-details-right">
          <div class="trip-amenity" v-for="amenity in ticket.amenities" :key="amenity.icon">
            <i :class="amenity.icon"></i> {{ amenity.label }}
          </div>
        </div>
      </div>

      <div class="trip-action">
        <div class="trip-price">
          <div class="trip-price-label">{{ t('ticket.pricePerPerson') }}</div>
          <div class="trip-price-value">฿{{ ticket.pricing.adult.toLocaleString() }}</div>
          <div class="trip-price-total">Total ฿{{ totalPrice.toLocaleString() }}</div>
        </div>
        <button
          class="book-btn"
          :class="{ selected: isSelected || forceSelected, disabled: isSoldOut }"
          :disabled="isSoldOut"
          @click.stop="toggleSelect"
        >
          <i :class="isSoldOut ? 'fas fa-ban' : isSelected ? 'fas fa-check' : 'fas fa-shopping-cart'"></i>
          {{ isSoldOut ? 'Sold Out' : isSelected ? t('ticket.selected') : t('ticket.select') }}
        </button>
      </div>
    </div>

    <div class="trip-details-expanded" v-show="isExpanded">
      <div class="expanded-tabs">
        <button
          class="expanded-tab"
          :class="{ active: activeTab === 'route' }"
          @click.stop="activeTab = 'route'"
        >
          <i class="fas fa-route"></i> Route details
        </button>
        <button
          class="expanded-tab"
          :class="{ active: activeTab === 'photos' }"
          @click.stop="activeTab = 'photos'"
        >
          <i class="fas fa-images"></i> Photos
        </button>
        <button
          class="expanded-tab"
          :class="{ active: activeTab === 'service' }"
          @click.stop="activeTab = 'service'"
        >
          <i class="fas fa-list-check"></i> Service details
        </button>
        <button
          class="expanded-tab"
          :class="{ active: activeTab === 'price' }"
          @click.stop="activeTab = 'price'"
        >
          <i class="fas fa-receipt"></i> Price summary
        </button>
      </div>

      <div class="expanded-tab-content">
        <!-- Route details -->
        <div v-if="activeTab === 'route'">
          <div class="journey-timeline">
            <div class="timeline-segment">
              <div class="timeline-time">
                <div class="timeline-hour">{{ ticket.departTime }}</div>
                <div class="timeline-dot"></div>
              </div>
              <div class="timeline-content">
                <div class="timeline-location"><i class="fas fa-anchor"></i> {{ ticket.from }}</div>
                <div class="timeline-airport">{{ ticket.fromPort }}</div>
                <div class="timeline-details">
                  <div class="timeline-detail-item"><i class="fas fa-door-open"></i> {{ t('ticket.gate') }} {{ ticket.departGate }}</div>
                  <div class="timeline-detail-item"><i class="fas fa-info-circle"></i> {{ t('ticket.checkin') }} {{ ticket.checkinTime }}</div>
                </div>
              </div>
            </div>

            <div class="timeline-segment">
              <div class="timeline-time">
                <div class="timeline-hour" style="font-size: 13px; color: var(--text-lighter);">{{ ticket.duration }}</div>
              </div>
              <div class="timeline-content" style="font-size: 12px; color: var(--text-lighter);">
                ⟶ {{ t('ticket.travel') }}
              </div>
            </div>

            <div class="timeline-segment">
              <div class="timeline-time">
                <div class="timeline-hour">{{ ticket.arriveTime }}</div>
                <div class="timeline-dot"></div>
              </div>
              <div class="timeline-content">
                <div class="timeline-location"><i class="fas fa-anchor"></i> {{ ticket.to }}</div>
                <div class="timeline-airport">{{ ticket.toPort }}</div>
                <div class="timeline-details">
                  <div class="timeline-detail-item"><i class="fas fa-door-open"></i> {{ t('ticket.gate') }} {{ ticket.arriveGate }}</div>
                  <div class="timeline-detail-item"><i class="fas fa-clock"></i> {{ t('ticket.checkout') }} {{ ticket.checkoutTime }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="ticket.notes" class="expanded-notes" style="margin-top: 12px;">
            <strong><i class="fas fa-info-circle"></i> {{ t('ticket.terms') }}</strong>
            {{ ticket.notes }}
          </div>
        </div>

        <!-- Photos -->
        <div v-else-if="activeTab === 'photos'">
          <div v-if="ticket.images?.length" class="photo-gallery">
            <div class="gallery-main">
              <div
                class="gallery-track"
                :style="{ transform: `translateX(-${activePhotoIndex * 100}%)` }"
              >
                <img
                  v-for="(img, i) in galleryImages"
                  :key="img.url + i"
                  :src="img.url"
                  :alt="img.caption"
                  class="gallery-main-img"
                />
              </div>

              <div class="gallery-caption">{{ galleryImages[activePhotoIndex].caption }}</div>
              <div class="gallery-type-overlay">
                <span>{{ ticket.type }}</span>
                <span class="gallery-operator"><i class="fas fa-building"></i> {{ ticket.operator }}</span>
              </div>
            </div>

            <div class="carousel-footer">
              <div class="carousel-arrows">
                <button class="carousel-nav" @click.stop="prevPhoto" aria-label="Previous photo">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-nav" @click.stop="nextPhoto" aria-label="Next photo">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>

              <div class="carousel-dots" role="tablist" aria-label="Photo positions">
                <button
                  v-for="(img, i) in galleryImages"
                  :key="`dot-${img.url}-${i}`"
                  class="carousel-dot"
                  :class="{ active: i === activePhotoIndex }"
                  @click.stop="activePhotoIndex = i"
                  :aria-label="`Go to photo ${i + 1}`"
                ></button>
              </div>
            </div>
          </div>
          <div v-else class="no-photo-state">
            <i class="fas fa-image"></i>
            <span>No vehicle photos available</span>
          </div>
        </div>

        <!-- Service details -->
        <div v-else-if="activeTab === 'service'">
          <div class="expanded-content">
            <div class="expanded-item" v-for="detail in ticket.details" :key="detail.label">
              <span class="expanded-item-label">{{ detail.label }}</span>
              <span class="expanded-item-value">{{ detail.value }}</span>
            </div>
          </div>
        </div>

        <!-- Price summary -->
        <div v-else-if="activeTab === 'price'">
          <div class="expanded-content">
            <div class="expanded-item">
              <span class="expanded-item-label">Adult (age 12+)</span>
              <span class="expanded-item-value" style="color: var(--accent);">฿{{ ticket.pricing.adult.toLocaleString() }}</span>
            </div>
            <div class="expanded-item">
              <span class="expanded-item-label">Child (age 5–11)</span>
              <span class="expanded-item-value" style="color: var(--accent);">฿{{ ticket.pricing.child.toLocaleString() }}</span>
            </div>
            <div class="expanded-item">
              <span class="expanded-item-label">Toddler (under 5)</span>
              <span class="expanded-item-value" style="color: #4caf50;">Free</span>
            </div>
            <div class="expanded-item">
              <span class="expanded-item-label">{{ t('ticket.fee') }}</span>
              <span class="expanded-item-value">฿{{ ticket.fee }}</span>
            </div>
          </div>

          <div class="price-breakdown">
            <div class="price-breakdown-title">Your trip breakdown</div>
            <div class="price-breakdown-row" v-for="row in priceBreakdownRows" :key="row.label">
              <span>{{ row.label }}</span>
              <span>{{ row.amount === 0 ? 'Free' : '฿' + row.amount.toLocaleString() }}</span>
            </div>
            <div class="price-breakdown-total">
              <span>Total</span>
              <span>฿{{ totalPrice.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBookingStore } from '../stores/booking'
import { t } from '../i18n'

const props = defineProps({
  ticket: { type: Object, required: true },
  searchParams: { type: Object, default: () => ({ adults: 1, childAges: [] }) },
  managed: { type: Boolean, default: false },
  forceSelected: { type: Boolean, default: false },
})

const emit = defineEmits(['ticket-select'])

const bookingStore = useBookingStore()
const isExpanded = ref(false)
const isSelected = ref(false)
const activeTab = ref('route')
const activePhotoIndex = ref(0)

const galleryImages = computed(() => props.ticket.images ?? [])
const openPhotoTab = () => {
  isExpanded.value = true
  activeTab.value = 'photos'
  activePhotoIndex.value = 0
}

const changePhoto = (step) => {
  const total = galleryImages.value.length
  if (!total) return
  activePhotoIndex.value = (activePhotoIndex.value + step + total) % total
}

const prevPhoto = () => changePhoto(-1)
const nextPhoto = () => changePhoto(1)

const isSoldOut = computed(() => props.ticket.seats === 0)

const logoStyle = computed(() => {
  if (props.ticket.logoColor) {
    return { background: props.ticket.logoColor, color: props.ticket.logoTextColor || 'var(--primary)' }
  }
  return {}
})

const getPriceForAge = (age) => {
  const p = props.ticket.pricing
  if (age >= 12) return p.adult
  if (age >= 5) return p.child
  return p.toddler
}

const priceBreakdownRows = computed(() => {
  const rows = []
  const { adults = 1, childAges = [] } = props.searchParams
  const p = props.ticket.pricing

  if (adults > 0) {
    rows.push({ label: `Adult x${adults}`, amount: adults * p.adult })
  }

  childAges.forEach((age, i) => {
    if (age === null) return
    const amount = getPriceForAge(age)
    const category = age >= 12 ? 'Adult' : age >= 5 ? 'Child' : 'Toddler'
    rows.push({ label: `${category} (age ${age}) x1`, amount })
  })

  return rows
})

const totalPrice = computed(() =>
  priceBreakdownRows.value.reduce((sum, r) => sum + r.amount, 0)
)

const hasPriceSummary = computed(() => {
  const { adults = 1, childAges = [] } = props.searchParams
  return adults > 1 || childAges.some((a) => a !== null)
})

const toggleSelect = () => {
  if (isSoldOut.value) return

  if (props.managed) {
    emit('ticket-select', props.ticket)
    return
  }

  if (isSelected.value) {
    isSelected.value = false
    bookingStore.removeFromCartById(props.ticket.id)
  } else {
    isSelected.value = true
    bookingStore.addToCart({
      id: props.ticket.id,
      departure: props.ticket.from,
      destination: props.ticket.to,
      date: props.ticket.departDate,
      time: props.ticket.departTime,
      price: totalPrice.value || props.ticket.pricing.adult,
      type: props.ticket.type,
      priceBreakdown: priceBreakdownRows.value,
    })
  }
}
</script>

<style scoped>
.trip-card {
  background: white;
  border: 0.5px solid rgb(227, 228, 232);
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.trip-card:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.trip-card-main {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  cursor: pointer;
}

.trip-card.expanded .trip-card-main {
  border-bottom: 0.5px solid rgb(227, 228, 232);
  padding-bottom: 16px;
  margin-bottom: 0;
}

.trip-logo {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, var(--primary-light) 0%, #E1F5FE 100%);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: var(--primary);
  flex-shrink: 0;
  border: 0.5px solid rgb(227, 228, 232);
  position: relative;
  overflow: hidden;
}

.trip-logo-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.trip-logo-code {
  position: relative;
  z-index: 1;
  background: rgba(0, 0, 0, 0.42);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 0.5px;
}

.photo-gallery {
  margin-bottom: 14px;
  border-radius: 8px;
  overflow: hidden;
  border: 0.5px solid var(--border);
  background: #ececec;
  padding: 14px;
}

.gallery-main {
  position: relative;
  overflow: hidden;
  background: #000;
  border-radius: 6px;
  aspect-ratio: 4 / 3;
}

.gallery-track {
  display: flex;
  height: 100%;
  transition: transform 280ms ease;
}

.gallery-main-img {
  width: 100%;
  min-width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 12px;
  font-size: 12px;
  color: rgba(255,255,255,0.92);
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%);
}

.gallery-type-overlay {
  position: absolute;
  top: 10px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gallery-type-overlay span:first-child {
  background: rgba(0,0,0,0.58);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 3px;
}

.gallery-operator {
  background: rgba(0,0,0,0.46);
  color: rgba(255,255,255,0.88);
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.carousel-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px 0 2px;
}

.carousel-arrows {
  display: flex;
  align-items: center;
  gap: 10px;
}

.carousel-nav {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #c6c6c6;
  background: #f6f6f6;
  color: #333;
  cursor: pointer;
}

.carousel-nav:hover {
  background: #ebebeb;
}

.carousel-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
}

.carousel-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: none;
  background: #c4c4c4;
  cursor: pointer;
  opacity: 0.9;
  transition: transform 120ms, background 120ms;
}

.carousel-dot.active {
  background: #8ea09c;
  transform: scale(1.12);
}

@media (max-width: 640px) {
  .photo-gallery {
    padding: 10px;
  }

  .carousel-nav {
    width: 24px;
    height: 24px;
  }

  .carousel-dot {
    width: 8px;
    height: 8px;
  }
}

.trip-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.trip-details-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.trip-airline {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-light);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.trip-operator {
  font-size: 11px;
  color: var(--primary);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
.trip-airline:hover {
  color: var(--primary);
}
  gap: 4px;
  margin-top: 1px;
}

.trip-operator i {
.no-photo-state {
  min-height: 120px;
  border: 1px dashed var(--border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-light);
  font-size: 13px;
}
  font-size: 10px;
}

.trip-route {
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.trip-route i {
  color: var(--text-lighter);
  font-size: 12px;
}

.trip-duration {
  font-size: 12px;
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.seats-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 10px;
}

.seats-badge.ok {
  background: #E8F5E9;
  color: #388E3C;
}

.seats-badge.low {
  background: #FFF3E0;
  color: #E65100;
}

.seats-badge.sold {
  background: #FFEBEE;
  color: #C62828;
}

.trip-details-right {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

.trip-amenity {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-light);
}

.trip-amenity i {
  color: var(--primary);
  font-size: 12px;
  width: 14px;
  text-align: center;
}

.trip-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  min-width: 130px;
}

.trip-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.trip-price-label {
  font-size: 11px;
  color: var(--text-light);
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.trip-price-value {
  font-size: 22px;
  font-weight: 600;
  color: var(--accent);
}

.trip-price-total {
  font-size: 11px;
  color: var(--text-light);
  margin-top: 2px;
}

.book-btn {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.book-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2);
}

.book-btn.selected {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
}

.book-btn.disabled,
.book-btn:disabled {
  background: linear-gradient(135deg, #bdbdbd 0%, #9e9e9e 100%);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.sold-out-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #C62828;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 3px;
  letter-spacing: 0.8px;
  z-index: 2;
}

.trip-card.sold-out {
  opacity: 0.7;
  background: #fafafa;
}

.trip-card.sold-out .trip-logo {
  filter: grayscale(0.5);
}

.price-breakdown {
  margin-top: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 12px;
}

.price-breakdown-title {
  font-weight: 600;
  color: var(--text);
  margin-bottom: 6px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-breakdown-row {
  display: flex;
  justify-content: space-between;
  color: var(--text-light);
  padding: 2px 0;
}

.price-breakdown-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  color: var(--accent);
  border-top: 1px solid var(--border);
  margin-top: 6px;
  padding-top: 6px;
  font-size: 13px;
}

.trip-expand-btn {
  position: absolute;
  right: 12px;
  top: 12px;
  background: none;
  border: none;
  color: var(--text-lighter);
  cursor: pointer;
  font-size: 14px;
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trip-expand-btn:hover {
  color: var(--primary);
}

.trip-card.expanded .trip-expand-btn {
  transform: rotate(180deg);
}

.trip-details-expanded {
  padding-top: 12px;
}

.expanded-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--border);
  margin-bottom: 14px;
}

.expanded-tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 150ms, border-color 150ms;
  white-space: nowrap;
}

.expanded-tab:hover {
  color: var(--primary);
}

.expanded-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
  font-weight: 600;
}

.expanded-tab i {
  font-size: 11px;
}

.expanded-tab-content {
  min-height: 80px;
}

.expanded-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.expanded-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #FAFAFA;
  border-radius: 4px;
  font-size: 13px;
}

.expanded-item-label {
  color: var(--text-light);
}

.expanded-item-value {
  color: var(--text);
  font-weight: 500;
}

.expanded-notes {
  background: linear-gradient(135deg, var(--primary-light) 0%, rgba(227, 242, 253, 0.5) 100%);
  border-left: 3px solid var(--primary);
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--text);
  line-height: 1.6;
}

.expanded-notes strong {
  color: var(--primary);
  display: block;
  margin-bottom: 4px;
}

.journey-timeline {
  padding: 8px 0;
}

.timeline-segment {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 16px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 0.5px solid rgb(227, 228, 232);
}

.timeline-segment:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.timeline-time {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.timeline-hour {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.timeline-dot {
  width: 10px;
  height: 10px;
  background: var(--primary);
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px var(--primary);
  margin-top: 2px;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-location {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeline-location i {
  color: var(--primary);
}

.timeline-airport {
  font-size: 12px;
  color: var(--text-light);
}

.timeline-details {
  display: flex;
  gap: 16px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.timeline-detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-light);
}

.timeline-detail-item i {
  color: var(--primary);
  width: 14px;
  text-align: center;
}

/* ── Tablet (≤ 768px) ─────────────────────────────────── */
@media (max-width: 768px) {
  .trip-card-main {
    grid-template-columns: auto 1fr;
  }

  .trip-action {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    min-width: unset;
    border-top: 0.5px solid rgb(227, 228, 232);
    padding-top: 10px;
    margin-top: 4px;
  }

  .trip-price {
    align-items: flex-start;
  }

  .book-btn {
    width: auto;
    padding: 10px 20px;
  }

  .trip-details {
    grid-template-columns: 1fr;
  }

  .expanded-tabs {
    overflow-x: auto;
    scrollbar-width: none;
  }

  .expanded-tabs::-webkit-scrollbar {
    display: none;
  }
}

/* ── Mobile (≤ 480px) ─────────────────────────────────── */
@media (max-width: 480px) {
  .trip-card {
    padding: 12px;
  }

  .trip-expand-btn {
    top: 10px;
    right: 8px;
  }

  .trip-logo {
    width: 56px;
    height: 56px;
    font-size: 20px;
  }

  .trip-logo-code {
    font-size: 11px;
    padding: 1px 5px;
  }

  .trip-route {
    font-size: 14px;
  }

  .trip-price-value {
    font-size: 18px;
  }

  .trip-price-label {
    font-size: 10px;
  }

  .trip-price-total {
    font-size: 10px;
  }

  .trip-details-right {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;
  }

  .trip-amenity {
    background: #f0f4ff;
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 11px;
  }

  .expanded-tab {
    padding: 7px 10px;
    font-size: 11px;
  }

  .expanded-tab i {
    display: none;
  }

  .expanded-content {
    grid-template-columns: 1fr;
  }

  .timeline-segment {
    grid-template-columns: 64px 1fr;
    gap: 10px;
  }

  .timeline-details {
    flex-direction: column;
    gap: 4px;
  }

  .photo-gallery {
    padding: 8px;
  }

  .sold-out-badge {
    top: 8px;
    left: 8px;
  }
}
</style>


<style scoped>
.ticket-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.ticket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
}

.card-header h4 {
  margin: 0;
}

.card-body {
  padding: 1rem;
  color: #333;
}

.card-body p {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.card-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #667eea;
  color: white;
}

.btn-primary:hover {
  background-color: #5568d3;
}
</style>
