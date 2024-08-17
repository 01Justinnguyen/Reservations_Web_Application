import { Role } from '@/constants/type'
import { decodedToken } from '@/lib/utils'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const managePaths = ['/manage']
const guestPaths = ['/guest']
const privatePaths = [...managePaths, ...guestPaths]
const unAuthPaths = ['/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  // Muốn truy cập vào các route private nhưng chưa đăng nhập thì đá về login
  if (privatePaths.some((path) => pathname.startsWith(path) && !refreshToken)) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  // Trường hợp đã đăng nhập
  if (refreshToken) {
    // Nếu cố tình vào trang login sẽ redirect về trang chủ
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Trường hơp đăng nhập rồi nhưng access token lại hết hạn
    if (privatePaths.some((path) => pathname.startsWith(path) && !accessToken)) {
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken', refreshToken ?? '')
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Nếu truy cập vào không đúng quyền hạn của role thì redirect về trang chủ
    const role = decodedToken(refreshToken).role
    // Guest nhưng cố truy cập vào route manage
    const isGuestGotoManagePath = role === Role.Guest && managePaths.some((path) => path.startsWith(path))
    // Không phải guest nhưng cố truy cập vào route guest
    const isNotGuestGoToGuestPath = role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path))
    // Không phải Owner nhưng cố tình truy cập vào các route dành cho owner

    if (isGuestGotoManagePath || isNotGuestGoToGuestPath) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/manage/:path*', '/guest/:path*', '/login']
}
