import { NextResponse } from 'next/server';

export function middleware(request) {
  const auth = request.headers.get('authorization');
  const basicAuth = auth?.split(' ')[1];
  const [user, pwd] = atob(basicAuth || '').split(':');

  const validUser = user === process.env.BASIC_AUTH_USER;
  const validPass = pwd === process.env.BASIC_AUTH_PASS;

  console.log({ validUser, validPass });

  if (!validUser || !validPass) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
