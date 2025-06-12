-- Create tables for Treasure Bag Game Hunter

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  gold_rate INTEGER NOT NULL DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table (general categories)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game-specific categories table
CREATE TABLE IF NOT EXISTS game_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(game_id, name)
);

-- Rarities table
CREATE TABLE IF NOT EXISTS rarities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  color VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  category_id UUID REFERENCES game_categories(id) ON DELETE SET NULL,
  rarity_id UUID REFERENCES rarities(id) ON DELETE SET NULL,
  platform VARCHAR(255) DEFAULT 'PC',
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  gold_price VARCHAR(255) NOT NULL,
  image TEXT,
  description TEXT,
  url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  image TEXT,
  published BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social contacts table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_game_id ON items(game_id);
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_rarity_id ON items(rarity_id);
CREATE INDEX IF NOT EXISTS idx_items_featured ON items(is_featured);
CREATE INDEX IF NOT EXISTS idx_items_sort_order ON items(sort_order);
CREATE INDEX IF NOT EXISTS idx_game_categories_game_id ON game_categories(game_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_social_contacts_active ON social_contacts(is_active);
CREATE INDEX IF NOT EXISTS idx_social_contacts_sort_order ON social_contacts(sort_order);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_contacts_updated_at BEFORE UPDATE ON social_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO games (name, display_name, gold_rate) VALUES
  ('maplestory', 'MapleStory', 1000),
  ('maplestory-m', 'MapleStory M', 500),
  ('other', 'Other Games', 1000)
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, display_name, description) VALUES
  ('账号', '账号', '游戏账号类商品'),
  ('物品', '物品', '游戏物品类商品')
ON CONFLICT (name) DO NOTHING;

INSERT INTO rarities (name, display_name, color) VALUES
  ('common', '普通', 'gray'),
  ('rare', '稀有', 'blue'),
  ('epic', '史诗', 'purple'),
  ('legendary', '传说', 'orange')
ON CONFLICT (name) DO NOTHING;

-- Insert game-specific categories
WITH game_ids AS (
  SELECT id, name FROM games
)
INSERT INTO game_categories (game_id, name, display_name, description, sort_order)
SELECT
  g.id,
  gc.name,
  gc.display_name,
  gc.description,
  gc.sort_order
FROM game_ids g
CROSS JOIN (VALUES
  ('weapon', '武器', 'MapleStory武器装备', 1),
  ('armor', '防具', 'MapleStory防具装备', 2),
  ('accessory', '饰品', 'MapleStory饰品装备', 3),
  ('account', '账号', 'MapleStory游戏账号', 10)
) AS gc(name, display_name, description, sort_order)
WHERE g.name = 'maplestory'
ON CONFLICT (game_id, name) DO NOTHING;

WITH game_ids AS (
  SELECT id, name FROM games
)
INSERT INTO game_categories (game_id, name, display_name, description, sort_order)
SELECT
  g.id,
  gc.name,
  gc.display_name,
  gc.description,
  gc.sort_order
FROM game_ids g
CROSS JOIN (VALUES
  ('equipment', '装备', 'MapleStory M装备', 1),
  ('material', '材料', 'MapleStory M材料物品', 2),
  ('account', '账号', 'MapleStory M游戏账号', 10)
) AS gc(name, display_name, description, sort_order)
WHERE g.name = 'maplestory-m'
ON CONFLICT (game_id, name) DO NOTHING;

WITH game_ids AS (
  SELECT id, name FROM games
)
INSERT INTO game_categories (game_id, name, display_name, description, sort_order)
SELECT
  g.id,
  gc.name,
  gc.display_name,
  gc.description,
  gc.sort_order
FROM game_ids g
CROSS JOIN (VALUES
  ('item', '道具', '其他游戏道具', 1),
  ('account', '账号', '其他游戏账号', 10)
) AS gc(name, display_name, description, sort_order)
WHERE g.name = 'other'
ON CONFLICT (game_id, name) DO NOTHING;

-- Insert default blog categories
INSERT INTO blog_categories (name, display_name, description) VALUES
  ('news', '新闻', '游戏新闻和更新'),
  ('guides', '攻略', '游戏攻略和技巧'),
  ('events', '活动', '游戏活动和比赛'),
  ('community', '社区', '社区动态和讨论')
ON CONFLICT (name) DO NOTHING;

-- Insert default social contacts
INSERT INTO social_contacts (platform, username, url, is_active, sort_order) VALUES
  ('telegram', '@treasurehunter', 'https://t.me/treasurehunter', TRUE, 1),
  ('discord', 'treasurehunter', 'https://discord.gg/treasurehunter', TRUE, 2),
  ('whatsapp', '+1234567890', 'https://wa.me/1234567890', TRUE, 3),
  ('email', 'contact@treasurehunter.com', 'mailto:contact@treasurehunter.com', TRUE, 4)
ON CONFLICT DO NOTHING;
