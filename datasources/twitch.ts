import axios from 'axios'
import { TWITCH_CLIENT_ID } from '../utils/constants'

export const twitch = axios.create({
  baseURL: 'https://api.twitch.tv/',
  timeout: 1000,
  headers: {
    'Client-ID': TWITCH_CLIENT_ID,
    Accept: 'application/vnd.twitchtv.v5+json',
  },
})
