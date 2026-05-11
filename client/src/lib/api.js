import axios from 'axios'

// Меняйте URL только здесь (или задайте VITE_API_URL в .env — он имеет приоритет).
const API_BASE_URL = (
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  'http://localhost:5000'
)

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

export { API_BASE_URL }
export default api
