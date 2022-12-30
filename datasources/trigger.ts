import { live } from './live'

const trigger = async (room: string, type: string, body: Object) => {
  const res = await live.post('/message', {
    room,
    type,
    message: body,
  })

  return res?.data
}

export default trigger
