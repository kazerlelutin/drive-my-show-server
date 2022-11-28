import { PrismaClient } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { auth } from '../../middlewares/auth'

async function handler(
  request: VercelRequest,
  response: VercelResponse,
  session: any
) {
  if (!request.body?.id)
    return response.status(401).json({ message: 'no id sended' })
  const { id } = request.body
  const prisma = new PrismaClient()

  await prisma.channel.updateMany({
    where: { userId: session.id },
    data: { current: false },
  })

  await prisma.channel.updateMany({
    where: { id, userId: session.id },
    data: { current: true },
  })
  return response.json(
    await prisma.channel.findFirst({ where: { id, userId: session.id } })
  )
}

export const config = {
  runtime: 'experimental-edge',
}

export default (request: VercelRequest, response: VercelResponse) =>
  auth(request, response, handler)
