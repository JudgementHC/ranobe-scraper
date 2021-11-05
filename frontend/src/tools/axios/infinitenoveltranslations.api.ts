import axios from 'axios'
import { EServices } from '../enums/Services.enum'

const infinitenoveltranslationsApi = axios.create({
  baseURL: `http://localhost:8081/${EServices.INFINITENOVELTRANSLATIONS}`,
  timeout: 120000
})

infinitenoveltranslationsApi.interceptors.request.use(config => {
  return config
})

infinitenoveltranslationsApi.interceptors.response.use(res => {
  return res.data
})

export default infinitenoveltranslationsApi
