import { PrismaClient, User } from '@prisma/client'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { auth } from '../../middlewares/auth'

async function handler(
  _request: VercelRequest,
  response: VercelResponse,
  session: User
) {
  const perPage = 5
  const prisma = new PrismaClient()

  const shows = await prisma.show.findMany({
    where: {
      users: {
        every: {
          user_id: session.id,
        },
      },
    },
    take: perPage,
    include: {
      users: {
        select: {
          user_id: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return response.json(shows)
}

export default (request: VercelRequest, response: VercelResponse) =>
  auth(request, response, handler)
