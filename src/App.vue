<template>
  <div>
    <TopHeader />
    <MainHeader
      :cart-count="bookingStore.cartCount"
      @go-cart="currentView = 'cart'"
      @go-home="currentView = 'home'"
    />
    <Home v-if="currentView === 'home'" />
    <Cart v-else-if="currentView === 'cart'" @back="currentView = 'home'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBookingStore } from './stores/booking'
import TopHeader from './components/TopHeader.vue'
import MainHeader from './components/MainHeader.vue'
import Home from './views/Home.vue'
import Cart from './views/Cart.vue'

const currentView = ref('home')
const bookingStore = useBookingStore()
</script>

<style scoped>
</style>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2rem;
  text-align: center;
}

.header h1 {
  margin: 0 0 1rem 0;
  font-size: 2rem;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.nav-btn {
  color: #fff;
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1rem;
}

.nav-btn:hover,
.nav-btn.active {
  background-color: #667eea;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.footer {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  padding: 1.5rem;
  margin-top: 2rem;
}

.footer p {
  margin: 0;
}
</style>
