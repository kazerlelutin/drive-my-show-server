import { PrismaClient, User } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { JWT_TOKEN } from '../utils/constants'
import * as jose from 'jose'

export async function auth(
  request: VercelRequest,
  response: VercelResponse,
  handler: (
    request: VercelRequest,
    response: VercelResponse,
    session: User
  ) => Promise<VercelResponse> | VercelResponse
) {
  if (request.method === 'OPTIONS') {
    response.status(200).end()
    return
  }

  const token = request.headers.authorization?.replace('Bearer ', '')
  const secret = new TextEncoder().encode(JWT_TOKEN)

  if (!token) return response.status(401).json({ message: 'no token send' })

  const { payload: decoded } = await jose.jwtVerify(token, secret)

  if (typeof decoded === null || typeof decoded === 'string')
    return response.status(401).json({ message: 'token not valid' })
  if (!decoded?.id)
    return response.status(401).json({ message: 'token not valid' })
  const prisma = new PrismaClient()

  const session = await prisma.user.findFirst({
    where: { id: decoded.id },
  })

  if (!session) return response.status(401).json({ message: 'no user' })
  return handler(request, response, session)
}
