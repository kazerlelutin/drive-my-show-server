import { VercelRequest, VercelResponse } from '@vercel/node'
import trigger from '../datasources/trigger'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  //ID is TWITCH ID
  await trigger('58236922', 'broadcast-3', 'Rien du tout')
  response.send('done')
}
