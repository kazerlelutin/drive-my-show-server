import axios from 'axios'

export const twitch = axios.create({
  baseURL: 'https://api.twitch.tv/',
  timeout: 1000,
  headers: {
    'Client-ID': process.env.TWITCH_CLIENT_ID,
    Accept: 'application/vnd.twitchtv.v5+json',
  },
})
