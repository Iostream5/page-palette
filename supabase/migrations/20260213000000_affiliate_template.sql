-- Migration to add Affiliate Product Catalog template
-- 10. Affiliate Product Catalog (Shopee/TikTok style)

INSERT INTO templates (name, category, description, schema, default_data)
VALUES
(
  'Affiliate Product Catalog',
  'custom',
  'A high-conversion product catalog designed for Shopee, TikTok, and Instagram affiliate marketing.',
  '{"sections": []}',
  '{
    "brandKit": {
      "primaryColor": "#ee4d2d",
      "secondaryColor": "#f5f5f5",
      "accentColor": "#ff6600",
      "fontFamily": "Inter, sans-serif",
      "customCSS": ".custom-builder-content { background: #f5f5f5; min-height: 100vh; padding: 20px 10px; } .catalog-header { background: linear-gradient(135deg, #ee4d2d 0%, #ff6600 100%); color: white; padding: 40px 20px; border-radius: 24px; margin-bottom: 24px; text-align: center; box-shadow: 0 10px 25px -5px rgba(238, 77, 45, 0.3); }"
    },
    "pageComponents": [
      {
        "id": "aff_header",
        "type": "hero",
        "order": 0,
        "visible": true,
        "className": "catalog-header",
        "props": {
          "title": "My Favorite Finds ✨",
          "subtitle": "Spill produk viral & rekomendasi terbaik buat kamu! Cek link di bawah ini ya.",
          "alignment": "center",
          "height": "small",
          "ctaText": "Follow for more",
          "ctaUrl": "#"
        },
        "animations": ["fade-down"]
      },
      {
        "id": "aff_prod1",
        "type": "product-item",
        "order": 1,
        "visible": true,
        "props": {
          "title": "TWS Wireless Bluetooth 5.3 Low Latency",
          "productNo": "001",
          "productUrl": "https://shopee.com",
          "price": "Rp 149.000",
          "description": "Suara jernih, bass mantap, dan tahan hingga 20 jam penggunaan. Cocok untuk gaming & musik.",
          "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
          "buttonText": "Beli di Shopee",
          "badge": "Viral 🔥"
        },
        "animations": ["fade-up"]
      },
      {
        "id": "aff_prod2",
        "type": "product-item",
        "order": 2,
        "visible": true,
        "props": {
          "title": "Mechanical Keyboard RGB Hotswap",
          "productNo": "002",
          "productUrl": "https://shopee.com",
          "price": "Rp 450.000",
          "description": "Keyboard mechanical compact 60% dengan switch yang bisa diganti-ganti. Lampu RGB keren banget!",
          "image": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400",
          "buttonText": "Cek Harga",
          "badge": "Diskon 50%"
        },
        "animations": ["fade-up"]
      },
      {
        "id": "aff_prod3",
        "type": "product-item",
        "order": 3,
        "visible": true,
        "props": {
          "title": "Ergonomic Standing Desk with Memory",
          "productNo": "003",
          "productUrl": "https://shopee.com",
          "price": "Rp 2.100.000",
          "description": "Meja kerja otomatis bisa naik turun. Sangat bagus untuk kesehatan tulang punggung saat WFH.",
          "image": "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400",
          "buttonText": "Lihat Produk",
          "badge": "Rekomendasi"
        },
        "animations": ["fade-up"]
      },
      {
        "id": "aff_footer",
        "type": "text",
        "order": 4,
        "visible": true,
        "props": {
          "content": "Terima kasih sudah berkunjung! Link di atas adalah link affiliate, saya mungkin mendapat komisi kecil tanpa biaya tambahan untukmu.",
          "alignment": "center",
          "fontSize": "small"
        },
        "margin": "40px 0 20px 0"
      }
    ]
  }'
);
