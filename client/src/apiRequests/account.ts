import http from '@/lib/http'
import { AccountResType, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { LoginBodyType, LoginResType, LogoutBodyType } from '@/schemaValidations/auth.schema'
import { MessageResType } from '@/schemaValidations/common.schema'

const accountApiRequest = {
  me: () => http.get<AccountResType>('/accounts/me'),
  updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>('/accounts/me', body)
}

export default accountApiRequest
