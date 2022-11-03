import type { VercelRequest, VercelResponse } from '@vercel/node';

export function auth(request:VercelRequest, response:VercelResponse, handler:(request:VercelRequest, response:VercelResponse)=>VercelResponse) {
    // api/[name].ts -> /api/lee
    // req.query.name -> "lee"
    //const { name } = request.query;

    request.headers['xxx-xxx-xxx'] = "xxxxxxxxxxxxxxxxxxx"

    return handler(request, response);
  }

