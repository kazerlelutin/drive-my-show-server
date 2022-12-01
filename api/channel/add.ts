import { PrismaClient } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { auth } from '../../middlewares/auth'

async function handler(
  request: VercelRequest,
  response: VercelResponse,
  session: any
) {
  console.log(request.body)
  if (!request.body?.name)
    return response.status(401).json({ message: 'no name sended' })
  const { name } = request.body
  const prisma = new PrismaClient()

  const isExist = await prisma.channel.findFirst({
    where: { userId: session.id, name },
  })

  const count = await prisma.channel.count({ where: { userId: session.id } })
  if (isExist) return response.json({ count, channel: isExist })

  return response.json({
    channel: await prisma.channel.create({
      data: { name, userId: session.id, current: false },
    }),
    count: count + 1,
  })
}
export default (request: VercelRequest, response: VercelResponse) =>
  auth(request, response, handler)
