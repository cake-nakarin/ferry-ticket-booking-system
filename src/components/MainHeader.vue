<template>
  <div class="main-header">
    <div class="header-content">
      <a href="#" class="logo" @click.prevent="$emit('go-home')">
        <i class="fas fa-ship"></i> FerryTicket
      </a>
      <div class="menu-tabs">
        <button :class="['menu-tab', { active: activeTab === 'ferry' }]" @click="activeTab = 'ferry'">
          <i class="fas fa-water"></i> {{ t('menu.ferry') }}
        </button>
        <button :class="['menu-tab', { active: activeTab === 'hotel' }]" @click="activeTab = 'hotel'">
          <i class="fas fa-hotel"></i> {{ t('menu.hotel') }}
        </button>
        <button :class="['menu-tab', { active: activeTab === 'car' }]" @click="activeTab = 'car'">
          <i class="fas fa-car"></i> {{ t('menu.car') }}
        </button>
      </div>
      <div class="header-actions">
        <button class="icon-btn"><i class="fas fa-bell"></i></button>
        <button class="icon-btn cart-btn" @click="$emit('go-cart')">
          <i class="fas fa-shopping-cart"></i>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </button>
        <button class="icon-btn"><i class="fas fa-user"></i></button>
        <button class="menu-toggle"><i class="fas fa-bars"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { t } from '../i18n'

defineProps({
  cartCount: { type: Number, default: 0 }
})

defineEmits(['go-cart', 'go-home'])

const activeTab = ref('ferry')
</script>

<style scoped>
.main-header {
  background: #FFFFFF;
  padding: 12px 0;
  border-bottom: 0.5px solid rgb(227, 228, 232);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  letter-spacing: -0.5px;
}

.logo i {
  font-size: 28px;
  color: var(--accent);
}

.menu-tabs {
  display: flex;
  gap: 8px;
  flex: 1;
  margin-left: 40px;
}

.menu-tab {
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: var(--text-light);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.menu-tab:hover {
  color: var(--text);
  background: rgba(25, 118, 210, 0.04);
}

.menu-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-light);
  font-size: 16px;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.icon-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
}

.cart-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: var(--accent);
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-toggle {
  display: none;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  border-radius: 4px;
  color: var(--text);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-toggle:hover {
  background: var(--light);
}

@media (max-width: 1024px) {
  .menu-tab {
    display: none;
  }
  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
