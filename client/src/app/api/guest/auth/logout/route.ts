import { cookies } from 'next/headers'
import guestApiRequest from '@/apiRequests/guest'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: 'Không nhận được access token và refresh token'
      },
      {
        status: 200
      }
    )
  }

  try {
    const result = await guestApiRequest.serverLogout({
      accessToken,
      refreshToken
    })
    return Response.json(result.payload)
  } catch (error) {
    console.log('🐻 ~ POST ~ error:', error)
    return Response.json(
      {
        message: 'Lỗi khi gọi API đến server backend'
      },
      {
        status: 200
      }
    )
  }
}
