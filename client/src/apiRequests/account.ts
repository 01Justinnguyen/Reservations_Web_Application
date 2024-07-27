import http from '@/lib/http'
import { AccountListResType, AccountResType, ChangePasswordBodyType, CreateEmployeeAccountBodyType, UpdateEmployeeAccountBodyType, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { LoginBodyType, LoginResType, LogoutBodyType } from '@/schemaValidations/auth.schema'
import { MessageResType } from '@/schemaValidations/common.schema'

const prefix = '/accounts'

const accountApiRequest = {
  me: () => http.get<AccountResType>(`${prefix}/me`),
  serverMe: (accessToken: string) =>
    http.get<AccountResType>(`${prefix}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }),
  updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>(`${prefix}/me`, body),
  changePassword: (body: ChangePasswordBodyType) => http.put<AccountResType>(`${prefix}/change-password`, body),
  list: () => http.get<AccountListResType>(prefix),
  addEmployee: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>(prefix, body),
  getInfoEmployee: (id: number) => http.get<AccountResType>(`${prefix}/detail/${id}`),
  updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) => http.put<AccountResType>(`${prefix}/detail/${id}`, body),
  deleteEmployee: (id: number) => http.delete<AccountResType>(`${prefix}/detail/${id}`)
}

export default accountApiRequest
