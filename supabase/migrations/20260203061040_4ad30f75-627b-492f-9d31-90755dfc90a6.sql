-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Insert default templates

-- Linktree Templates
INSERT INTO public.templates (name, category, description, thumbnail_url, schema, default_data) VALUES
(
  'Minimal Links',
  'linktree',
  'A clean, minimal link page',
  null,
  '{
    "sections": [
      {
        "type": "profile",
        "fields": [
          {"name": "avatar", "type": "image", "label": "Profile Image"},
          {"name": "name", "type": "text", "label": "Display Name"},
          {"name": "bio", "type": "textarea", "label": "Bio"}
        ]
      },
      {
        "type": "links",
        "fields": [
          {"name": "links", "type": "array", "label": "Links", "itemFields": [
            {"name": "title", "type": "text", "label": "Title"},
            {"name": "url", "type": "url", "label": "URL"}
          ]}
        ]
      }
    ]
  }',
  '{
    "profile": {
      "avatar": "",
      "name": "Your Name",
      "bio": "Digital creator & explorer"
    },
    "links": [
      {"title": "My Website", "url": "https://example.com"},
      {"title": "Twitter", "url": "https://twitter.com"},
      {"title": "Instagram", "url": "https://instagram.com"}
    ],
    "theme": {
      "background": "#ffffff",
      "textColor": "#1a1a1a",
      "buttonColor": "#1a1a1a",
      "buttonTextColor": "#ffffff"
    }
  }'
),
(
  'Gradient Links',
  'linktree',
  'A vibrant gradient link page',
  null,
  '{
    "sections": [
      {
        "type": "profile",
        "fields": [
          {"name": "avatar", "type": "image", "label": "Profile Image"},
          {"name": "name", "type": "text", "label": "Display Name"},
          {"name": "bio", "type": "textarea", "label": "Bio"}
        ]
      },
      {
        "type": "links",
        "fields": [
          {"name": "links", "type": "array", "label": "Links", "itemFields": [
            {"name": "title", "type": "text", "label": "Title"},
            {"name": "url", "type": "url", "label": "URL"}
          ]}
        ]
      }
    ]
  }',
  '{
    "profile": {
      "avatar": "",
      "name": "Your Name",
      "bio": "Creative soul ✨"
    },
    "links": [
      {"title": "Portfolio", "url": "https://example.com"},
      {"title": "YouTube", "url": "https://youtube.com"},
      {"title": "Shop", "url": "https://shop.example.com"}
    ],
    "theme": {
      "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "textColor": "#ffffff",
      "buttonColor": "rgba(255,255,255,0.2)",
      "buttonTextColor": "#ffffff"
    }
  }'
),

-- Gallery Templates
(
  'Grid Gallery',
  'gallery',
  'A clean photo grid layout',
  null,
  '{
    "sections": [
      {
        "type": "header",
        "fields": [
          {"name": "title", "type": "text", "label": "Gallery Title"},
          {"name": "description", "type": "textarea", "label": "Description"}
        ]
      },
      {
        "type": "photos",
        "fields": [
          {"name": "photos", "type": "array", "label": "Photos", "itemFields": [
            {"name": "url", "type": "image", "label": "Image URL"},
            {"name": "caption", "type": "text", "label": "Caption"}
          ]}
        ]
      }
    ]
  }',
  '{
    "header": {
      "title": "My Photo Gallery",
      "description": "A collection of my favorite moments"
    },
    "photos": [
      {"url": "", "caption": "Photo 1"},
      {"url": "", "caption": "Photo 2"},
      {"url": "", "caption": "Photo 3"}
    ],
    "theme": {
      "background": "#f8f9fa",
      "textColor": "#1a1a1a",
      "accentColor": "#3b82f6"
    }
  }'
),
(
  'Masonry Gallery',
  'gallery',
  'Pinterest-style masonry layout',
  null,
  '{
    "sections": [
      {
        "type": "header",
        "fields": [
          {"name": "title", "type": "text", "label": "Gallery Title"},
          {"name": "description", "type": "textarea", "label": "Description"}
        ]
      },
      {
        "type": "photos",
        "fields": [
          {"name": "photos", "type": "array", "label": "Photos", "itemFields": [
            {"name": "url", "type": "image", "label": "Image URL"},
            {"name": "caption", "type": "text", "label": "Caption"}
          ]}
        ]
      }
    ]
  }',
  '{
    "header": {
      "title": "Portfolio",
      "description": "My creative work"
    },
    "photos": [
      {"url": "", "caption": "Work 1"},
      {"url": "", "caption": "Work 2"},
      {"url": "", "caption": "Work 3"}
    ],
    "theme": {
      "background": "#1a1a1a",
      "textColor": "#ffffff",
      "accentColor": "#f59e0b"
    }
  }'
),

-- Letter Templates
(
  'Classic Letter',
  'letter',
  'A traditional letter format',
  null,
  '{
    "sections": [
      {
        "type": "letter",
        "fields": [
          {"name": "title", "type": "text", "label": "Title"},
          {"name": "date", "type": "text", "label": "Date"},
          {"name": "greeting", "type": "text", "label": "Greeting"},
          {"name": "body", "type": "richtext", "label": "Letter Body"},
          {"name": "closing", "type": "text", "label": "Closing"},
          {"name": "signature", "type": "text", "label": "Signature"}
        ]
      }
    ]
  }',
  '{
    "letter": {
      "title": "A Letter to You",
      "date": "February 2026",
      "greeting": "Dear Reader,",
      "body": "This is where your message goes. Share your thoughts, tell your story, or express what matters most to you.\n\nYou can write multiple paragraphs to make your letter more personal and meaningful.",
      "closing": "With warm regards,",
      "signature": "Your Name"
    },
    "theme": {
      "background": "#faf7f2",
      "textColor": "#2d2d2d",
      "accentColor": "#8b7355",
      "fontFamily": "serif"
    }
  }'
),
(
  'Modern Document',
  'letter',
  'A clean, modern document style',
  null,
  '{
    "sections": [
      {
        "type": "document",
        "fields": [
          {"name": "title", "type": "text", "label": "Document Title"},
          {"name": "subtitle", "type": "text", "label": "Subtitle"},
          {"name": "content", "type": "richtext", "label": "Content"},
          {"name": "author", "type": "text", "label": "Author"}
        ]
      }
    ]
  }',
  '{
    "document": {
      "title": "My Document",
      "subtitle": "A brief description",
      "content": "Start writing your content here. This template is perfect for announcements, articles, or any written content you want to share.\n\nUse paragraphs to organize your thoughts clearly.",
      "author": "Your Name"
    },
    "theme": {
      "background": "#ffffff",
      "textColor": "#1a1a1a",
      "accentColor": "#2563eb",
      "fontFamily": "sans-serif"
    }
  }'
);