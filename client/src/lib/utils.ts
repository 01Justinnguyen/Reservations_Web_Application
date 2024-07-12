import { toast } from '@/components/ui/use-toast'
import { EntityError } from '@/lib/http'
import { type ClassValue, clsx } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import jwt from 'jsonwebtoken'
import authApiRequest from '@/apiRequests/auth'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Xoá đi ký tự `\` đầu tiên của path
 */

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('accessToken') : null)

export const getRefreshTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('refreshToken') : null)
export const setAccessTokenToLocalStorage = (value: string) => isBrowser && localStorage.setItem('accessToken', value)

export const setRefreshTokenToLocalStorage = (value: string) => isBrowser && localStorage.setItem('refreshToken', value)
export const removeTokensFromLocalStorage = () => {
  isBrowser && localStorage.removeItem('accessToken')
  isBrowser && localStorage.removeItem('refreshToken')
}

export const checkAndRefreshToken = async (param?: { onSuccess?: () => void; onError?: () => void }) => {
  // Không nên đưa logic lấy access và refresh token ra khỏi function này
  // Vì để mỗi lần mà function này được gọi thì chúng ta sẽ có một accesss và refresh token mới
  // Tránh hiện tượng bug nó lấy access và refresh cũ ở lần đầu rồi gọi cho các lần tiếp theo
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  // Chưa đăng nhập thì cũng không cho chạy
  if (!accessToken || !refreshToken) return

  const decodedAccessToken = jwt.decode(accessToken) as { exp: number; iat: number }
  const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number; iat: number }
  // Thời điểm hết hạn của token là tính theo epoch time (s)
  // Còn khi mình dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
  const now = new Date().getTime() / 1000 - 1 // chuyển thành (s)
  // Trường hợp refresh token hết hạn thì cho logout
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage()
    return param?.onError && param.onError()
  }
  // Ví dụ access token của chúng ta có thời gian hết hạn là 10s thì chúng ta sẽ kiểm trả còn 1/3 thời gian thì mình sẽ cho refresh token lại
  // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken - now
  // Thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat
  if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    // Gọi API refresh token
    try {
      const res = await authApiRequest.refreshToken()
      setAccessTokenToLocalStorage(res.payload.data.accessToken)
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
      param?.onSuccess && param.onSuccess()
    } catch (error) {
      param?.onError && param.onError()
    }
  }
}

export const handleErrorApi = ({ error, setError, duration }: { error: any; setError?: UseFormSetError<any>; duration?: number }) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast({
      title: 'Lỗi🥵🥵🥵',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 4000
    })
  }
}
