"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function InitSocialContactsPage() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const createTableAndData = async () => {
    setLoading(true)
    setStatus('开始初始化社交联系方式表...')

    try {
      // 首先尝试创建表
      setStatus('创建 social_contacts 表...')
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS social_contacts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          platform VARCHAR(50) NOT NULL,
          username VARCHAR(255) NOT NULL,
          url TEXT NOT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_social_contacts_active ON social_contacts(is_active);
        CREATE INDEX IF NOT EXISTS idx_social_contacts_sort_order ON social_contacts(sort_order);

        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        DROP TRIGGER IF EXISTS update_social_contacts_updated_at ON social_contacts;
        CREATE TRIGGER update_social_contacts_updated_at BEFORE UPDATE ON social_contacts
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `

      const { error: createError } = await supabase.rpc('exec', { sql: createTableSQL })

      if (createError) {
        console.error('Create table error:', createError)
        // 如果 rpc 不工作，尝试直接使用 SQL
        const { error: directError } = await supabase
          .from('social_contacts')
          .select('count')
          .limit(1)

        if (directError && directError.code === '42P01') {
          setStatus('❌ 表不存在且无法创建，请在 Supabase 控制台手动运行 schema.sql')
          return
        }
      }

      setStatus('✅ 表创建成功，插入默认数据...')

      // 插入默认数据
      const defaultContacts = [
        {
          platform: 'telegram',
          username: '@treasurehunter',
          url: 'https://t.me/treasurehunter',
          is_active: true,
          sort_order: 1
        },
        {
          platform: 'discord',
          username: 'treasurehunter',
          url: 'https://discord.gg/treasurehunter',
          is_active: true,
          sort_order: 2
        },
        {
          platform: 'whatsapp',
          username: '+1234567890',
          url: 'https://wa.me/1234567890',
          is_active: true,
          sort_order: 3
        },
        {
          platform: 'email',
          username: 'contact@treasurehunter.com',
          url: 'mailto:contact@treasurehunter.com',
          is_active: true,
          sort_order: 4
        }
      ]

      const { data, error: insertError } = await supabase
        .from('social_contacts')
        .insert(defaultContacts)
        .select()

      if (insertError) {
        console.error('Insert error:', insertError)
        setStatus(`❌ 插入数据失败: ${insertError.message}`)
        return
      }

      setStatus(`✅ 初始化完成！成功创建 ${data?.length || 0} 个联系方式`)

    } catch (error) {
      console.error('Error:', error)
      setStatus(`❌ 初始化失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  const checkExistingData = async () => {
    setLoading(true)
    setStatus('检查现有数据...')

    try {
      const { data, error } = await supabase
        .from('social_contacts')
        .select('*')
        .order('sort_order')

      if (error) {
        setStatus(`❌ 检查失败: ${error.message}`)
        return
      }

      if (data.length === 0) {
        setStatus('📝 没有找到数据')
      } else {
        setStatus(`📊 找到 ${data.length} 个联系方式:`)
        for (const contact of data) {
          setStatus(prev => `${prev}\n- ${contact.platform}: ${contact.username}`)
        }
      }
    } catch (error) {
      setStatus(`❌ 检查失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🚀 社交联系方式初始化</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">操作</h2>
          <div className="flex space-x-4 mb-4">
            <Button
              onClick={checkExistingData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              检查现有数据
            </Button>
            <Button
              onClick={createTableAndData}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              创建表并插入数据
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">状态</h2>
          <div className="bg-gray-900 rounded p-4 min-h-[200px]">
            <pre className="text-green-300 whitespace-pre-wrap">
              {loading ? '🔄 处理中...\n' : ''}
              {status || '等待操作...'}
            </pre>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 mb-6">
          <h3 className="text-yellow-400 font-semibold mb-2">💡 手动方式</h3>
          <p className="text-yellow-200 text-sm mb-3">
            如果自动创建失败，请在 Supabase 控制台的 SQL 编辑器中运行以下 SQL：
          </p>
          <div className="bg-gray-900 rounded p-3 text-xs">
            <code className="text-green-300">
              {`-- 在 Supabase 控制台运行这些 SQL 语句
CREATE TABLE IF NOT EXISTS social_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  username VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO social_contacts (platform, username, url, is_active, sort_order) VALUES
  ('telegram', '@treasurehunter', 'https://t.me/treasurehunter', TRUE, 1),
  ('discord', 'treasurehunter', 'https://discord.gg/treasurehunter', TRUE, 2),
  ('whatsapp', '+1234567890', 'https://wa.me/1234567890', TRUE, 3),
  ('email', 'contact@treasurehunter.com', 'mailto:contact@treasurehunter.com', TRUE, 4);`}
            </code>
          </div>
        </div>

        <div className="flex space-x-4">
          <Link href="/" className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">
            返回首页
          </Link>
          <Link href="/admin" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
            管理后台
          </Link>
          <Link href="/supabase-test" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            数据库测试
          </Link>
        </div>
      </div>
    </div>
  )
}
