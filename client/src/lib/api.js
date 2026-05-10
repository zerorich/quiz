import axios from 'axios'

const api = axios.create({
  baseURL: 'https://quiz-production-19b3.up.railway.app',
  withCredentials: true,
})

export default api
