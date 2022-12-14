import { PrismaClient, User } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { auth } from '../../middlewares/auth'
import { v4 as uuidv4 } from 'uuid'

async function handler(
  request: VercelRequest,
  response: VercelResponse,
  session: User
) {
  if (!request.body?.name)
    return response.status(401).json({ message: 'no name sended' })
  const { name, description } = request.body
  const prisma = new PrismaClient()

  const isExist = await prisma.broadcast.findFirst({
    where: { userId: session.id, name },
  })

  if (isExist) return response.json(isExist)
  const channel = await prisma.channel.findFirst({
    where: { userId: session.id, current: true },
  })

  if (!channel) return response.status(401).json({ message: 'no channel' })

  return response.json(
    await prisma.broadcast.create({
      data: {
        name,
        description,
        channelId: channel.id,
        slider_token: uuidv4(),
        userId: session.id,
      },
    })
  )
}

export default (request: VercelRequest, response: VercelResponse) =>
  auth(request, response, handler)
