import http from '@/lib/http'
import { AccountResType } from '@/schemaValidations/account.schema'
import { LoginBodyType, LoginResType, LogoutBodyType } from '@/schemaValidations/auth.schema'
import { MessageResType } from '@/schemaValidations/common.schema'

const accountApiRequest = {
  me: () => http.get<AccountResType>('/accounts/me')
}

export default accountApiRequest
