import accountApiRequest from '@/apiRequests/account'
import { AccountResType, UpdateEmployeeAccountBodyType } from '@/schemaValidations/account.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export const useGetAccountList = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountApiRequest.list
  })
}

export const useGetInfoEmployee = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => accountApiRequest.getInfoEmployee(id)
  })
}

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts']
      })
    }
  })
}

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) => accountApiRequest.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts']
      })
    }
  })
}

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts']
      })
    }
  })
}
