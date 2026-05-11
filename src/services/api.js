import axios from 'axios'
import { MOCK_TICKETS } from './mockData.js'

// Set to false and configure VITE_API_URL in .env when the real backend is ready
const USE_MOCK = true

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

const stripCode = (value) => (value || '').replace(/\s*\([^)]*\)/, '').trim().toLowerCase()

const mockSearchTickets = (filters = {}) => {
  let results = [...MOCK_TICKETS]

  if (filters.from) {
    const from = stripCode(filters.from)
    results = results.filter((t) => t.from.toLowerCase().includes(from))
  }

  if (filters.to) {
    const to = stripCode(filters.to)
    results = results.filter((t) => t.to.toLowerCase().includes(to))
  }

  if (filters.departDate) {
    results = results.filter((t) => t.departDate === filters.departDate)
  }

  return results
}

export const ticketService = {
  searchTickets: async (filters = {}) => {
    if (USE_MOCK) {
      return mockSearchTickets(filters)
    }

    // TODO: swap to real API when backend is ready
    const response = await api.get('/tickets/search', { params: filters })
    return response.data
  },

  getTicketById: async (id) => {
    if (USE_MOCK) {
      const ticket = MOCK_TICKETS.find((t) => t.id === id)
      if (!ticket) throw new Error(`Ticket ${id} not found`)
      return ticket
    }

    const response = await api.get(`/tickets/${id}`)
    return response.data
  },

  bookTickets: async (bookingData) => {
    if (USE_MOCK) {
      // Simulate a successful booking response
      return { success: true, bookingRef: `MOCK-${Date.now()}`, ...bookingData }
    }

    const response = await api.post('/bookings', bookingData)
    return response.data
  },
}

export default api
