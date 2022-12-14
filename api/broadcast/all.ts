import { PrismaClient, User } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { auth } from '../../middlewares/auth'
async function handler(
  _request: VercelRequest,
  response: VercelResponse,
  session: User
) {
  const prisma = new PrismaClient()

  return response.json(
    await prisma.broadcast.findMany({
      where: { userId: session.id },
      orderBy: { updatedAt: 'desc' },
    })
  )
}

export default (request: VercelRequest, response: VercelResponse) =>
  auth(request, response, handler)
