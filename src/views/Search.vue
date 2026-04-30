<template>
  <div class="search-view">
    <h2>Search Ferry Tickets</h2>
    
    <form @submit.prevent="handleSearch" class="search-form">
      <div class="form-group">
        <label for="departure">Departure Port</label>
        <input
          v-model="filters.departure"
          type="text"
          id="departure"
          placeholder="Enter departure port"
        />
      </div>

      <div class="form-group">
        <label for="destination">Destination Port</label>
        <input
          v-model="filters.destination"
          type="text"
          id="destination"
          placeholder="Enter destination port"
        />
      </div>

      <div class="form-group">
        <label for="date">Departure Date</label>
        <input
          v-model="filters.date"
          type="date"
          id="date"
        />
      </div>

      <div class="form-group">
        <label for="passengers">Number of Passengers</label>
        <input
          v-model.number="filters.passengers"
          type="number"
          id="passengers"
          min="1"
          max="10"
        />
      </div>

      <button type="submit" class="btn btn-primary">Search</button>
    </form>

    <div v-if="loading" class="loading">
      Searching tickets...
    </div>

    <div v-else-if="tickets.length > 0" class="tickets-list">
      <h3>Available Tickets</h3>
      <div class="ticket-item" v-for="ticket in tickets" :key="ticket.id">
        <div class="ticket-info">
          <h4>{{ ticket.departure }} → {{ ticket.destination }}</h4>
          <p>{{ ticket.date }} at {{ ticket.time }}</p>
          <p>Price: {{ ticket.price }} THB</p>
        </div>
        <button @click="addTicketToCart(ticket)" class="btn btn-secondary">
          Add to Cart
        </button>
      </div>
    </div>

    <div v-else class="no-results">
      <p>No tickets found. Try searching with different criteria.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useBookingStore } from '../stores/booking'
import { ticketService } from '../services/api'

const bookingStore = useBookingStore()

const filters = reactive({
  departure: '',
  destination: '',
  date: '',
  passengers: 1
})

const tickets = ref([])
const loading = ref(false)

const handleSearch = async () => {
  loading.value = true
  try {
    // Mock data - replace with actual API call
    tickets.value = [
      {
        id: 1,
        departure: 'Bangkok',
        destination: 'Phuket',
        date: '2026-04-30',
        time: '09:00',
        price: 500
      },
      {
        id: 2,
        departure: 'Bangkok',
        destination: 'Phuket',
        date: '2026-04-30',
        time: '14:00',
        price: 450
      }
    ]
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    loading.value = false
  }
}

const addTicketToCart = (ticket) => {
  bookingStore.addToCart(ticket)
  alert('Ticket added to cart!')
}
</script>

<style scoped>
.search-view {
  color: white;
}

.search-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
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

.btn-secondary {
  background-color: #48bb78;
  color: white;
  padding: 0.5rem 1rem;
}

.btn-secondary:hover {
  background-color: #38a169;
}

.loading,
.no-results {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.tickets-list h3 {
  margin-bottom: 1.5rem;
}

.ticket-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-info h4,
.ticket-info p {
  margin: 0.5rem 0;
}
</style>
