'use client'

import { useAppContext } from '@/components/app-provider'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const menuItems = [
  {
    title: 'Món ăn', // authRequired = undefined nghĩa là đăng nhập hay chưa đều cho hiển thị
    href: '/menu'
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true // Khi true nghĩa là khi đăng nhập rồi mới hiển thị
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false // Khi false nghĩa là chưa đăng nhập thì sẽ hiển thị
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true // Khi true nghĩa là khi đăng nhập rồi mới hiển thị
  }
]

export default function NavItems({ className }: { className?: string }) {
  const { isAuth } = useAppContext()
  return menuItems.map((item) => {
    if ((item.authRequired === false && isAuth) || (item.authRequired == true && !isAuth)) return null
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  })
}
