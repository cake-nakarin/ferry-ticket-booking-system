import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const ticketService = {
  searchTickets: async (filters) => {
    try {
      const response = await api.get('/tickets/search', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error searching tickets:', error)
      throw error
    }
  },

  getTicketById: async (id) => {
    try {
      const response = await api.get(`/tickets/${id}`)
      return response.data
    } catch (error) {
      console.error('Error getting ticket:', error)
      throw error
    }
  },

  bookTickets: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData)
      return response.data
    } catch (error) {
      console.error('Error booking tickets:', error)
      throw error
    }
  }
}

export default api
