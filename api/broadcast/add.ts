import { PrismaClient, User } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { auth } from '../../middlewares/auth'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { JWT_TOKEN } from '../../utils/constants'
async function handler(
  request: VercelRequest,
  response: VercelResponse,
  session: User
) {
  if (!request.body?.name)
    return response.status(401).json({ message: 'no name sended' })

  const { name, description }: { name: string; description: string } =
    request.body
  const prisma = new PrismaClient()

  const broadcastExist = await prisma.broadcast.findFirst({
    where: { userId: session.id, name },
  })

  if (broadcastExist) return response.send(broadcastExist.id)

  const token = jwt.sign({ channel: session.channel }, JWT_TOKEN)

  const broadcast = await prisma.broadcast.create({
    data: {
      name,
      description,
      invite_token: token,
      slider_token: uuidv4(),
      userId: session.id,
      channel: session.channel,
    },
  })

  return response.send(broadcast.id)
}

export default (request: VercelRequest, response: VercelResponse) =>
  auth(request, response, handler)
