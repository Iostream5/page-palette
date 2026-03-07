-- Migration to add more professional web templates
-- 4. Personal Branding / Resume
-- 5. Mobile App Showcase
-- 6. Event Landing Page

INSERT INTO templates (name, category, description, schema, default_data)
VALUES
(
  'Personal Branding / CV',
  'custom',
  'A modern and professional resume template to showcase your skills and experience.',
  '{"sections": []}',
  '{
    "brandKit": {
      "primaryColor": "#18181b",
      "secondaryColor": "#27272a",
      "accentColor": "#f43f5e",
      "fontFamily": "Inter, sans-serif"
    },
    "pageComponents": [
      {
        "id": "cv_hero",
        "type": "hero",
        "order": 0,
        "visible": true,
        "props": {
          "title": "Hi, I''m Alex Rivera",
          "subtitle": "Product Designer specializing in accessible and user-centered digital experiences.",
          "backgroundGradient": "#18181b",
          "ctaText": "Download Resume",
          "ctaUrl": "#",
          "alignment": "left",
          "height": "medium"
        },
        "animations": ["fade-up"]
      },
      {
        "id": "cv_skills",
        "type": "icon-list",
        "order": 1,
        "visible": true,
        "props": {
          "items": [
            { "icon": "🎨", "text": "UI/UX Design" },
            { "icon": "⚛️", "text": "React Development" },
            { "icon": "📱", "text": "Mobile App Design" },
            { "icon": "🔍", "text": "User Research" }
          ],
          "layout": "horizontal",
          "iconColor": "#f43f5e"
        }
      },
      {
        "id": "cv_experience",
        "type": "heading",
        "order": 2,
        "visible": true,
        "props": {
          "text": "Work Experience",
          "level": "h2",
          "alignment": "left"
        }
      },
      {
        "id": "cv_job1",
        "type": "card",
        "order": 3,
        "visible": true,
        "props": {
          "title": "Senior Designer at TechFlow",
          "description": "Led the design system team and improved user engagement by 25% over 2 years.",
          "ctaText": "View Case Study",
          "ctaUrl": "#",
          "variant": "elevated"
        }
      }
    ]
  }'
),
(
  'Mobile App Showcase',
  'custom',
  'A vibrant landing page to highlight your mobile app features and download links.',
  '{"sections": []}',
  '{
    "brandKit": {
      "primaryColor": "#6366f1",
      "secondaryColor": "#4f46e5",
      "accentColor": "#10b981",
      "fontFamily": "Outfit, sans-serif"
    },
    "pageComponents": [
      {
        "id": "app_hero",
        "type": "hero",
        "order": 0,
        "visible": true,
        "props": {
          "title": "Track Your Habits, Change Your Life",
          "subtitle": "Join 1M+ users worldwide improving their productivity daily.",
          "backgroundGradient": "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          "ctaText": "Download for iOS",
          "ctaUrl": "#",
          "alignment": "center",
          "height": "large"
        },
        "animations": ["scale-in"]
      },
      {
        "id": "app_preview",
        "type": "image",
        "order": 1,
        "visible": true,
        "props": {
          "src": "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800",
          "alt": "App Screenshot",
          "caption": "Intuitive interface for daily tracking",
          "aspectRatio": "auto",
          "rounded": true,
          "shadow": true
        },
        "animations": ["float"]
      },
      {
        "id": "app_features",
        "type": "feature-grid",
        "order": 2,
        "visible": true,
        "props": {
          "columns": 3,
          "items": [
            { "icon": "🔔", "title": "Smart Reminders", "description": "AI-powered notifications based on your schedule." },
            { "icon": "📊", "title": "In-depth Charts", "description": "Visualize your progress with beautiful analytics." },
            { "icon": "☁️", "title": "Cloud Sync", "description": "Your data is always safe and accessible anywhere." }
          ]
        }
      }
    ]
  }'
),
(
  'Event Landing Page',
  'custom',
  'Perfect for conferences, workshops, or webinars with a countdown and registration.',
  '{"sections": []}',
  '{
    "brandKit": {
      "primaryColor": "#000000",
      "secondaryColor": "#18181b",
      "accentColor": "#f59e0b",
      "fontFamily": "Space Grotesk, sans-serif"
    },
    "pageComponents": [
      {
        "id": "event_hero",
        "type": "hero",
        "order": 0,
        "visible": true,
        "props": {
          "title": "Future Tech Conference 2026",
          "subtitle": "The premier event for AI and Blockchain pioneers.",
          "backgroundGradient": "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1505373633519-21b8b603a749?w=1200) center/cover",
          "ctaText": "Get Your Ticket",
          "ctaUrl": "#",
          "alignment": "center",
          "height": "full"
        }
      },
      {
        "id": "event_countdown",
        "type": "countdown",
        "order": 1,
        "visible": true,
        "props": {
          "targetDate": "2026-11-15T09:00:00.000Z",
          "title": "Countdown to Keynote",
          "style": "flip"
        },
        "animations": ["fade-up"]
      },
      {
        "id": "event_speakers",
        "type": "heading",
        "order": 2,
        "visible": true,
        "props": {
          "text": "Featured Speakers",
          "level": "h2",
          "alignment": "center"
        }
      },
      {
        "id": "event_speaker1",
        "type": "testimonial",
        "order": 3,
        "visible": true,
        "props": {
          "quote": "The future of decentralization is already here. Let''s explore how it scales.",
          "author": "Dr. Elena Vance",
          "role": "Chief Scientist at Web3 Labs",
          "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
        }
      }
    ]
  }'
);
