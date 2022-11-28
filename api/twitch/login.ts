import { PrismaClient } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { twitch } from '../../datasources/twitch'
import * as jose from 'jose'
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
    const twitchUser = data?.data[0]
    const secret = new TextEncoder().encode(JWT_TOKEN)
    const existUser = await prisma.user.findFirst({
      where: { twitch_id: twitchUser.id },
      include: {
        channels: true,
      },
    })

    if (!existUser) {
      const user = await prisma.user.create({
        data: { twitch_id: twitchUser.id },
      })

      await prisma.channel.create({
        data: {
          userId: user.id,
          name: twitchUser.login,
        },
      })

      const token = await new jose.SignJWT({
        twitch_id: twitchUser.id,
        id: user.id,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30d')
        .sign(new TextEncoder().encode(`secret-key-phrase`))

      return response.json({
        ...twitchUser,
        token_api: token,
        token: request.headers.authorization,
        profile: user.profile,
        current_channel: twitchUser.login,
        channel_count: 1,
      })
    }

    const token = await new jose.SignJWT({
      twitch_id: twitchUser.id,
      id: existUser.id,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(secret)

    const currentChannel = existUser.channels.find((channel) => channel.current)

    return response.json({
      ...twitchUser,
      token_api: token,
      token: request.headers.authorization,
      profile: existUser.profile,
      current_channel: currentChannel?.name || twitchUser.login,
      channel_count: existUser.channels.length,
    })
  } catch (e: any) {
    response.status(401).json({ message: e.message })
  }
}

export const config = {
  runtime: 'experimental-edge',
}
