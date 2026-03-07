-- Migration to add professional web templates
-- 1. SaaS Landing Page (Modern Tech)
-- 2. Creative Portfolio (Minimalist Art)
-- 3. Corporate Business (Professional Trust)

INSERT INTO templates (name, category, description, schema, default_data)
VALUES
(
  'SaaS Landing Page',
  'custom',
  'A high-conversion landing page for modern tech products and startups.',
  '{"sections": []}',
  '{
    "brandKit": {
      "primaryColor": "#0f172a",
      "secondaryColor": "#334155",
      "accentColor": "#3b82f6",
      "fontFamily": "Inter, sans-serif"
    },
    "pageComponents": [
      {
        "id": "saas_hero",
        "type": "hero",
        "order": 0,
        "visible": true,
        "props": {
          "title": "Build Your Next Big Idea Faster",
          "subtitle": "The all-in-one platform for modern development teams to build, scale, and ship products.",
          "backgroundGradient": "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          "ctaText": "Get Started Free",
          "ctaUrl": "#",
          "alignment": "center",
          "height": "large"
        },
        "animations": ["fade-up"]
      },
      {
        "id": "saas_stats",
        "type": "stats",
        "order": 1,
        "visible": true,
        "props": {
          "items": [
            { "value": "100K+", "label": "Active Users", "icon": "👥" },
            { "value": "$50M+", "label": "Revenue Generated", "icon": "💰" },
            { "value": "99.9%", "label": "Uptime SLA", "icon": "⚡" }
          ],
          "layout": "row"
        },
        "animations": ["fade-up"]
      },
      {
        "id": "saas_features",
        "type": "feature-grid",
        "order": 2,
        "visible": true,
        "props": {
          "columns": 3,
          "items": [
            { "icon": "🚀", "title": "Rapid Deployment", "description": "Deploy to production in seconds with our automated CI/CD pipeline." },
            { "icon": "🛡️", "title": "Enterprise Security", "description": "Bank-grade encryption and compliance out of the box for your peace of mind." },
            { "icon": "📈", "title": "Advanced Analytics", "description": "Real-time insights into your application performance and user behavior." }
          ]
        }
      },
      {
        "id": "saas_pricing",
        "type": "pricing",
        "order": 3,
        "visible": true,
        "props": {
          "title": "Pro Plan",
          "price": "$49",
          "period": "/mo",
          "features": ["Unlimited Projects", "Priority Support", "Custom Domains", "Advanced Analytics"],
          "ctaText": "Start Free Trial",
          "ctaUrl": "#",
          "highlighted": true
        },
        "animations": ["scale-in"]
      }
    ]
  }'
),
(
  'Creative Portfolio',
  'custom',
  'A minimalist and elegant portfolio for designers, photographers, and artists.',
  '{"sections": []}',
  '{
    "brandKit": {
      "primaryColor": "#ffffff",
      "secondaryColor": "#f8fafc",
      "accentColor": "#000000",
      "fontFamily": "Playfair Display, serif"
    },
    "pageComponents": [
      {
        "id": "portfolio_hero",
        "type": "hero",
        "order": 0,
        "visible": true,
        "props": {
          "title": "John Doe",
          "subtitle": "Multidisciplinary Designer & Visual Artist based in New York City.",
          "backgroundGradient": "#ffffff",
          "ctaText": "View Work",
          "ctaUrl": "#work",
          "alignment": "left",
          "height": "medium"
        }
      },
      {
        "id": "portfolio_gallery",
        "type": "image",
        "order": 1,
        "visible": true,
        "props": {
          "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800",
          "alt": "Architectural Design",
          "caption": "Minimalist Architecture Project, 2025",
          "aspectRatio": "16:9",
          "rounded": true,
          "shadow": true
        },
        "animations": ["blur-in"]
      },
      {
        "id": "portfolio_text",
        "type": "text",
        "order": 2,
        "visible": true,
        "props": {
          "content": "I believe that good design is about more than just aesthetics—it''s about creating meaningful experiences that resonate with people on a deeper level.",
          "alignment": "center",
          "fontSize": "large"
        }
      },
      {
        "id": "portfolio_testimonial",
        "type": "testimonial",
        "order": 3,
        "visible": true,
        "props": {
          "quote": "John''s vision and attention to detail are unparalleled. He transformed our brand identity into something truly remarkable.",
          "author": "Sarah Jenkins",
          "role": "Creative Director at Studio V",
          "rating": 5
        },
        "animations": ["fade-up"]
      }
    ]
  }'
),
(
  'Corporate Business',
  'custom',
  'A professional and clean template for established businesses and consultants.',
  '{"sections": []}',
  '{
    "brandKit": {
      "primaryColor": "#1e3a8a",
      "secondaryColor": "#1e40af",
      "accentColor": "#60a5fa",
      "fontFamily": "Outfit, sans-serif"
    },
    "pageComponents": [
      {
        "id": "corp_hero",
        "type": "hero",
        "order": 0,
        "visible": true,
        "props": {
          "title": "Strategic Excellence for Your Business",
          "subtitle": "We help organizations navigate complex challenges and achieve sustainable growth through data-driven insights.",
          "backgroundGradient": "linear-gradient(rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200) center/cover",
          "ctaText": "Book a Consultation",
          "ctaUrl": "#",
          "alignment": "left",
          "height": "medium"
        }
      },
      {
        "id": "corp_services",
        "type": "icon-list",
        "order": 1,
        "visible": true,
        "props": {
          "items": [
            { "icon": "📊", "text": "Financial Advisory & Planning" },
            { "icon": "🤝", "text": "Mergers & Acquisitions" },
            { "icon": "💡", "text": "Digital Transformation Strategy" },
            { "icon": "🌍", "text": "Global Market Expansion" }
          ],
          "layout": "horizontal",
          "iconColor": "#1e3a8a"
        }
      },
      {
        "id": "corp_features",
        "type": "feature-grid",
        "order": 2,
        "visible": true,
        "props": {
          "columns": 2,
          "items": [
            { "icon": "🏆", "title": "Industry Leaders", "description": "Over 20 years of experience leading teams across multiple sectors." },
            { "icon": "📈", "title": "Proven Results", "description": "Average of 35% efficiency increase for our portfolio clients." }
          ]
        }
      },
      {
        "id": "corp_contact",
        "type": "contact-form",
        "order": 3,
        "visible": true,
        "props": {
          "title": "Let''s Talk Strategy",
          "fields": [
            { "name": "FullName", "type": "text", "required": true },
            { "name": "BusinessEmail", "type": "email", "required": true },
            { "name": "Message", "type": "textarea", "required": true }
          ],
          "submitText": "Send Inquiry"
        }
      }
    ]
  }'
);
