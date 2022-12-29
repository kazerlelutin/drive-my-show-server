import { User } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { twitch } from '../../datasources/twitch'
import { auth } from '../../middlewares/auth'

async function handler(
  request: VercelRequest,
  response: VercelResponse,
  session: User
) {
  const { authorization } = request.body

  const { data } = await twitch.get(
    'helix/users/follows?first=100&from_id=' + session.twitch_id,
    {
      headers: { Authorization: 'Bearer ' + authorization },
    }
  )

  return response.json({
    pagination: data?.pagination,
    channels: [
      ...data?.data.map((channel: { to_name: string; to_login: string }) => ({
        name: channel.to_name,
        channel: channel.to_login,
      })),
      {
        name: session.login,
        channel: session.channel,
      },
    ],
  })
}

export default (request: VercelRequest, response: VercelResponse) =>
  auth(request, response, handler)
