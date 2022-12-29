import { PrismaClient, User } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { auth } from '../../middlewares/auth'

async function handler(
  request: VercelRequest,
  response: VercelResponse,
  session: User
) {
  if (!request.body?.name)
    return response.status(401).json({ message: 'no channel sended' })
  const { name } = request.body
  const prisma = new PrismaClient()

  await prisma.user.updateMany({
    where: { id: session.id },
    data: { current_channel: name },
  })

  return response.json({ name })
}

export default (request: VercelRequest, response: VercelResponse) =>
  auth(request, response, handler)
