import http from '@/lib/http'
import { LoginBodyType, LoginResType, LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from '@/schemaValidations/auth.schema'
import { MessageResType } from '@/schemaValidations/common.schema'

const authApiRequest = {
  serverLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType>('/api/auth/login', body, {
      baseUrl: ''
    }),
  serverLogout: (
    body: LogoutBodyType & {
      accessToken: string
    }
  ) =>
    http.post<MessageResType>(
      '/auth/logout',
      {
        refreshToken: body.refreshToken
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`
        }
      }
    ),
  logout: () =>
    http.post<MessageResType>('/api/auth/logout', null, {
      baseUrl: ''
    }),

  serverRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('/auth/refresh-token', body),
  refreshToken: () =>
    http.post('/api/auth/refresh-token', null, {
      baseUrl: ''
    })
}

export default authApiRequest
