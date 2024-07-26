import accountApiRequest from '@/apiRequests/account'
import { cookies } from 'next/headers'
import React from 'react'

export default async function Dashboard() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value!
  let name = ''
  try {
    const result = await accountApiRequest.serverMe(accessToken)
    name = result.payload.data.name
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) {
      console.log('Lỗi ở đây nè hiểu không')
      throw error
    }
  }
  return <div>Dashboard {name}</div>
}
