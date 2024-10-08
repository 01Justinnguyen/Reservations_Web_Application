import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { HttpError } from '@/lib/http'
import authApiRequest from '@/apiRequests/auth'
import { GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import guestApiRequest from '@/apiRequests/guest'

export async function POST(request: Request) {
  const body = (await request.json()) as GuestLoginBodyType
  const cookieStore = cookies()

  try {
    const { payload } = await guestApiRequest.serverLogin(body)
    const { accessToken, refreshToken } = payload.data
    const decodedAccessToken = jwt.decode(accessToken) as { exp: number }
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number }

    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000
    })
    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000
    })

    return Response.json(payload)
  } catch (error) {
    console.log('🐻 ~ POST ~ error:', error)
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json(
        {
          message: 'Có lỗi xảy ra'
        },
        {
          status: 500
        }
      )
    }
  }
}
