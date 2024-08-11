import http from '@/lib/http'
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from '@/schemaValidations/dish.schema'

const prefix = '/dishes'
const dishApiRequest = {
  // Nếu là Nextjs 15 thì mặc định fetch sẽ là {cache: 'no-store'}
  // Hiện tại Nextjs 14 mặc định fetch sẽ là {cache: 'force-cache'}
  list: () => http.get<DishListResType>(`${prefix}`, { next: { tags: ['dishes'] } }),
  getDish: (id: number) => http.get<DishResType>(`${prefix}/${id}`),
  create: (body: CreateDishBodyType) => http.post<DishResType>(`${prefix}`, body),
  update: (id: number, body: UpdateDishBodyType) => http.put<DishResType>(`${prefix}/${id}`, body),
  delete: (id: number) => http.delete<DishResType>(`${prefix}/${id}`)
}

export default dishApiRequest
