export default function handler(request, response) {
    // api/[name].ts -> /api/lee
    // req.query.name -> "lee"
    //const { name } = request.query;
    return response.end(`Hello worlsd!`);
  }

  export const config = {
    runtime: 'experimental-edge',
  };