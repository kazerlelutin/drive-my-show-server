import { PrismaClient, User } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { auth } from '../../middlewares/auth'
async function handler(
  request: VercelRequest,
  response: VercelResponse,
  session: User
) {
  const perPage = 50
  const prisma = new PrismaClient()
  const where = {
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
  }

  const broadcasts = await prisma.broadcast.findMany({
    where,
    take: perPage,
    skip: request.body.cursor ? 1 : 0,
    orderBy: { updatedAt: 'desc' },
  })
  const count = await prisma.broadcast.count({
    where,
  })

  return response.json({
    broadcasts,
    totalPage: count / perPage,
    cursor: broadcasts.at(-1)?.id,
  })
}

export default (request: VercelRequest, response: VercelResponse) =>
  auth(request, response, handler)
