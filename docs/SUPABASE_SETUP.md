# Supabase 配置指南

## 简介

Treasure Bag Game Hunter 支持两种数据库模式：
- **LocalStorage**: 本地浏览器存储（默认，适合开发和演示）
- **Supabase**: 云数据库（适合生产环境）

## 快速开始

### 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并创建账户
2. 创建新项目
3. 等待项目初始化完成

### 2. 获取项目信息

在 Supabase 项目仪表板中：
1. 进入 `Settings` > `API`
2. 复制以下信息：
   - Project URL
   - anon/public key

### 3. 配置环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# 切换到 Supabase 数据库
DATABASE_PROVIDER=supabase

# Admin Configuration (可选)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

### 4. 创建数据库表

在 Supabase 项目仪表板中：
1. 进入 `SQL Editor`
2. 复制 `supabase/schema.sql` 文件的内容
3. 粘贴并执行 SQL

或者使用 Supabase CLI：

```bash
# 安装 Supabase CLI
npm install -g supabase

# 初始化项目
supabase init

# 应用迁移
supabase db push
```

### 5. 验证配置

1. 重启开发服务器：
   ```bash
   bun dev
   ```

2. 访问测试页面：`http://localhost:3005/test-db`

3. 检查控制台输出，应该看到：
   ```
   ✅ Supabase client initialized successfully
   🚀 使用 Supabase 数据库
   ✅ 数据库初始化完成
   ```

## 数据库表结构

### 核心表

- `games`: 支持的游戏列表
- `game_categories`: 游戏专属分类
- `rarities`: 物品稀有度
- `items`: 游戏物品/账号

### 博客表

- `blog_categories`: 博客分类
- `blog_posts`: 博客文章

### 索引优化

系统已自动创建以下索引以优化查询性能：
- 物品按游戏、分类、稀有度查询
- 置顶和排序权重查询
- 博客文章发布状态查询

## 数据迁移

如果从 LocalStorage 迁移到 Supabase：

1. 确保 LocalStorage 中有数据
2. 配置 Supabase 环境变量
3. 运行迁移脚本（如果需要）

## 故障排除

### 连接失败

如果 Supabase 连接失败，系统会：
1. 显示警告消息
2. 自动回退到 LocalStorage
3. 确保应用正常运行

### 常见问题

1. **环境变量未设置**
   - 检查 `.env.local` 文件
   - 确保变量名正确

2. **数据库表不存在**
   - 运行 `supabase/schema.sql`
   - 检查表是否正确创建

3. **权限问题**
   - 检查 RLS (Row Level Security) 设置
   - 确保 anon key 有足够权限

## 生产环境部署

1. 在部署平台设置环境变量
2. 确保 `DATABASE_PROVIDER=supabase`
3. 配置 Supabase 生产环境
4. 运行数据库迁移

## 安全建议

1. 使用强密码保护 Supabase 项目
2. 配置适当的 RLS 策略
3. 定期备份数据
4. 监控 API 使用情况

## 支持

如需帮助，请检查：
1. Supabase 文档
2. 项目 Issues
3. 开发者社区
