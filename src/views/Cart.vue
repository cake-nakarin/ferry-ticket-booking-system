<template>
  <div class="cart-page">
    <div class="cart-container">
      <div class="cart-header">
        <button class="back-btn" @click="$emit('back')">
          <i class="fas fa-arrow-left"></i> {{ t('cart.backToSearch') }}
        </button>
        <h2><i class="fas fa-shopping-cart"></i> {{ t('cart.bookingList') }}</h2>
      </div>

      <div class="cart-layout" v-if="bookingStore.cartItems.length > 0">
        <div class="cart-items">
          <div class="cart-item" v-for="(item, index) in bookingStore.cartItems" :key="index">
            <div class="cart-item-logo">
              <i class="fas fa-ship"></i>
            </div>
            <div class="cart-item-info">
              <div class="cart-item-route">{{ item.departure }} → {{ item.destination }}</div>
              <div class="cart-item-type" v-if="item.type">{{ item.type }}</div>
              <div class="cart-item-meta">
                <span><i class="fas fa-calendar"></i> {{ item.date }}</span>
                <span><i class="fas fa-clock"></i> {{ item.time }}</span>
              </div>
            </div>
            <div class="cart-item-price">฿{{ item.price.toLocaleString() }}</div>
            <button class="remove-btn" @click="removeItem(index)" :title="t('cart.remove')">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <div class="cart-summary">
          <h3>{{ t('cart.summary') }}</h3>
          <div class="summary-row">
            <span>{{ t('cart.ticketCount') }}</span>
            <span>{{ bookingStore.cartItems.length }} {{ t('cart.items') }}</span>
          </div>
          <div class="summary-row">
            <span>{{ t('cart.total') }}</span>
            <span class="price-total">฿{{ bookingStore.cartTotal.toLocaleString() }}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row total">
            <span>{{ t('cart.grandTotal') }}</span>
            <span class="price-grand">฿{{ bookingStore.cartTotal.toLocaleString() }}</span>
          </div>
          <button class="checkout-btn" @click="checkout">
            <i class="fas fa-credit-card"></i> {{ t('cart.pay') }}
          </button>
          <button class="continue-btn" @click="$emit('back')">
            <i class="fas fa-search"></i> {{ t('cart.continue') }}
          </button>
        </div>
      </div>

      <div class="empty-cart" v-else>
        <div class="empty-icon"><i class="fas fa-ship"></i></div>
        <h3>{{ t('cart.emptyTitle') }}</h3>
        <p>{{ t('cart.emptyDesc') }}</p>
        <button class="back-btn-large" @click="$emit('back')">
          <i class="fas fa-search"></i> {{ t('cart.searchTicket') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBookingStore } from '../stores/booking'
import { t } from '../i18n'

defineEmits(['back'])

const bookingStore = useBookingStore()

const removeItem = (index) => {
  bookingStore.removeFromCart(index)
}

const checkout = () => {
  alert(t('cart.checkoutAlert') + ' ' + bookingStore.cartItems.length + ' ' + t('cart.items') + ' - ฿' + bookingStore.cartTotal.toLocaleString())
}
</script>

<style scoped>
.cart-page {
  background: var(--light);
  min-height: calc(100vh - 120px);
  padding: 24px 0;
}

.cart-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
}

.cart-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.cart-header h2 {
  font-size: 20px;
  font-weight: 500;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-header h2 i {
  color: var(--primary);
}

.back-btn {
  padding: 8px 16px;
  background: white;
  border: 0.5px solid rgb(227, 228, 232);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-light);
  cursor: pointer;
  transition: all 200ms;
  display: flex;
  align-items: center;
  gap: 6px;
}

.back-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  background: white;
  border: 0.5px solid rgb(227, 228, 232);
  border-radius: 4px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.cart-item-logo {
  width: 48px;
  height: 48px;
  background: var(--primary-light);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 20px;
  flex-shrink: 0;
}

.cart-item-info {
  flex: 1;
}

.cart-item-route {
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 4px;
}

.cart-item-type {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 4px;
}

.cart-item-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-lighter);
}

.cart-item-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cart-item-meta i {
  color: var(--primary);
}

.cart-item-price {
  font-size: 18px;
  font-weight: 600;
  color: var(--accent);
  white-space: nowrap;
}

.remove-btn {
  width: 36px;
  height: 36px;
  background: none;
  border: 0.5px solid rgb(227, 228, 232);
  border-radius: 4px;
  color: var(--text-lighter);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #FFEBEE;
  border-color: var(--danger);
  color: var(--danger);
}

.cart-summary {
  background: white;
  border: 0.5px solid rgb(227, 228, 232);
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 24px;
}

.cart-summary h3 {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 12px;
}

.price-total {
  color: var(--text);
  font-weight: 500;
}

.summary-divider {
  border-top: 1px solid var(--border);
  margin: 12px 0;
}

.summary-row.total {
  font-weight: 500;
  font-size: 14px;
  color: var(--text);
  margin-bottom: 16px;
}

.price-grand {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent);
}

.checkout-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2);
}

.continue-btn {
  width: 100%;
  padding: 10px;
  background: white;
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.continue-btn:hover {
  background: var(--primary-light);
}

.empty-cart {
  text-align: center;
  padding: 60px 24px;
  background: white;
  border-radius: 4px;
  border: 0.5px solid rgb(227, 228, 232);
}

.empty-icon {
  font-size: 48px;
  color: var(--text-lighter);
  margin-bottom: 16px;
}

.empty-cart h3 {
  font-size: 18px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 8px;
}

.empty-cart p {
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 24px;
}

.back-btn-large {
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.back-btn-large:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2);
}

@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
  .cart-summary {
    position: static;
  }
  .cart-container {
    padding: 0 12px;
  }
}
</style>


<style scoped>
.cart-view {
  color: white;
}

.cart-items {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.cart-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-info h4,
.item-info p {
  margin: 0.5rem 0;
}

.price {
  font-weight: bold;
  font-size: 1.1rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
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

.btn-danger {
  background-color: #f56565;
  color: white;
  padding: 0.5rem 1rem;
}

.btn-danger:hover {
  background-color: #e53e3e;
}

.btn-block {
  width: 100%;
  padding: 1rem;
}

.cart-summary {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
}

.cart-summary h3 {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.summary-row.total {
  font-weight: bold;
  font-size: 1.2rem;
  border: none;
  margin-top: 1rem;
}

.empty-cart {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.empty-cart p {
  margin-bottom: 2rem;
  font-size: 1.2rem;
}

.btn-primary {
  background-color: #667eea;
  color: white;
  text-decoration: none;
}
</style>
