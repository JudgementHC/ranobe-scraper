import axios from 'axios'

const apiAxios = axios.create({
  baseURL: 'http://localhost:8081/ranobelibme',
  timeout: 120000
})

apiAxios.interceptors.request.use(config => {
  return config
})

apiAxios.interceptors.response.use(res => {
  return res.data
})

export default apiAxios
