'use client'

import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Những page sau sẽ khồng check refresh token
const UNAUTHENTICATED_PATHS = ['/login', '/logout', '/refresh-token']

export default function RefreshToken() {
  const pathname = usePathname()

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return
    let interval: any = null

    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval)
      }
    })
    // Timeout interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ thời gian hết hạn access token là 10s thì 1s mình sẽ cho check 1 lần
    const TIMEOUT = 1000
    interval = setInterval(checkAndRefreshToken, TIMEOUT)

    return () => {
      clearInterval(interval)
    }
  }, [pathname])
  return null
}