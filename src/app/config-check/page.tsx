"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ConfigCheckPage() {
  const [config, setConfig] = useState({
    hasEnvFile: false,
    supabaseUrl: '',
    supabaseKey: '',
    isValidUrl: false,
    isValidKey: false,
    overallValid: false
  })

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    const isValidUrl = supabaseUrl && supabaseUrl !== 'your_supabase_project_url_here' && supabaseUrl.includes('supabase.co')
    const isValidKey = supabaseKey && supabaseKey !== 'your_supabase_anon_key_here' && supabaseKey.length > 20

    setConfig({
      hasEnvFile: !!(supabaseUrl || supabaseKey),
      supabaseUrl,
      supabaseKey,
      isValidUrl: !!isValidUrl,
      isValidKey: !!isValidKey,
      overallValid: !!(isValidUrl && isValidKey)
    })
  }, [])

  const getStatusIcon = (isValid: boolean) => isValid ? '✅' : '❌'
  const getStatusText = (isValid: boolean) => isValid ? '有效' : '无效'

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔍 配置检查</h1>

        {/* 总体状态 */}
        <div className={`mb-8 p-6 rounded-lg border-2 ${
          config.overallValid
            ? 'bg-green-900/20 border-green-500'
            : 'bg-red-900/20 border-red-500'
        }`}>
          <h2 className="text-2xl font-semibold mb-4">
            {getStatusIcon(config.overallValid)} 配置状态: {getStatusText(config.overallValid)}
          </h2>

          {config.overallValid ? (
            <div className="text-green-300">
              <p>🎉 Supabase 配置正确！您可以开始使用应用了。</p>
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
            </div>
          ) : (
            <div className="text-red-300">
              <p>⚠️ 配置存在问题，请检查下方详细信息并修复。</p>
              <div className="mt-4">
                <Link
                  href="/setup"
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  查看配置指南
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 详细配置检查 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">详细配置检查</h3>

          <div className="space-y-4">
            {/* 环境文件检查 */}
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded">
              <div>
                <h4 className="font-medium">环境文件 (.env.local)</h4>
                <p className="text-sm text-gray-400">检查是否存在环境变量配置</p>
              </div>
              <div className="text-right">
                <span className="text-lg">{getStatusIcon(config.hasEnvFile)}</span>
                <p className="text-sm">{getStatusText(config.hasEnvFile)}</p>
              </div>
            </div>

            {/* Supabase URL 检查 */}
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded">
              <div>
                <h4 className="font-medium">Supabase URL</h4>
                <p className="text-sm text-gray-400">
                  {config.supabaseUrl ?
                    (config.supabaseUrl.length > 50 ? `${config.supabaseUrl.substring(0, 50)}...` : config.supabaseUrl) :
                    '未设置'
                  }
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg">{getStatusIcon(config.isValidUrl)}</span>
                <p className="text-sm">{getStatusText(config.isValidUrl)}</p>
              </div>
            </div>

            {/* Supabase Key 检查 */}
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded">
              <div>
                <h4 className="font-medium">Supabase API Key</h4>
                <p className="text-sm text-gray-400">
                  {config.supabaseKey ?
                    `${config.supabaseKey.substring(0, 20)}...` :
                    '未设置'
                  }
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg">{getStatusIcon(config.isValidKey)}</span>
                <p className="text-sm">{getStatusText(config.isValidKey)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 常见问题 */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">常见问题解决</h3>

          <div className="space-y-4">
            {!config.hasEnvFile && (
              <div className="p-4 bg-yellow-900/20 border border-yellow-500 rounded">
                <h4 className="font-medium text-yellow-400">❌ 没有找到环境变量</h4>
                <p className="text-yellow-200">请确保项目根目录下有 .env.local 文件</p>
              </div>
            )}

            {config.hasEnvFile && !config.isValidUrl && (
              <div className="p-4 bg-red-900/20 border border-red-500 rounded">
                <h4 className="font-medium text-red-400">❌ Supabase URL 无效</h4>
                <p className="text-red-200">URL 应该类似于: https://your-project.supabase.co</p>
                <p className="text-red-200">请勿使用占位符值 'your_supabase_project_url_here'</p>
              </div>
            )}

            {config.hasEnvFile && !config.isValidKey && (
              <div className="p-4 bg-red-900/20 border border-red-500 rounded">
                <h4 className="font-medium text-red-400">❌ Supabase API Key 无效</h4>
                <p className="text-red-200">Key 应该是长字符串，以 'eyJ' 开头</p>
                <p className="text-red-200">请勿使用占位符值 'your_supabase_anon_key_here'</p>
              </div>
            )}
          </div>
        </div>

        {/* 配置步骤 */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">快速配置步骤</h3>

          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>访问 <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Supabase 官网</a> 创建项目</li>
            <li>在项目设置 → API 页面复制 Project URL 和 anon key</li>
            <li>编辑项目根目录下的 .env.local 文件</li>
            <li>将复制的值替换占位符文本</li>
            <li>重启开发服务器: <code className="bg-gray-700 px-2 py-1 rounded">bun dev</code></li>
          </ol>
        </div>

        {/* 导航按钮 */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/setup"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
          >
            详细配置指南
          </Link>
          <Link
            href="/"
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors"
          >
            返回首页
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors"
          >
            重新检查
          </button>
        </div>
      </div>
    </div>
  )
}
