import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { HttpError } from '@/lib/http'
import authApiRequest from '@/apiRequests/auth'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!refreshToken) {
    return Response.json(
      {
        message: 'Không tìm thấy refresh token'
      },
      {
        status: 401
      }
    )
  }
  try {
    const { payload } = await authApiRequest.serverRefreshToken({
      refreshToken
    })
    const decodedAccessToken = jwt.decode(payload.data.accessToken) as { exp: number }
    const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as { exp: number }

    cookieStore.set('accessToken', payload.data.accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000
    })
    cookieStore.set('refreshToken', payload.data.refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000
    })

    return Response.json(payload)
  } catch (error: any) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json(
        {
          message: error.message ?? 'Có lỗi xảy ra'
        },
        {
          status: 401
        }
      )
    }
  }
}
