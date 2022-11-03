import type { VercelRequest, VercelResponse } from "@vercel/node";
import { auth } from "../../middlewares/auth";

function salut(request: VercelRequest, response: VercelResponse) {
  // api/[name].ts -> /api/lee
  // req.query.name -> "lee"
  //const { name } = request.query;

  console.log(request.headers);

  return response.end(`Hello Salut` + request.headers['xxx-xxx-xxx']);
}

export default (request: VercelRequest, response: VercelResponse) =>
  auth(request, response, salut);
