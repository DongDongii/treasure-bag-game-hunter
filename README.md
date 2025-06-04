# 🎮 宝藏猎人 - 游戏物品交易平台 | Treasure Bag Game Hunter

一个现代化的游戏物品展示和交易平台，专为游戏玩家打造的一站式服务。

## ✨ 功能特性

### 🎯 核心功能
- **多游戏支持** - 支持MapleStory、MapleStory M等多种游戏
- **商品管理** - 完整的商品CRUD操作，支持置顶和排序
- **多语言支持** - 支持8种语言（中文、英语、德语、意大利语、俄语、土耳其语、西班牙语、葡萄牙语）
- **响应式设计** - 完美适配桌面端、平板和移动设备

### 🛡️ 管理功能
- **商品管理** - 添加、编辑、删除商品，支持图片上传
- **游戏管理** - 管理支持的游戏类型
- **分类管理** - 灵活的商品分类系统
- **置顶功能** - 重要商品可设置置顶显示

### 🌐 用户体验
- **智能搜索** - 支持名称、ID、描述全文搜索
- **多重过滤** - 按游戏、分类、平台筛选
- **一键复制** - 快速复制商品信息
- **社交联系** - 多平台联系方式管理

## 🚀 技术栈

### 前端框架
- **Next.js 15** - React 框架，使用 App Router
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **shadcn/ui** - 现代化的 UI 组件库

### 开发工具
- **Bun** - 快速的 JavaScript 运行时和包管理器
- **Biome** - 快速的代码格式化和 linting 工具
- **Lucide React** - 美观的图标库

### 数据管理
- **Supabase** - 云数据库，支持实时同步和多用户访问
- **PostgreSQL** - 强大的关系型数据库支持
- **实时更新** - 数据变更实时同步

## 📦 快速开始

### 环境要求
- Node.js 18+ 或 Bun
- 现代浏览器

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/treasure-bag-game-hunter.git
cd treasure-bag-game-hunter
```

2. **安装依赖**
```bash
bun install
# 或
npm install
```

3. **配置 Supabase 数据库**
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local 填入 Supabase 配置
# NEXT_PUBLIC_SUPABASE_URL=your_project_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

详细配置指南：[访问 /setup 页面](http://localhost:3005/setup)

4. **启动开发服务器**
```bash
bun dev
# 或
npm run dev
```

5. **访问应用**
打开浏览器访问 [http://localhost:3005](http://localhost:3005)

### 管理后台
- 访问地址：[http://localhost:3005/admin](http://localhost:3005/admin)
- 默认账号：admin
- 默认密码：admin

## 🎨 项目结构

```
src/
├── app/                 # Next.js App Router 页面
│   ├── admin/          # 管理后台
│   ├── items/          # 商品展示页面
│   └── layout.tsx      # 根布局
├── components/         # React 组件
│   ├── ui/            # shadcn/ui 组件
│   └── ...            # 业务组件
├── lib/               # 工具函数和配置
│   ├── database.ts    # 数据库抽象层
│   └── i18n.ts        # 国际化配置
└── styles/            # 样式文件
```

## 🌍 国际化

项目支持以下语言：
- 🇨🇳 中文 (简体)
- 🇺🇸 English
- 🇩🇪 Deutsch
- 🇮🇹 Italiano
- 🇷🇺 Русский
- 🇹🇷 Türkçe
- 🇪🇸 Español
- 🇵🇹 Português

## 📱 支持的平台

- **PC** - Windows, macOS, Linux
- **游戏机** - Xbox, PlayStation, Nintendo Switch
- **移动端** - iOS, Android
- **游戏平台** - Steam, Epic Games

## 🔧 配置说明

### 环境变量
```env
# 可选：Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 数据存储
项目默认使用 LocalStorage 进行数据存储，无需额外配置。如需使用 Supabase，请配置相应的环境变量。

## 🚀 部署

### Netlify 部署
```bash
# 构建项目
bun run build

# 部署到 Netlify
# 上传 .next 文件夹或使用 Netlify CLI
```

### Vercel 部署
```bash
# 使用 Vercel CLI
vercel

# 或直接从 GitHub 部署
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙋‍♂️ 联系我们

- **项目地址**: [GitHub Repository](https://github.com/your-username/treasure-bag-game-hunter)
- **问题反馈**: [GitHub Issues](https://github.com/your-username/treasure-bag-game-hunter/issues)

## 🎉 致谢

感谢所有为这个项目做出贡献的开发者和社区成员！

---

**Made with ❤️ for gamers by gamers**
