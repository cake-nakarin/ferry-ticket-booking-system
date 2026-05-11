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
        <div class="filter-item" v-for="item in amenityFilters" :key="item.id">
          <input type="checkbox" :id="item.id" v-model="item.checked">
          <label :for="item.id">{{ item.label }}</label>
        </div>
      </div>
    </div>

    <div class="filter-panel">
      <h3><i class="fas fa-building"></i> Operator</h3>
      <div class="filter-items">
        <div class="filter-item" v-for="item in operatorFilters" :key="item.id">
          <input type="checkbox" :id="item.id" v-model="item.checked">
          <label :for="item.id">{{ item.label }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watchEffect } from 'vue'
import { t } from '../i18n'
import { OPERATORS } from '../services/mockData'

const emit = defineEmits(['filter-change'])

const maxPrice = ref(2000)

const ferryTypes = reactive([
  { id: 'ferry1', label: 'Speed Ferry Premium', value: 'Speed Ferry Premium', count: 3, checked: true },
  { id: 'ferry2', label: 'Comfort Ferry', value: 'Comfort Ferry', count: 2, checked: true },
  { id: 'ferry3', label: 'Economy Express', value: 'Economy Express', count: 2, checked: true },
])

const timeSlots = reactive([
  { id: 'time1', label: 'Morning (06:00 - 12:00)', value: 'morning', count: 3, checked: true },
  { id: 'time2', label: 'Afternoon (12:00 - 18:00)', value: 'afternoon', count: 2, checked: true },
  { id: 'time3', label: 'Evening (18:00 - 23:59)', value: 'evening', count: 2, checked: true },
])

const amenityFilters = reactive([
  { id: 'amen1', label: 'WiFi', value: 'WiFi', checked: false },
  { id: 'amen2', label: 'Food and drinks', value: 'Food and drinks', checked: false },
  { id: 'amen3', label: 'VIP restroom', value: 'VIP restroom', checked: false },
])

const operatorFilters = reactive(
  OPERATORS.map((op, i) => ({ id: `op${i + 1}`, label: op.label, value: op.value, checked: true }))
)

watchEffect(() => {
  emit('filter-change', {
    maxPrice: maxPrice.value,
    ferryTypes: ferryTypes.filter((f) => f.checked).map((f) => f.value),
    timeSlots: timeSlots.filter((s) => s.checked).map((s) => s.value),
    amenities: amenityFilters.filter((a) => a.checked).map((a) => a.value),
    operators: operatorFilters.filter((o) => o.checked).map((o) => o.value),
  })
})
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
