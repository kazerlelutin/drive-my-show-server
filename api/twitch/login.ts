import { PrismaClient } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { twitch } from '../../datasources/twitch'
import jwt from 'jsonwebtoken'
import { JWT_TOKEN } from '../../utils/constants'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const { data } = await twitch.get('helix/users', {
      headers: { Authorization: request.headers.authorization },
    })
    const prisma = new PrismaClient()
    const twitchUser: { id: string; login: string } = data?.data[0]

    if (!twitchUser?.id)
      return response.status(401).json({ message: 'no user in Twitch' })

    const existUser = await prisma.user.findFirst({
      where: { twitch_id: twitchUser.id },
    })

    if (!existUser) {
      const user = await prisma.user.create({
        data: {
          twitch_id: twitchUser.id,
          current_channel: twitchUser.login,
          login: twitchUser.login,
          channel: twitchUser.login,
        },
      })

      const token = jwt.sign(
        { twitch_id: twitchUser.id, id: user.id },
        JWT_TOKEN
      )
      return response.json({
        ...twitchUser,
        token_api: token,
        token: request.headers.authorization,
        profile: user.profile,
        current_channel: twitchUser.login,
        channel_count: 1,
      })
    }

    const token = jwt.sign(
      { twitch_id: twitchUser.id, id: existUser.id },
      JWT_TOKEN
    )

    return response.json({
      ...twitchUser,
      token_api: token,
      token: request.headers.authorization,
      profile: existUser.profile,
      current_channel: existUser.current_channel,
    })
  } catch (e: any) {
    response.status(401).json({ message: e.message })
  }
}
