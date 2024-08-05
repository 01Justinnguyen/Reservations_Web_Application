import tableApiRequest from '@/apiRequests/table'
import { UpdateTableBodyType } from '@/schemaValidations/table.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useTableList = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: tableApiRequest.list
  })
}

export const useGetTable = ({ id, enabled }: { id: number; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['tables', id],
    queryFn: () => tableApiRequest.getDish(id),
    enabled
  })
}

export const useCreateTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tableApiRequest.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tables']
      })
    }
  })
}

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTableBodyType & { id: number }) => tableApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tables'],
        exact: true
      })
    }
  })
}

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tableApiRequest.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tables']
      })
    }
  })
}
