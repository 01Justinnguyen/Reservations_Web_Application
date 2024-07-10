import accountApiRequest from '@/apiRequests/account'
import { AccountResType } from '@/schemaValidations/account.schema'
import { useQuery } from '@tanstack/react-query'

export const useAccountProfile = (onSuccess?: (data: AccountResType) => void, key?: string) => {
  return useQuery({
    queryKey: ['account-profile', key],
    queryFn: () =>
      accountApiRequest.me().then((res) => {
        if (onSuccess) onSuccess(res.payload)
        return res
      })
  })
}
