import http from '@/lib/http'
import { CreateTableBodyType, TableListResType, TableResType, UpdateTableBodyType } from '@/schemaValidations/table.schema'

const prefix = '/tables'
const tableApiRequest = {
  list: () => http.get<TableListResType>(`${prefix}`),
  getDish: (id: number) => http.get<TableResType>(`${prefix}/${id}`),
  create: (body: CreateTableBodyType) => http.post<TableResType>(`${prefix}`, body),
  update: (id: number, body: UpdateTableBodyType) => http.put<TableResType>(`${prefix}/${id}`, body),
  delete: (id: number) => http.delete<TableResType>(`${prefix}/${id}`)
}

export default tableApiRequest
