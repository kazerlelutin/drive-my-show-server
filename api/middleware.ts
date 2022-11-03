import { ipAddress, next ,rewrite} from '@vercel/edge';

export default  function middleware(request: Request, response) {
  const ip = ipAddress(request);
  console.log('OK_____',ip)

  return response.end(`Hello worlsd!`);
}