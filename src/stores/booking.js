import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookingStore = defineStore('booking', () => {
  const cartItems = ref([])
  const searchFilters = ref({
    departure: '',
    destination: '',
    date: '',
    passengers: 1
  })

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.price, 0)
  })

  const cartCount = computed(() => cartItems.value.length)

  const addToCart = (ticket) => {
    cartItems.value.push(ticket)
  }

  const removeFromCart = (index) => {
    cartItems.value.splice(index, 1)
  }

  const clearCart = () => {
    cartItems.value = []
  }

  const updateSearchFilters = (filters) => {
    searchFilters.value = { ...searchFilters.value, ...filters }
  }

  return {
    cartItems,
    searchFilters,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    clearCart,
    updateSearchFilters
  }
})
