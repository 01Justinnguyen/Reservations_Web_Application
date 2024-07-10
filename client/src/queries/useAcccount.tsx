import accountApiRequest from '@/apiRequests/account'
import { AccountResType } from '@/schemaValidations/account.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useAccountMe = (onSuccess?: (data: AccountResType) => void, key?: string) => {
  return useQuery({
    queryKey: ['account-me', key],
    queryFn: () =>
      accountApiRequest.me().then((res) => {
        if (onSuccess) onSuccess(res.payload)
        return res
      })
  })
}

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe
  })
}

export const useChangePasswordMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePassword
  })
}
