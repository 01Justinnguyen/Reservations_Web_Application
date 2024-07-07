import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePaths = ['/manage']
const unAuthPaths = ['/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuth = Boolean(request.cookies.get('accessToken')?.value)

  // Muốn truy cập vào các route private nhưng chưa đăng nhập thì đá về login
  if (privatePaths.some((path) => pathname.startsWith(path) && !isAuth)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Đăng nhập rồi mà muốn về trang login thì đá về trang chủ
  if (unAuthPaths.some((path) => pathname.startsWith(path) && isAuth)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/manage/:path*', '/login']
}
