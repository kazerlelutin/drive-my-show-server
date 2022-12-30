import { PrismaClient, User } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { auth } from '../../middlewares/auth'
async function handler(
  request: VercelRequest,
  response: VercelResponse,
  session: User
) {
  const prisma = new PrismaClient()
  const where = {
    AND: [
      {
        id: request.body.id,
      },
      {
        OR: [
          { userId: session.id },
          {
            guests: {
              every: {
                userId: session.id,
              },
            },
          },
        ],
      },
    ],
  }

  return response.json(
    await prisma.broadcast.findFirst({
      where,
    })
  )
}

export default (request: VercelRequest, response: VercelResponse) =>
  auth(request, response, handler)
