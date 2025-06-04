import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // 从环境变量获取管理员凭据
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Aa11112222.'

    // 验证凭据
    if (username === adminUsername && password === adminPassword) {
      return NextResponse.json({ success: true, message: '登录成功' })
    }
    return NextResponse.json({ success: false, message: '用户名或密码错误' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}
