<template>
  <div class="trip-card" :class="{ expanded: isExpanded }" style="position: relative;">
    <button class="trip-expand-btn" @click.stop="isExpanded = !isExpanded">
      <i class="fas fa-chevron-down"></i>
    </button>

    <div class="trip-card-main" @click="isExpanded = !isExpanded">
      <div class="trip-logo" :style="logoStyle">{{ ticket.code }}</div>

      <div class="trip-details">
        <div class="trip-details-left">
          <div class="trip-airline">{{ ticket.type }}</div>
          <div class="trip-route">
            {{ ticket.departTime }}
            <i class="fas fa-arrow-right"></i>
            {{ ticket.arriveTime }}
          </div>
          <div class="trip-duration">{{ ticket.duration }} • {{ ticket.seats }} {{ t('ticket.seatsLeft') }}</div>
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
          <div class="trip-price-value">฿{{ ticket.price.toLocaleString() }}</div>
        </div>
        <button
          class="book-btn"
          :class="{ selected: isSelected }"
          @click.stop="toggleSelect"
        >
          <i :class="isSelected ? 'fas fa-check' : 'fas fa-shopping-cart'"></i>
          {{ isSelected ? t('ticket.selected') : t('ticket.select') }}
        </button>
      </div>
    </div>

    <div class="trip-details-expanded" v-show="isExpanded">
      <div class="expanded-section">
        <div class="expanded-section-title"><i class="fas fa-route"></i> {{ t('ticket.route') }}</div>
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
      </div>

      <div class="expanded-section">
        <div class="expanded-section-title"><i class="fas fa-list-check"></i> {{ t('ticket.service') }}</div>
        <div class="expanded-content">
          <div class="expanded-item" v-for="detail in ticket.details" :key="detail.label">
            <span class="expanded-item-label">{{ detail.label }}</span>
            <span class="expanded-item-value">{{ detail.value }}</span>
          </div>
        </div>
      </div>

      <div class="expanded-section">
        <div class="expanded-section-title"><i class="fas fa-receipt"></i> {{ t('ticket.pricing') }}</div>
        <div class="expanded-content">
          <div class="expanded-item">
            <span class="expanded-item-label">{{ t('ticket.ticketPrice') }}</span>
            <span class="expanded-item-value" style="color: var(--accent);">฿{{ ticket.price.toLocaleString() }}</span>
          </div>
          <div class="expanded-item">
            <span class="expanded-item-label">{{ t('ticket.fee') }}</span>
            <span class="expanded-item-value">฿{{ ticket.fee }}</span>
          </div>
        </div>
      </div>

      <div class="expanded-section">
        <div class="expanded-notes">
          <strong><i class="fas fa-info-circle"></i> {{ t('ticket.terms') }}</strong>
          {{ ticket.notes }}
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
  ticket: { type: Object, required: true }
})

const bookingStore = useBookingStore()
const isExpanded = ref(false)
const isSelected = ref(false)

const logoStyle = computed(() => {
  if (props.ticket.logoColor) {
    return { background: props.ticket.logoColor, color: props.ticket.logoTextColor || 'var(--primary)' }
  }
  return {}
})

const toggleSelect = () => {
  if (isSelected.value) {
    isSelected.value = false
  } else {
    isSelected.value = true
    bookingStore.addToCart({
      id: props.ticket.id,
      departure: props.ticket.from,
      destination: props.ticket.to,
      date: props.ticket.departDate,
      time: props.ticket.departTime,
      price: props.ticket.price,
      type: props.ticket.type
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
  text-transform: uppercase;
  letter-spacing: 0.3px;
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
  padding-top: 16px;
}

.expanded-section {
  margin-bottom: 16px;
}

.expanded-section:last-child {
  margin-bottom: 0;
}

.expanded-section-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.expanded-section-title i {
  color: var(--primary);
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

@media (max-width: 768px) {
  .trip-card-main {
    grid-template-columns: auto 1fr;
  }
  .trip-action {
    grid-column: 1 / -1;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
  }
  .trip-details {
    grid-template-columns: 1fr;
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
