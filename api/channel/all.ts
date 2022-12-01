import { PrismaClient } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { auth } from '../../middlewares/auth'

async function handler(
  _request: VercelRequest,
  response: VercelResponse,
  session: any
) {
  const prisma = new PrismaClient()

  return response.json(
    await prisma.channel.findMany({
      where: { userId: session.id },
      orderBy: { current: 'desc' },
    })
  )
}

export default (request: VercelRequest, response: VercelResponse) =>
  auth(request, response, handler)
