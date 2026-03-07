-- Migration to add visual-focused templates
-- 7. Photo Gallery Pro
-- 8. Digital Scrapbook
-- 9. Moodboard Designer

INSERT INTO templates (name, category, description, schema, default_data)
VALUES
(
  'Photo Gallery Pro',
  'custom',
  'A high-end gallery template with masonry-style grid and fluid animations.',
  '{"sections": []}',
  '{
    "brandKit": {
      "primaryColor": "#000000",
      "secondaryColor": "#111111",
      "accentColor": "#ffffff",
      "fontFamily": "Outfit, sans-serif"
    },
    "pageComponents": [
      {
        "id": "gallery_heading",
        "type": "heading",
        "order": 0,
        "visible": true,
        "props": {
          "text": "Selected Works 2026",
          "level": "h1",
          "alignment": "center"
        },
        "animations": ["fade-up"]
      },
      {
        "id": "gallery_img1",
        "type": "image",
        "order": 1,
        "visible": true,
        "props": {
          "src": "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
          "alt": "Landscape",
          "caption": "The Silent Valley",
          "aspectRatio": "16:9",
          "rounded": true,
          "shadow": true
        },
        "animations": ["hover-scale"]
      },
      {
        "id": "gallery_img2",
        "type": "image",
        "order": 2,
        "visible": true,
        "props": {
          "src": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
          "alt": "Forest",
          "caption": "Morning Mist",
          "aspectRatio": "4:3",
          "rounded": true,
          "shadow": true
        },
        "animations": ["hover-scale"]
      },
      {
        "id": "gallery_img3",
        "type": "image",
        "order": 3,
        "visible": true,
        "props": {
          "src": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
          "alt": "Lake",
          "caption": "Blue Serenity",
          "aspectRatio": "1:1",
          "rounded": true,
          "shadow": true
        },
        "animations": ["hover-scale"]
      }
    ]
  }'
),
(
  'Digital Scrapbook',
  'custom',
  'A nostalgic and creative layout with rotated elements, textures, and handwritten fonts.',
  '{"sections": []}',
  '{
    "brandKit": {
      "primaryColor": "#fef3c7",
      "secondaryColor": "#fde68a",
      "accentColor": "#b45309",
      "fontFamily": "Caveat, cursive",
      "customCSS": ".custom-builder-content { background-image: url(https://www.transparenttextures.com/patterns/paper-fibers.png); background-color: #fef3c7; min-height: 100vh; padding: 40px; } .scrap-img { transform: rotate(-2deg); transition: transform 0.3s ease; } .scrap-img:hover { transform: rotate(1deg) scale(1.02); }"
    },
    "pageComponents": [
      {
        "id": "scrap_title",
        "type": "heading",
        "order": 0,
        "visible": true,
        "props": {
          "text": "Summer Memories ''25",
          "level": "h1",
          "alignment": "center"
        }
      },
      {
        "id": "scrap_img1",
        "type": "image",
        "order": 1,
        "visible": true,
        "className": "scrap-img",
        "props": {
          "src": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
          "alt": "Beach",
          "caption": "Day at the shore",
          "aspectRatio": "1:1",
          "rounded": false,
          "shadow": true,
          "margin": "20px"
        }
      },
      {
        "id": "scrap_text",
        "type": "text",
        "order": 2,
        "visible": true,
        "props": {
          "content": "The sand was warm, and the water was perfect. We spent the whole day just listening to the waves and eating ice cream. Can''t wait to go back!",
          "alignment": "center",
          "fontSize": "large"
        }
      },
      {
        "id": "scrap_img2",
        "type": "image",
        "order": 3,
        "visible": true,
        "className": "scrap-img",
        "props": {
          "src": "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600",
          "alt": "Sunset",
          "caption": "Golden hour magic",
          "aspectRatio": "4:3",
          "rounded": false,
          "shadow": true,
          "margin": "20px"
        }
      }
    ]
  }'
),
(
  'Moodboard Designer',
  'custom',
  'A dynamic collage layout for brand concepts, interior design, or inspiration boards.',
  '{"sections": []}',
  '{
    "brandKit": {
      "primaryColor": "#f1f5f9",
      "secondaryColor": "#e2e8f0",
      "accentColor": "#6366f1",
      "fontFamily": "Space Grotesk, sans-serif",
      "customCSS": ".custom-builder-content { background: #f1f5f9; columns: 2; column-gap: 20px; padding: 40px; } .custom-builder-content > * { break-inside: avoid; margin-bottom: 20px; }"
    },
    "pageComponents": [
      {
        "id": "mood_heading",
        "type": "heading",
        "order": 0,
        "visible": true,
        "props": {
          "text": "Cyber-Zen Concept",
          "level": "h2",
          "alignment": "left"
        }
      },
      {
        "id": "mood_img1",
        "type": "image",
        "order": 1,
        "visible": true,
        "props": {
          "src": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600",
          "alt": "Tech",
          "aspectRatio": "auto",
          "rounded": true,
          "shadow": true
        },
        "animations": ["float"]
      },
      {
        "id": "mood_img2",
        "type": "image",
        "order": 2,
        "visible": true,
        "props": {
          "src": "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=600",
          "alt": "Minimal",
          "aspectRatio": "auto",
          "rounded": true,
          "shadow": true
        },
        "animations": ["pulse"]
      },
      {
        "id": "mood_img3",
        "type": "image",
        "order": 3,
        "visible": true,
        "props": {
          "src": "https://images.unsplash.com/photo-1516339901600-2e1a62986307?w=600",
          "alt": "Space",
          "aspectRatio": "auto",
          "rounded": true,
          "shadow": true
        }
      },
      {
        "id": "mood_stats",
        "type": "stats",
        "order": 4,
        "visible": true,
        "props": {
          "items": [
            { "value": "NEON", "label": "Primary" },
            { "value": "SLATE", "label": "Base" }
          ],
          "layout": "grid"
        }
      }
    ]
  }'
);
