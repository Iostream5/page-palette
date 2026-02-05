
-- Add more templates with unique visual styles

-- LINKTREE TEMPLATES
INSERT INTO public.templates (name, category, description, schema, default_data) VALUES
(
  'Neon Glow',
  'linktree',
  'Cyberpunk-inspired with neon glow effects',
  '{"sections":[{"type":"profile","fields":[{"name":"avatar","type":"image","label":"Avatar URL"},{"name":"name","type":"text","label":"Display Name"},{"name":"bio","type":"textarea","label":"Bio"}]},{"type":"links","fields":[{"name":"links","type":"array","label":"Links","itemFields":[{"name":"title","type":"text","label":"Link Title"},{"name":"url","type":"url","label":"URL"}]}]},{"type":"theme","fields":[{"name":"background","type":"color","label":"Background"},{"name":"textColor","type":"color","label":"Text Color"},{"name":"buttonColor","type":"color","label":"Button Color"},{"name":"buttonTextColor","type":"color","label":"Button Text"},{"name":"glowColor","type":"color","label":"Glow Color"}]}]}',
  '{"profile":{"avatar":"","name":"Cyber User","bio":"Welcome to my neon world"},"links":[{"title":"My Website","url":""},{"title":"Portfolio","url":""}],"theme":{"background":"#0a0a0f","textColor":"#00ff88","buttonColor":"#1a1a2e","buttonTextColor":"#00ff88","glowColor":"#00ff88"}}'
),
(
  'Glassmorphism',
  'linktree',
  'Modern frosted glass aesthetic',
  '{"sections":[{"type":"profile","fields":[{"name":"avatar","type":"image","label":"Avatar URL"},{"name":"name","type":"text","label":"Display Name"},{"name":"bio","type":"textarea","label":"Bio"}]},{"type":"links","fields":[{"name":"links","type":"array","label":"Links","itemFields":[{"name":"title","type":"text","label":"Link Title"},{"name":"url","type":"url","label":"URL"}]}]},{"type":"theme","fields":[{"name":"background","type":"text","label":"Background Gradient"},{"name":"textColor","type":"color","label":"Text Color"},{"name":"buttonColor","type":"color","label":"Button Color"},{"name":"buttonTextColor","type":"color","label":"Button Text"}]}]}',
  '{"profile":{"avatar":"","name":"Glass User","bio":"Elegant & modern"},"links":[{"title":"Connect","url":""},{"title":"Projects","url":""}],"theme":{"background":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)","textColor":"#ffffff","buttonColor":"rgba(255,255,255,0.15)","buttonTextColor":"#ffffff"}}'
),
(
  'Retro Wave',
  'linktree',
  '80s synthwave vibes with sunset gradients',
  '{"sections":[{"type":"profile","fields":[{"name":"avatar","type":"image","label":"Avatar URL"},{"name":"name","type":"text","label":"Display Name"},{"name":"bio","type":"textarea","label":"Bio"}]},{"type":"links","fields":[{"name":"links","type":"array","label":"Links","itemFields":[{"name":"title","type":"text","label":"Link Title"},{"name":"url","type":"url","label":"URL"}]}]},{"type":"theme","fields":[{"name":"background","type":"text","label":"Background"},{"name":"textColor","type":"color","label":"Text Color"},{"name":"buttonColor","type":"color","label":"Button Color"},{"name":"buttonTextColor","type":"color","label":"Button Text"}]}]}',
  '{"profile":{"avatar":"","name":"Retro Star","bio":"Living in the 80s"},"links":[{"title":"Music","url":""},{"title":"Vibes","url":""}],"theme":{"background":"linear-gradient(180deg, #2d1b69 0%, #11001c 50%, #fc6767 100%)","textColor":"#ff6b9d","buttonColor":"#ff6b9d","buttonTextColor":"#11001c"}}'
);

-- GALLERY TEMPLATES
INSERT INTO public.templates (name, category, description, schema, default_data) VALUES
(
  'Masonry Dark',
  'gallery',
  'Dark masonry layout with hover reveals',
  '{"sections":[{"type":"header","fields":[{"name":"title","type":"text","label":"Gallery Title"},{"name":"description","type":"textarea","label":"Description"}]},{"type":"photos","fields":[{"name":"photos","type":"array","label":"Photos","itemFields":[{"name":"url","type":"image","label":"Image URL"},{"name":"caption","type":"text","label":"Caption"}]}]},{"type":"theme","fields":[{"name":"background","type":"color","label":"Background"},{"name":"textColor","type":"color","label":"Text Color"},{"name":"accentColor","type":"color","label":"Accent Color"}]}]}',
  '{"header":{"title":"Dark Gallery","description":"A moody collection"},"photos":[{"url":"","caption":"Photo 1"},{"url":"","caption":"Photo 2"},{"url":"","caption":"Photo 3"}],"theme":{"background":"#0d0d0d","textColor":"#e0e0e0","accentColor":"#ff4444"}}'
),
(
  'Polaroid Stack',
  'gallery',
  'Scattered polaroid-style photos',
  '{"sections":[{"type":"header","fields":[{"name":"title","type":"text","label":"Gallery Title"},{"name":"description","type":"textarea","label":"Description"}]},{"type":"photos","fields":[{"name":"photos","type":"array","label":"Photos","itemFields":[{"name":"url","type":"image","label":"Image URL"},{"name":"caption","type":"text","label":"Caption"}]}]},{"type":"theme","fields":[{"name":"background","type":"color","label":"Background"},{"name":"textColor","type":"color","label":"Text Color"},{"name":"accentColor","type":"color","label":"Accent Color"}]}]}',
  '{"header":{"title":"Memories","description":"Captured moments"},"photos":[{"url":"","caption":"Memory 1"},{"url":"","caption":"Memory 2"},{"url":"","caption":"Memory 3"}],"theme":{"background":"#f5f0e8","textColor":"#2d2d2d","accentColor":"#d4a574"}}'
),
(
  'Film Strip',
  'gallery',
  'Horizontal scrolling film aesthetic',
  '{"sections":[{"type":"header","fields":[{"name":"title","type":"text","label":"Gallery Title"},{"name":"description","type":"textarea","label":"Description"}]},{"type":"photos","fields":[{"name":"photos","type":"array","label":"Photos","itemFields":[{"name":"url","type":"image","label":"Image URL"},{"name":"caption","type":"text","label":"Caption"}]}]},{"type":"theme","fields":[{"name":"background","type":"color","label":"Background"},{"name":"textColor","type":"color","label":"Text Color"},{"name":"accentColor","type":"color","label":"Accent Color"}]}]}',
  '{"header":{"title":"Film Roll","description":"35mm memories"},"photos":[{"url":"","caption":"Frame 1"},{"url":"","caption":"Frame 2"},{"url":"","caption":"Frame 3"}],"theme":{"background":"#1a1a1a","textColor":"#f0f0f0","accentColor":"#ffd700"}}'
);

-- LETTER TEMPLATES  
INSERT INTO public.templates (name, category, description, schema, default_data) VALUES
(
  'Typewriter',
  'letter',
  'Vintage typewriter aesthetic',
  '{"sections":[{"type":"letter","fields":[{"name":"title","type":"text","label":"Title"},{"name":"date","type":"text","label":"Date"},{"name":"greeting","type":"text","label":"Greeting"},{"name":"body","type":"richtext","label":"Letter Body"},{"name":"closing","type":"text","label":"Closing"},{"name":"signature","type":"text","label":"Signature"}]},{"type":"theme","fields":[{"name":"background","type":"color","label":"Paper Color"},{"name":"textColor","type":"color","label":"Ink Color"},{"name":"accentColor","type":"color","label":"Accent"},{"name":"fontFamily","type":"text","label":"Font Style"}]}]}',
  '{"letter":{"title":"A Letter","date":"","greeting":"Dear Reader,","body":"Your story begins here...","closing":"Yours truly,","signature":"The Author"},"theme":{"background":"#f4f1ea","textColor":"#2c2c2c","accentColor":"#8b4513","fontFamily":"typewriter"}}'
),
(
  'Love Letter',
  'letter',
  'Romantic cursive with soft aesthetics',
  '{"sections":[{"type":"letter","fields":[{"name":"title","type":"text","label":"Title"},{"name":"date","type":"text","label":"Date"},{"name":"greeting","type":"text","label":"Greeting"},{"name":"body","type":"richtext","label":"Letter Body"},{"name":"closing","type":"text","label":"Closing"},{"name":"signature","type":"text","label":"Signature"}]},{"type":"theme","fields":[{"name":"background","type":"color","label":"Paper Color"},{"name":"textColor","type":"color","label":"Ink Color"},{"name":"accentColor","type":"color","label":"Accent"},{"name":"fontFamily","type":"text","label":"Font Style"}]}]}',
  '{"letter":{"title":"My Dearest","date":"","greeting":"My Love,","body":"Words cannot express...","closing":"Forever yours,","signature":"♥"},"theme":{"background":"#fff5f5","textColor":"#8b5a5a","accentColor":"#e89b9b","fontFamily":"cursive"}}'
),
(
  'Official Document',
  'letter',
  'Professional formal document style',
  '{"sections":[{"type":"document","fields":[{"name":"title","type":"text","label":"Document Title"},{"name":"subtitle","type":"text","label":"Subtitle"},{"name":"content","type":"richtext","label":"Content"},{"name":"author","type":"text","label":"Author"}]},{"type":"theme","fields":[{"name":"background","type":"color","label":"Background"},{"name":"textColor","type":"color","label":"Text Color"},{"name":"accentColor","type":"color","label":"Accent"},{"name":"fontFamily","type":"text","label":"Font Style"}]}]}',
  '{"document":{"title":"Official Document","subtitle":"Confidential","content":"This document contains...","author":"Administrator"},"theme":{"background":"#ffffff","textColor":"#1a1a1a","accentColor":"#003366","fontFamily":"sans"}}'
);
