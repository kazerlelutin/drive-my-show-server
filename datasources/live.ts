import axios from 'axios'
import { URL_LIVE } from '../utils/constants'

export const live = axios.create({
  baseURL: URL_LIVE,
  timeout: 1000,
  headers: {
    Accept: 'application/json',
  },
})
