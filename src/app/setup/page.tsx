"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SetupPage() {
  const [envConfig, setEnvConfig] = useState({
    supabaseUrl: '',
    supabaseKey: '',
    dbProvider: ''
  })
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    // 检查环境变量配置
    const config = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      dbProvider: process.env.DATABASE_PROVIDER || ''
    }
    setEnvConfig(config)
    setIsConfigured(!!(config.supabaseUrl && config.supabaseKey))
  }, [])

  const envFileContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Configuration
DATABASE_PROVIDER=supabase

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password`

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('已复制到剪贴板!')
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">🚀 Supabase 配置指南</h1>
          <p className="text-xl text-gray-300">
            配置 Supabase 数据库以启用云存储和多用户支持
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        {/* 配置状态 */}
        <div className={`mb-8 p-6 rounded-lg border-2 ${
          isConfigured
            ? 'bg-green-900/20 border-green-500'
            : 'bg-red-900/20 border-red-500'
        }`}>
          <div className="flex items-center mb-4">
            <div className={`w-4 h-4 rounded-full mr-3 ${
              isConfigured ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <h2 className="text-xl font-semibold">
              {isConfigured ? '✅ 配置完成' : '❌ 需要配置'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="text-blue-400">Supabase URL:</span> {envConfig.supabaseUrl ? '✅ 已设置' : '❌ 未设置'}</p>
              <p><span className="text-blue-400">Supabase Key:</span> {envConfig.supabaseKey ? '✅ 已设置' : '❌ 未设置'}</p>
            </div>
            <div>
              <p><span className="text-blue-400">数据库提供商:</span> {envConfig.dbProvider || 'supabase (默认)'}</p>
              <p><span className="text-blue-400">状态:</span> {isConfigured ? '可以使用' : '需要配置'}</p>
            </div>
          </div>

          {isConfigured && (
            <div className="mt-4 flex space-x-4">
              <Link
                href="/supabase-test"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
              >
                测试数据库连接
              </Link>
              <Link
                href="/admin"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                进入管理后台
              </Link>
            </div>
          )}
        </div>

        {/* 配置步骤 */}
        <div className="space-y-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">📋 配置步骤</h3>

            <div className="space-y-6">
              {/* 步骤 1 */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-lg font-medium mb-2">1. 创建 Supabase 项目</h4>
                <p className="text-gray-300 mb-2">访问 Supabase 官网创建新项目</p>
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  打开 Supabase 官网 →
                </a>
              </div>

              {/* 步骤 2 */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="text-lg font-medium mb-2">2. 获取项目配置</h4>
                <p className="text-gray-300 mb-2">在项目设置中获取以下信息：</p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Project URL (项目地址)</li>
                  <li>anon/public key (公开密钥)</li>
                  <li>service_role key (服务密钥，可选)</li>
                </ul>
              </div>

              {/* 步骤 3 */}
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="text-lg font-medium mb-2">3. 配置环境变量</h4>
                <p className="text-gray-300 mb-4">创建 <code className="bg-gray-700 px-2 py-1 rounded">.env.local</code> 文件：</p>

                <div className="bg-gray-900 rounded-lg p-4 relative">
                  <button
                    onClick={() => copyToClipboard(envFileContent)}
                    className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
                  >
                    复制
                  </button>
                  <pre className="text-sm text-green-300 overflow-x-auto">
                    {envFileContent}
                  </pre>
                </div>

                <p className="text-yellow-300 text-sm mt-2">
                  ⚠️ 请将 <code>your_supabase_project_url_here</code> 和 <code>your_supabase_anon_key_here</code> 替换为实际值
                </p>
              </div>

              {/* 步骤 4 */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="text-lg font-medium mb-2">4. 创建数据库表</h4>
                <p className="text-gray-300 mb-2">在 Supabase 项目的 SQL 编辑器中运行以下脚本：</p>

                <div className="bg-gray-900 rounded-lg p-4 relative">
                  <button
                    onClick={() => copyToClipboard('-- 运行 supabase/schema.sql 文件中的SQL脚本')}
                    className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
                  >
                    复制路径
                  </button>
                  <pre className="text-sm text-orange-300">
                    {`-- 请在项目根目录下找到 supabase/schema.sql 文件
-- 复制其内容到 Supabase 的 SQL 编辑器中执行
-- 或者查看: docs/SUPABASE_SETUP.md 获取详细说明`}
                  </pre>
                </div>
              </div>

              {/* 步骤 5 */}
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="text-lg font-medium mb-2">5. 重启开发服务器</h4>
                <p className="text-gray-300 mb-2">配置完成后重启服务器：</p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <code className="text-red-300">bun dev</code>
                </div>
              </div>
            </div>
          </div>

          {/* 常见问题 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">❓ 常见问题</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-yellow-400">Q: 环境变量配置后仍然显示未设置？</h4>
                <p className="text-gray-300">A: 请确保重启开发服务器，并检查 .env.local 文件是否在项目根目录。</p>
              </div>

              <div>
                <h4 className="font-medium text-yellow-400">Q: 数据库连接失败？</h4>
                <p className="text-gray-300">A: 检查 URL 和密钥是否正确，确保 Supabase 项目处于活跃状态。</p>
              </div>

              <div>
                <h4 className="font-medium text-yellow-400">Q: 表不存在错误？</h4>
                <p className="text-gray-300">A: 请确保在 Supabase 中运行了 schema.sql 脚本创建所有必要的表。</p>
              </div>
            </div>
          </div>

          {/* 相关链接 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">🔗 相关链接</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">文档</h4>
                <ul className="space-y-1">
                  <li><Link href="/docs/SUPABASE_SETUP.md" className="text-blue-400 hover:text-blue-300 underline">详细配置指南</Link></li>
                  <li><a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Supabase 官方文档</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">测试页面</h4>
                <ul className="space-y-1">
                  <li><Link href="/supabase-test" className="text-blue-400 hover:text-blue-300 underline">数据库连接测试</Link></li>
                  <li><Link href="/test-db" className="text-blue-400 hover:text-blue-300 underline">基础数据库测试</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 返回按钮 */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
