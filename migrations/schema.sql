CREATE TABLE IF NOT EXISTS languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  rtl BOOLEAN NOT NULL DEFAULT FALSE,
  "default" BOOLEAN NOT NULL DEFAULT FALSE
);

-- 插入支持的语言
INSERT INTO languages (code, name, native_name, active, rtl, "default") VALUES
('en', 'English', 'English', TRUE, FALSE, TRUE),
('zh', 'Chinese', '中文', TRUE, FALSE, FALSE),
('es', 'Spanish', 'Español', TRUE, FALSE, FALSE),
('fr', 'French', 'Français', TRUE, FALSE, FALSE),
('pt', 'Portuguese', 'Português', TRUE, FALSE, FALSE),
('ar', 'Arabic', 'العربية', TRUE, TRUE, FALSE),
('ru', 'Russian', 'Русский', TRUE, FALSE, FALSE);

-- 站点设置表
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  "order" INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 分类翻译表
CREATE TABLE IF NOT EXISTS category_translations (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE(category_id, language_code)
);

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 标签翻译表
CREATE TABLE IF NOT EXISTS tag_translations (
  id SERIAL PRIMARY KEY,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  UNIQUE(tag_id, language_code)
);

-- 工具表
CREATE TABLE IF NOT EXISTS tools (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  favicon TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved BOOLEAN NOT NULL DEFAULT FALSE
);

-- 工具翻译表
CREATE TABLE IF NOT EXISTS tool_translations (
  id SERIAL PRIMARY KEY,
  tool_id INTEGER NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE(tool_id, language_code)
);

-- 工具-分类关联表
CREATE TABLE IF NOT EXISTS tool_categories (
  tool_id INTEGER NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (tool_id, category_id)
);

-- 工具-标签关联表
CREATE TABLE IF NOT EXISTS tool_tags (
  tool_id INTEGER NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (tool_id, tag_id)
);

-- 用户资料表
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 博客文章表
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  featured_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'draft'
);

-- 博客文章翻译表
CREATE TABLE IF NOT EXISTS post_translations (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  UNIQUE(post_id, language_code),
  UNIQUE(language_code, slug)
);

-- 文章-分类关联表
CREATE TABLE IF NOT EXISTS post_categories (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- 文章-标签关联表
CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- 评论表
CREATE TABLE IF NOT EXISTS post_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  parent_id INTEGER REFERENCES post_comments(id) ON DELETE CASCADE,
  author_name TEXT,
  author_email TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved BOOLEAN NOT NULL DEFAULT FALSE
);

-- 导航菜单表
CREATE TABLE IF NOT EXISTS nav_menu (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES nav_menu(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 导航菜单翻译表
CREATE TABLE IF NOT EXISTS nav_menu_translations (
  id SERIAL PRIMARY KEY,
  menu_id INTEGER NOT NULL REFERENCES nav_menu(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  UNIQUE(menu_id, language_code)
);

-- 社交媒体表
CREATE TABLE IF NOT EXISTS social_media (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 打赏方式表
CREATE TABLE IF NOT EXISTS donation_methods (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建RLS策略
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tag_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_menu_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_methods ENABLE ROW LEVEL SECURITY;

-- 公共读取策略
CREATE POLICY "Public can read languages" ON languages FOR SELECT USING (active = TRUE);
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read category_translations" ON category_translations FOR SELECT USING (true);
CREATE POLICY "Public can read tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Public can read tag_translations" ON tag_translations FOR SELECT USING (true);
CREATE POLICY "Public can read approved tools" ON tools FOR SELECT USING (approved = TRUE);
CREATE POLICY "Public can read tool_translations" ON tool_translations FOR SELECT USING (true);
CREATE POLICY "Public can read tool_categories" ON tool_categories FOR SELECT USING (true);
CREATE POLICY "Public can read tool_tags" ON tool_tags FOR SELECT USING (true);
CREATE POLICY "Public can read published posts" ON posts FOR SELECT USING (status = 'published' AND published_at <= CURRENT_TIMESTAMP);
CREATE POLICY "Public can read post_translations" ON post_translations FOR SELECT USING (true);
CREATE POLICY "Public can read post_categories" ON post_categories FOR SELECT USING (true);
CREATE POLICY "Public can read post_tags" ON post_tags FOR SELECT USING (true);
CREATE POLICY "Public can read approved comments" ON post_comments FOR SELECT USING (approved = TRUE);
CREATE POLICY "Public can read active nav_menu" ON nav_menu FOR SELECT USING (active = TRUE);
CREATE POLICY "Public can read nav_menu_translations" ON nav_menu_translations FOR SELECT USING (true);
CREATE POLICY "Public can read active social_media" ON social_media FOR SELECT USING (active = TRUE);
CREATE POLICY "Public can read active donation_methods" ON donation_methods FOR SELECT USING (active = TRUE);

-- 管理员策略
CREATE POLICY "Admins can do anything with languages" ON languages FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE auth.users.role = 'admin')
);

CREATE POLICY "Admins can do anything with site_settings" ON site_settings FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE auth.users.role = 'admin')
);

-- 为其他表创建类似的管理员策略...

-- 用户资料策略
CREATE POLICY "Users can read their own profile" ON user_profiles FOR SELECT USING (
  auth.uid() = id
);

CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (
  auth.uid() = id
);

-- 评论策略
CREATE POLICY "Users can create comments" ON post_comments FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL OR (author_name IS NOT NULL AND author_email IS NOT NULL)
);

-- 创建触发器函数来更新时间戳
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要自动更新时间戳的表创建触发器
CREATE TRIGGER update_tools_timestamp
BEFORE UPDATE ON tools
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_posts_timestamp
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_user_profiles_timestamp
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_site_settings_timestamp
BEFORE UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
