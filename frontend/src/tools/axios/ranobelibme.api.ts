import axios from 'axios'
import { EServices } from '../enums/Services.enum'

const ranobelibmeApi = axios.create({
  baseURL: `http://localhost:8081/${EServices.RANOBELIBME}`,
  timeout: 120000
})

ranobelibmeApi.interceptors.request.use(config => {
  return config
})

ranobelibmeApi.interceptors.response.use(res => {
  return res.data
})

export default ranobelibmeApi
