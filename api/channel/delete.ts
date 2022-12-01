import { PrismaClient } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { auth } from '../../middlewares/auth'

async function handler(
  request: VercelRequest,
  response: VercelResponse,
  session: any
) {
  console.log(request.body)
  if (!request.body?.id)
    return response.status(401).json({ message: 'no id sended' })
  const { id } = request.body

  if (!id) return response.status(404).json({ message: 'no id' })
  const prisma = new PrismaClient()
  const isCurrent = await prisma.channel.findFirst({
    where: { id, userId: session.id },
  })

  if (!isCurrent)
    return response.status(404).json({ message: 'no channel found' })
  if (isCurrent?.current)
    return response
      .status(403)
      .json({ message: 'impossible to delete current channel' })

  await prisma.channel.delete({ where: { id: isCurrent.id } })
  const count = await prisma.channel.count({ where: { userId: session.id } })

  return response.json({
    count,
  })
}

export default (request: VercelRequest, response: VercelResponse) =>
  auth(request, response, handler)
