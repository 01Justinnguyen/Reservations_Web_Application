import http from '@/lib/http'
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from '@/schemaValidations/dish.schema'

const prefix = '/dishes'
const dishApiRequest = {
  list: () => http.get<DishListResType>(`${prefix}`),
  getDish: (id: number) => http.get<DishResType>(`${prefix}/${id}`),
  create: (body: CreateDishBodyType) => http.post<DishResType>(`${prefix}`, body),
  update: (id: number, body: UpdateDishBodyType) => http.put<DishResType>(`${prefix}/${id}`, body),
  delete: (id: number) => http.delete<DishResType>(`${prefix}/${id}`)
}

export default dishApiRequest
