<template>
  <div class="sidebar">
    <div class="filter-panel">
      <h3><i class="fas fa-tag"></i> {{ t('filters.price') }}</h3>
      <div class="price-range">
        <input type="range" min="0" max="2000" v-model="maxPrice">
        <div class="price-display">
          <span>฿0</span>
          <span>฿{{ Number(maxPrice).toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <div class="filter-panel">
      <h3><i class="fas fa-ship"></i> {{ t('filters.ferryType') }}</h3>
      <div class="filter-items">
        <div class="filter-item" v-for="item in ferryTypes" :key="item.id">
          <input type="checkbox" :id="item.id" v-model="item.checked">
          <label :for="item.id">{{ item.label }}</label>
          <span class="filter-item-count">{{ item.count }}</span>
        </div>
      </div>
    </div>

    <div class="filter-panel">
      <h3><i class="fas fa-clock"></i> {{ t('filters.departTime') }}</h3>
      <div class="filter-items">
        <div class="filter-item" v-for="item in timeSlots" :key="item.id">
          <input type="checkbox" :id="item.id" v-model="item.checked">
          <label :for="item.id">{{ item.label }}</label>
          <span class="filter-item-count">{{ item.count }}</span>
        </div>
      </div>
    </div>

    <div class="filter-panel">
      <h3><i class="fas fa-wifi"></i> {{ t('filters.amenities') }}</h3>
      <div class="filter-items">
        <div class="filter-item" v-for="item in amenities" :key="item.id">
          <input type="checkbox" :id="item.id" v-model="item.checked">
          <label :for="item.id">{{ item.label }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { t } from '../i18n'

const maxPrice = ref(1200)

const ferryTypes = computed(() => [
  { id: 'ferry1', label: 'Speed Ferry Premium', count: 7, checked: true },
  { id: 'ferry2', label: 'Comfort Ferry', count: 5, checked: true },
  { id: 'ferry3', label: 'Economy Express', count: 3, checked: false },
])

const timeSlots = computed(() => [
  { id: 'time1', label: t('filters.morning'), count: 8, checked: true },
  { id: 'time2', label: t('filters.afternoon'), count: 4, checked: false },
  { id: 'time3', label: t('filters.evening'), count: 2, checked: false },
])

const amenities = computed(() => [
  { id: 'amen1', label: 'WiFi', checked: true },
  { id: 'amen2', label: t('filters.food'), checked: true },
  { id: 'amen3', label: t('filters.vipRestroom'), checked: false },
])
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-panel {
  background: white;
  border-radius: 4px;
  padding: 16px;
  border: 0.5px solid rgb(227, 228, 232);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.filter-panel h3 {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-panel h3 i {
  color: var(--primary);
  font-size: 16px;
}

.filter-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 200ms;
}

.filter-item:hover {
  background: var(--light);
}

.filter-item input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  flex-shrink: 0;
}

.filter-item label {
  cursor: pointer;
  flex: 1;
  user-select: none;
  font-weight: 400;
  color: var(--text);
}

.filter-item-count {
  font-size: 12px;
  color: var(--text-lighter);
  margin-left: auto;
}

.price-range {
  margin-top: 4px;
}

.price-range input[type="range"] {
  width: 100%;
  cursor: pointer;
  accent-color: var(--primary);
}

.price-display {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 8px;
  color: var(--primary);
  font-weight: 500;
}
</style>
