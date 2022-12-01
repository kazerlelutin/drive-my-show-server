import { PrismaClient, User } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'
import { JWT_TOKEN } from '../utils/constants'

export async function auth(
  request: VercelRequest,
  response: VercelResponse,
  handler: (
    request: VercelRequest,
    response: VercelResponse,
    session: User
  ) => Promise<VercelResponse> | VercelResponse
) {
  console.log('__________________')

  if (request.method === 'OPTIONS') {
    response.status(200).end()
    return
  }

  const token = request.headers.authorization?.replace('Bearer ', '')
  console.log('TO', request.headers)

  if (!token) return response.status(401).json({ message: 'no token send' })
  try {
    jwt.verify(token, JWT_TOKEN)
  } catch (err) {
    response.status(401).json({ message: 'token not valid' })
  }

  const decoded = jwt.decode(token)

  if (typeof decoded === null || typeof decoded === 'string')
    return response.status(401).json({ message: 'token not valid' })
  if (!decoded?.id)
    return response.status(401).json({ message: 'token not valid' })

  if (typeof decoded?.id !== 'number')
    return response.status(401).json({ message: 'token not valid' })

  const prisma = new PrismaClient()

  const session = await prisma.user.findFirst({
    where: { id: decoded.id },
  })

  if (!session) return response.status(401).json({ message: 'no user' })
  return handler(request, response, session)
}
