<template>
  <div class="mobile-booking-bar">
    <div class="booking-legs">
      <!-- One-way single leg -->
      <div
        v-if="tripType === 'oneway'"
        class="booking-leg"
        :class="{ selected: !!selectedOneway, active: !selectedOneway }"
      >
        <div class="leg-left">
          <span class="leg-badge out">ขาไป</span>
          <div v-if="selectedOneway" class="leg-info">
            <span class="leg-route">{{ selectedOneway.from }} → {{ selectedOneway.to }}</span>
            <span class="leg-time">{{ selectedOneway.departTime }} · {{ selectedOneway.type }}</span>
          </div>
          <span v-else class="leg-placeholder">กรุณาเลือกตั๋ว</span>
        </div>
        <div class="leg-right">
          <span v-if="selectedOneway" class="leg-price">฿{{ totalPrice.toLocaleString() }}</span>
          <button v-if="selectedOneway" class="change-btn" @click="$emit('change-oneway')">เปลี่ยน</button>
        </div>
      </div>

      <!-- Round trip legs -->
      <template v-else>
        <div
          class="booking-leg"
          :class="{ selected: !!selectedOutbound, active: currentStep === 'outbound' && !selectedOutbound }"
        >
          <div class="leg-left">
            <span class="leg-badge out">ขาไป</span>
            <div v-if="selectedOutbound" class="leg-info">
              <span class="leg-route">{{ selectedOutbound.from }} → {{ selectedOutbound.to }}</span>
              <span class="leg-time">{{ selectedOutbound.departTime }} · {{ selectedOutbound.type }}</span>
            </div>
            <span v-else class="leg-placeholder">กรุณาเลือกขาไป</span>
          </div>
          <div class="leg-right">
            <span v-if="selectedOutbound" class="leg-price">฿{{ outboundPrice.toLocaleString() }}</span>
            <button v-if="selectedOutbound" class="change-btn" @click="$emit('change-outbound')">เปลี่ยน</button>
          </div>
        </div>

        <div
          class="booking-leg"
          :class="{ selected: !!selectedReturn, active: currentStep === 'return' && !selectedReturn, disabled: !selectedOutbound }"
        >
          <div class="leg-left">
            <span class="leg-badge ret">ขากลับ</span>
            <div v-if="selectedReturn" class="leg-info">
              <span class="leg-route">{{ selectedReturn.from }} → {{ selectedReturn.to }}</span>
              <span class="leg-time">{{ selectedReturn.departTime }} · {{ selectedReturn.type }}</span>
            </div>
            <span v-else class="leg-placeholder">{{ selectedOutbound ? 'กรุณาเลือกขากลับ' : '-' }}</span>
          </div>
          <div class="leg-right">
            <span v-if="selectedReturn" class="leg-price">฿{{ returnPrice.toLocaleString() }}</span>
            <button v-if="selectedReturn" class="change-btn" @click="$emit('change-return')">เปลี่ยน</button>
          </div>
        </div>
      </template>
    </div>

    <div class="booking-footer">
      <div class="total-area">
        <span class="total-label">ราคารวม</span>
        <span class="total-price" :class="{ active: totalPrice > 0 }">
          {{ totalPrice > 0 ? '฿' + totalPrice.toLocaleString() : '-' }}
        </span>
      </div>
      <button
        class="proceed-btn"
        :disabled="!canProceed"
        :class="{ ready: canProceed }"
        @click="$emit('proceed')"
      >
        <i class="fas fa-arrow-right"></i> ดำเนินการต่อ
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tripType: { type: String, default: 'oneway' },
  currentStep: { type: String, default: 'outbound' },
  selectedOneway: { type: Object, default: null },
  selectedOutbound: { type: Object, default: null },
  selectedReturn: { type: Object, default: null },
  totalPrice: { type: Number, default: 0 },
  outboundPrice: { type: Number, default: 0 },
  returnPrice: { type: Number, default: 0 },
  canProceed: { type: Boolean, default: false },
})

defineEmits(['change-oneway', 'change-outbound', 'change-return', 'proceed'])
</script>

<style scoped>
.mobile-booking-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  /*max-width: 100vw;*/
  z-index: 100;
  background: #fff;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.12);
  border-top: 0.5px solid rgb(227, 228, 232);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.booking-legs {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-bottom: 0.5px solid rgb(227, 228, 232);
  width: 100%;
  min-width: 0;
}

.booking-leg {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 0.5px solid #f0f0f0;
  transition: background 150ms;
  width: 100%;
  min-width: 0;
}

.booking-leg:last-child {
  border-bottom: none;
}

.booking-leg.active {
  background: #e8f0fe;
}

.booking-leg.disabled {
  opacity: 0.45;
}

.booking-leg.selected {
  background: #f0f9f4;
}

.leg-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.leg-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 10px;
  flex-shrink: 0;
  letter-spacing: 0.3px;
}

.leg-badge.out {
  background: var(--primary);
  color: #fff;
}

.leg-badge.ret {
  background: var(--accent);
  color: #fff;
}

.leg-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.leg-route {
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.leg-time {
  font-size: 11px;
  color: var(--text-light);
}

.leg-placeholder {
  font-size: 12px;
  color: var(--text-lighter);
  font-style: italic;
}

.leg-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  min-width: 0;
}

.leg-price {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}

.change-btn {
  font-size: 11px;
  font-weight: 500;
  color: var(--primary);
  background: none;
  border: 1px solid var(--primary);
  border-radius: 10px;
  padding: 2px 8px;
  cursor: pointer;
  white-space: nowrap;
}

.change-btn:hover {
  background: var(--primary-light);
}

.booking-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  padding-bottom: max(10px, env(safe-area-inset-bottom));
  gap: 12px;
  width: 100%;
  min-width: 0;
}

.total-area {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.total-label {
  font-size: 11px;
  color: var(--text-light);
  font-weight: 500;
}

.total-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-lighter);
}

.total-price.active {
  color: var(--accent);
}

.proceed-btn {
  background: #ccc;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: not-allowed;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 200ms;
  white-space: nowrap;
  flex-shrink: 1;
}

.proceed-btn.ready {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
  cursor: pointer;
}

.proceed-btn.ready:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 480px) {
  .booking-leg {
    padding: 8px 12px;
  }

  .booking-footer {
    padding: 10px 12px;
    gap: 8px;
  }

  .leg-route {
    font-size: 11px;
  }

  .leg-time {
    font-size: 10px;
  }

  .leg-price {
    font-size: 12px;
  }

  .proceed-btn {
    min-width: 132px;
    padding: 10px 12px;
    font-size: 13px;
    justify-content: center;
  }

  .total-price {
    font-size: 16px;
  }
}
</style>
