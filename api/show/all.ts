import { PrismaClient, User } from '@prisma/client'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { auth } from '../../middlewares/auth'

async function handler(
  request: VercelRequest,
  response: VercelResponse,
  session: User
) {
  const perPage = 50
  const prisma = new PrismaClient()

  const where = {
    users: {
      every: {
        user_id: session.id,
      },
    },
  }
  const shows = await prisma.show.findMany({
    where,
    take: perPage,
    skip: request.body.cursor ? 1 : 0,
    cursor: request.body.cursor ? { id: request.body.cursor } : undefined,
    include: {
      users: {
        select: {
          user_id: true,
          role: true,
        },
      },
    },
  })

  const totalPage = (await prisma.show.count({ where })) / perPage

  return response.json({ shows, cursor: shows.at(-1)?.id, totalPage, perPage })
}

export default (request: VercelRequest, response: VercelResponse) =>
  auth(request, response, handler)
