# Vercel 部署指南

## 🚀 一键部署到 Vercel

### 方式一：通过 Vercel Dashboard

1. **访问 Vercel**
   - 登录 [https://vercel.com/](https://vercel.com/)
   - 点击 "New Project"

2. **导入 GitHub 仓库**
   - 选择 "Import Git Repository"
   - 输入仓库地址：`https://github.com/DongDongii/treasure-bag-game-hunter`
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (默认)
   - **Build Command**: `next build` (自动检测)
   - **Output Directory**: `.next` (自动检测)
   - **Install Command**: `bun install`

### 方式二：一键部署按钮

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DongDongii/treasure-bag-game-hunter)

## 🔑 环境变量配置

在 Vercel Dashboard 的项目设置中，添加以下环境变量：

### 必需的环境变量

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://rukdoydtlxnvvfaspfpc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1a2RveWR0bHhudnZmYXNwZnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTEwNjksImV4cCI6MjA2NDQ4NzA2OX0.DA0i6VHImHve7oTD3FCqVyigDfVQOTeQorN7r6WpIno

# 管理员凭据
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Aa11112222.

# 数据库提供商
DATABASE_PROVIDER=supabase
```

### 可选的环境变量

```env
# Supabase Service Role Key (仅管理员功能需要)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 📝 部署步骤详解

### 1. 准备工作

确保您的 GitHub 仓库是最新的：
```bash
git push origin master
```

### 2. 在 Vercel 中配置

1. **项目设置**
   - Framework: Next.js
   - Node.js Version: 18.x (推荐)
   - Package Manager: Bun

2. **环境变量设置**
   - 进入项目 Settings → Environment Variables
   - 添加上述所有必需的环境变量
   - 确保 `NEXT_PUBLIC_` 前缀的变量可以在客户端访问

3. **域名设置**（可选）
   - 在 Settings → Domains 中添加自定义域名

### 3. 部署

点击 "Deploy" 按钮开始部署。

## 🔍 部署后验证

### 检查列表

- [ ] 主页加载正常
- [ ] 社交联系方式显示正确
- [ ] 管理后台可以正常登录
- [ ] 数据库连接正常
- [ ] 图片资源加载正常

### 测试地址

部署完成后，Vercel 会提供一个类似这样的地址：
- **生产地址**: `https://your-project-name.vercel.app`
- **管理后台**: `https://your-project-name.vercel.app/admin`

### 常见问题排查

1. **404 错误**
   - 检查路由文件是否正确
   - 确认 `app` 目录结构

2. **数据库连接失败**
   - 检查 Supabase 环境变量是否正确
   - 确认 Supabase 项目状态

3. **管理员登录失败**
   - 确认 `ADMIN_USERNAME` 和 `ADMIN_PASSWORD` 环境变量
   - 检查 API 路由是否正常

## 🎯 性能优化

### 自动优化

Vercel 会自动为您的 Next.js 应用提供：
- 自动代码分割
- 图片优化
- 边缘缓存
- 自动 HTTPS

### 手动优化建议

1. **启用增量静态再生 (ISR)**
2. **配置适当的缓存头**
3. **优化图片大小和格式**

## 📊 监控和分析

部署后，您可以在 Vercel Dashboard 中查看：
- 部署历史
- 性能分析
- 错误日志
- 访问统计

## 🔄 持续部署

每次向 `master` 分支推送代码时，Vercel 会自动重新部署您的应用。

---

**部署完成后，您的 Treasure Bag Game Hunter 平台就可以在全球范围内访问了！** 🌍✨
