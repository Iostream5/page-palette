// Export utilities for pages - export as HTML or JSON
import { PageComponent } from '@/types/page-components';

interface ExportOptions {
  pageTitle?: string;
  includeStyles?: boolean;
  minify?: boolean;
}

// Generate HTML from page components
export function exportToHTML(
  components: PageComponent[],
  options: ExportOptions = {}
): string {
  const { pageTitle = 'Exported Page', includeStyles = true, minify = false } = options;
  
  const sortedComponents = [...components]
    .filter(c => c.visible !== false)
    .sort((a, b) => a.order - b.order);

  const bodyContent = sortedComponents
    .map(component => componentToHTML(component))
    .join('\n\n');

  const styles = includeStyles ? generateStyles() : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  ${styles ? `<style>\n${styles}\n</style>` : ''}
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <main class="page-container">
${indent(bodyContent, 4)}
  </main>
</body>
</html>`;

  return minify ? minifyHTML(html) : html;
}

// Generate JSON export of page structure
export function exportToJSON(
  components: PageComponent[],
  options: { pretty?: boolean } = {}
): string {
  const { pretty = true } = options;
  
  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    components: components.map(({ id, type, order, visible, props }) => ({
      id,
      type,
      order,
      visible,
      props,
    })),
  };

  return pretty 
    ? JSON.stringify(exportData, null, 2) 
    : JSON.stringify(exportData);
}

// Download file helper
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Convert individual component to HTML
function componentToHTML(component: PageComponent): string {
  const props = component.props as Record<string, unknown>;
  
  switch (component.type) {
    case 'hero':
      return `<section class="hero hero--${props.height || 'medium'} hero--${props.alignment || 'center'}" style="background: ${props.backgroundGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}">
  <div class="hero__content">
    <h1 class="hero__title">${escapeHtml(props.title as string)}</h1>
    ${props.subtitle ? `<p class="hero__subtitle">${escapeHtml(props.subtitle as string)}</p>` : ''}
    ${props.ctaText ? `<a href="${escapeHtml(props.ctaUrl as string || '#')}" class="btn btn--primary">${escapeHtml(props.ctaText as string)}</a>` : ''}
  </div>
</section>`;

    case 'heading':
      { const level = props.level || 'h2';
      const alignment = props.alignment || 'left';
      return `<${level} class="heading heading--${alignment}" ${props.color ? `style="color: ${props.color}"` : ''}>${escapeHtml(props.text as string)}</${level}>`; }

    case 'text':
      return `<p class="text text--${props.fontSize || 'medium'} text--${props.alignment || 'left'}">${escapeHtml(props.content as string)}</p>`;

    case 'button':
      return `<a href="${escapeHtml(props.url as string || '#')}" class="btn btn--${props.variant || 'primary'} btn--${props.size || 'medium'}${props.fullWidth ? ' btn--full' : ''}">${escapeHtml(props.text as string)}</a>`;

    case 'image':
      return `<figure class="image ${props.rounded ? 'image--rounded' : ''} ${props.shadow ? 'image--shadow' : ''}">
  <img src="${escapeHtml(props.src as string)}" alt="${escapeHtml(props.alt as string || '')}" />
  ${props.caption ? `<figcaption>${escapeHtml(props.caption as string)}</figcaption>` : ''}
</figure>`;

    case 'card':
      return `<article class="card card--${props.variant || 'default'}">
  ${props.image ? `<img src="${escapeHtml(props.image as string)}" alt="" class="card__image" />` : ''}
  <div class="card__body">
    <h3 class="card__title">${escapeHtml(props.title as string)}</h3>
    ${props.description ? `<p class="card__description">${escapeHtml(props.description as string)}</p>` : ''}
    ${props.ctaText ? `<a href="#" class="btn btn--secondary">${escapeHtml(props.ctaText as string)}</a>` : ''}
  </div>
</article>`;

    case 'spacer':
      { const spacerHeight: Record<string, string> = {
        small: '1rem',
        medium: '2rem',
        large: '4rem',
        xlarge: '6rem',
      };
      return `<div class="spacer" style="height: ${spacerHeight[props.height as string] || '2rem'}"></div>`; }

    case 'divider':
      return `<hr class="divider divider--${props.style || 'solid'} divider--${props.thickness || 'medium'}" />`;

    case 'cta':
      return `<section class="cta" style="background: ${props.backgroundColor || '#f8f9fa'}">
  <div class="cta__content">
    <h2 class="cta__title">${escapeHtml(props.title as string)}</h2>
    ${props.description ? `<p class="cta__description">${escapeHtml(props.description as string)}</p>` : ''}
    ${props.buttonText ? `<a href="${escapeHtml(props.buttonUrl as string || '#')}" class="btn btn--primary btn--large">${escapeHtml(props.buttonText as string)}</a>` : ''}
  </div>
</section>`;

    case 'feature-grid':
      { const featureItems = (props.items || []) as Array<{ title: string; description: string; icon: string }>;
      return `<section class="features features--${props.columns || 3}-cols">
  <div class="features__grid">
    ${featureItems.map(f => `<div class="feature">
      <span class="feature__icon">${f.icon}</span>
      <h3 class="feature__title">${escapeHtml(f.title)}</h3>
      <p class="feature__description">${escapeHtml(f.description)}</p>
    </div>`).join('\n    ')}
  </div>
</section>`; }

    case 'testimonial':
      return `<blockquote class="testimonial">
  <p class="testimonial__quote">"${escapeHtml(props.quote as string)}"</p>
  <footer class="testimonial__author">
    ${props.avatar ? `<img src="${escapeHtml(props.avatar as string)}" alt="" class="testimonial__avatar" />` : ''}
    <div>
      <cite class="testimonial__name">${escapeHtml(props.author as string)}</cite>
      ${props.role ? `<span class="testimonial__role">${escapeHtml(props.role as string)}</span>` : ''}
    </div>
  </footer>
</blockquote>`;

    case 'stats':
      { const stats = (props.stats || []) as Array<{ value: string; label: string }>;
      return `<section class="stats">
  <div class="stats__grid">
    ${stats.map(s => `<div class="stat">
      <span class="stat__value">${escapeHtml(s.value)}</span>
      <span class="stat__label">${escapeHtml(s.label)}</span>
    </div>`).join('\n    ')}
  </div>
</section>`; }

    case 'faq':
      { const faqs = (props.items || []) as Array<{ question: string; answer: string }>;
      return `<section class="faq">
  ${props.title ? `<h2 class="faq__title">${escapeHtml(props.title as string)}</h2>` : ''}
  <div class="faq__list">
    ${faqs.map(f => `<details class="faq__item">
      <summary class="faq__question">${escapeHtml(f.question)}</summary>
      <p class="faq__answer">${escapeHtml(f.answer)}</p>
    </details>`).join('\n    ')}
  </div>
</section>`; }

    case 'pricing':
      { const plans = (props.plans || []) as Array<{
        name: string;
        price: string;
        period: string;
        features: string[];
        highlighted?: boolean;
      }>;
      return `<section class="pricing">
  ${props.title ? `<h2 class="pricing__title">${escapeHtml(props.title as string)}</h2>` : ''}
  <div class="pricing__grid">
    ${plans.map(p => `<div class="pricing-card ${p.highlighted ? 'pricing-card--highlighted' : ''}">
      <h3 class="pricing-card__name">${escapeHtml(p.name)}</h3>
      <div class="pricing-card__price">${escapeHtml(p.price)}<span>/${escapeHtml(p.period)}</span></div>
      <ul class="pricing-card__features">
        ${p.features.map(f => `<li>${escapeHtml(f)}</li>`).join('\n        ')}
      </ul>
      <a href="#" class="btn btn--primary btn--full">Get Started</a>
    </div>`).join('\n    ')}
  </div>
</section>`; }

    case 'contact-form':
      { const fields = (props.fields || []) as Array<{ label: string; type: string; required?: boolean }>;
      return `<section class="contact-form">
  ${props.title ? `<h2 class="contact-form__title">${escapeHtml(props.title as string)}</h2>` : ''}
  <form class="form">
    ${fields.map(f => `<div class="form__field">
      <label class="form__label">${escapeHtml(f.label)}${f.required ? ' *' : ''}</label>
      ${f.type === 'textarea' 
        ? `<textarea class="form__textarea" ${f.required ? 'required' : ''}></textarea>`
        : `<input type="${f.type}" class="form__input" ${f.required ? 'required' : ''} />`}
    </div>`).join('\n    ')}
    <button type="submit" class="btn btn--primary">${escapeHtml(props.submitText as string || 'Submit')}</button>
  </form>
</section>`; }

    case 'social-links':
      { const socialLinks = (props.links || []) as Array<{ platform: string; url: string }>;
      return `<div class="social-links social-links--${props.style || 'icons'}">
  ${socialLinks.map(l => `<a href="${escapeHtml(l.url)}" class="social-link social-link--${l.platform}" target="_blank" rel="noopener">${l.platform}</a>`).join('\n  ')}
</div>`; }

    case 'video':
      return `<div class="video-wrapper" style="aspect-ratio: ${props.aspectRatio || '16/9'}">
  <iframe src="${escapeHtml(props.url as string)}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>`;

    case 'countdown':
      return `<div class="countdown countdown--${props.style || 'simple'}">
  ${props.title ? `<h3 class="countdown__title">${escapeHtml(props.title as string)}</h3>` : ''}
  <div class="countdown__timer" data-target="${escapeHtml(props.targetDate as string)}">
    <span class="countdown__days">00</span>d
    <span class="countdown__hours">00</span>h
    <span class="countdown__minutes">00</span>m
    <span class="countdown__seconds">00</span>s
  </div>
</div>`;

    case 'newsletter':
      return `<div class="newsletter newsletter--${props.style || 'inline'}">
  ${props.title ? `<h3 class="newsletter__title">${escapeHtml(props.title as string)}</h3>` : ''}
  ${props.description ? `<p class="newsletter__description">${escapeHtml(props.description as string)}</p>` : ''}
  <form class="newsletter__form">
    <input type="email" placeholder="${escapeHtml(props.placeholder as string)}" class="newsletter__input" />
    <button type="submit" class="btn btn--primary">${escapeHtml(props.buttonText as string)}</button>
  </form>
</div>`;

    case 'icon-list':
      { const iconItems = (props.items || []) as Array<{ icon: string; text: string }>;
      return `<ul class="icon-list icon-list--${props.layout || 'vertical'}">
  ${iconItems.map(item => `<li class="icon-list__item">
    <span class="icon-list__icon">${item.icon}</span>
    <span class="icon-list__text">${escapeHtml(item.text)}</span>
  </li>`).join('\n  ')}
</ul>`; }

    default: {
      // Exhaustive check - this should never happen
      const _exhaustiveCheck: never = component;
      return `<!-- Component: ${(_exhaustiveCheck as PageComponent).type || 'unknown'} -->`;
    }
  }
}

// Generate base styles
function generateStyles(): string {
  return `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: #1a1a1a;
  background: #ffffff;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Hero */
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: white;
  border-radius: 1rem;
  margin-bottom: 2rem;
}
.hero--small { min-height: 30vh; }
.hero--medium { min-height: 50vh; }
.hero--large { min-height: 70vh; }
.hero--full { min-height: 100vh; }
.hero--left .hero__content { text-align: left; }
.hero--center .hero__content { text-align: center; }
.hero--right .hero__content { text-align: right; }
.hero__title { font-size: 3rem; font-weight: 700; margin-bottom: 1rem; }
.hero__subtitle { font-size: 1.25rem; opacity: 0.9; margin-bottom: 2rem; }

/* Headings */
.heading { margin: 1.5rem 0; }
.heading--left { text-align: left; }
.heading--center { text-align: center; }
.heading--right { text-align: right; }

/* Text */
.text { margin: 1rem 0; }
.text--small { font-size: 0.875rem; }
.text--medium { font-size: 1rem; }
.text--large { font-size: 1.25rem; }
.text--left { text-align: left; }
.text--center { text-align: center; }
.text--right { text-align: right; }
.text--justify { text-align: justify; }

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}
.btn--primary { background: #6366f1; color: white; }
.btn--primary:hover { background: #4f46e5; }
.btn--secondary { background: #f1f5f9; color: #334155; }
.btn--secondary:hover { background: #e2e8f0; }
.btn--outline { background: transparent; border: 2px solid currentColor; }
.btn--small { padding: 0.5rem 1rem; font-size: 0.875rem; }
.btn--large { padding: 1rem 2rem; font-size: 1.125rem; }
.btn--full { width: 100%; text-align: center; }

/* Images */
.image { margin: 1.5rem 0; }
.image img { max-width: 100%; height: auto; display: block; }
.image--rounded img { border-radius: 1rem; }
.image--shadow img { box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
.image figcaption { text-align: center; margin-top: 0.5rem; color: #666; font-size: 0.875rem; }

/* Cards */
.card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  margin: 1rem 0;
}
.card--default { border: 1px solid #e5e7eb; }
.card--elevated { box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
.card--bordered { border: 2px solid #1a1a1a; }
.card--glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); }
.card__image { width: 100%; height: 200px; object-fit: cover; }
.card__body { padding: 1.5rem; }
.card__title { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
.card__description { color: #666; margin-bottom: 1rem; }

/* Spacer */
.spacer { display: block; }

/* Divider */
.divider {
  border: none;
  margin: 2rem 0;
}
.divider--solid { border-top: 1px solid #e5e7eb; }
.divider--dashed { border-top: 2px dashed #e5e7eb; }
.divider--dotted { border-top: 2px dotted #e5e7eb; }
.divider--thin { border-width: 1px; }
.divider--medium { border-width: 2px; }
.divider--thick { border-width: 4px; }

/* CTA */
.cta {
  padding: 4rem 2rem;
  text-align: center;
  border-radius: 1rem;
  margin: 2rem 0;
}
.cta__title { font-size: 2rem; font-weight: 700; margin-bottom: 1rem; }
.cta__description { max-width: 600px; margin: 0 auto 2rem; color: #666; }

/* Features */
.features { padding: 3rem 0; }
.features__title { text-align: center; font-size: 2rem; margin-bottom: 3rem; }
.features__grid { display: grid; gap: 2rem; }
.features--2-cols .features__grid { grid-template-columns: repeat(2, 1fr); }
.features--3-cols .features__grid { grid-template-columns: repeat(3, 1fr); }
.features--4-cols .features__grid { grid-template-columns: repeat(4, 1fr); }
.feature { text-align: center; padding: 1.5rem; }
.feature__icon { font-size: 2rem; margin-bottom: 1rem; display: block; }
.feature__title { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
.feature__description { color: #666; }

/* Testimonial */
.testimonial {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 1rem;
  margin: 1.5rem 0;
}
.testimonial__quote { font-size: 1.25rem; font-style: italic; margin-bottom: 1.5rem; }
.testimonial__author { display: flex; align-items: center; gap: 1rem; }
.testimonial__avatar { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; }
.testimonial__name { font-weight: 600; display: block; }
.testimonial__role { color: #666; font-size: 0.875rem; }

/* Stats */
.stats { padding: 3rem 0; }
.stats__grid { display: flex; justify-content: center; gap: 4rem; flex-wrap: wrap; }
.stat { text-align: center; }
.stat__value { display: block; font-size: 3rem; font-weight: 700; color: #6366f1; }
.stat__label { color: #666; }

/* FAQ */
.faq { padding: 3rem 0; }
.faq__title { text-align: center; font-size: 2rem; margin-bottom: 2rem; }
.faq__item { border-bottom: 1px solid #e5e7eb; }
.faq__question { padding: 1rem 0; font-weight: 500; cursor: pointer; }
.faq__answer { padding: 0 0 1rem; color: #666; }

/* Pricing */
.pricing { padding: 3rem 0; }
.pricing__title { text-align: center; font-size: 2rem; margin-bottom: 3rem; }
.pricing__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
.pricing-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
}
.pricing-card--highlighted {
  border-color: #6366f1;
  box-shadow: 0 10px 40px rgba(99, 102, 241, 0.15);
}
.pricing-card__name { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; }
.pricing-card__price { font-size: 2.5rem; font-weight: 700; margin-bottom: 1.5rem; }
.pricing-card__price span { font-size: 1rem; color: #666; }
.pricing-card__features { list-style: none; margin-bottom: 2rem; }
.pricing-card__features li { padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9; }

/* Contact Form */
.contact-form { padding: 3rem 0; max-width: 600px; margin: 0 auto; }
.contact-form__title { text-align: center; margin-bottom: 2rem; }
.form__field { margin-bottom: 1.5rem; }
.form__label { display: block; font-weight: 500; margin-bottom: 0.5rem; }
.form__input, .form__textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
}
.form__textarea { min-height: 120px; resize: vertical; }

/* Social Links */
.social-links { display: flex; gap: 1rem; }
.social-links--horizontal { flex-direction: row; justify-content: center; }
.social-links--vertical { flex-direction: column; align-items: center; }
.social-link {
  padding: 0.75rem 1.25rem;
  background: #f1f5f9;
  border-radius: 0.5rem;
  text-decoration: none;
  color: #334155;
  font-weight: 500;
  transition: all 0.2s;
}
.social-link:hover { background: #e2e8f0; }

/* Footer */
.footer {
  background: #1a1a1a;
  color: white;
  padding: 4rem 2rem 2rem;
  border-radius: 1rem 1rem 0 0;
  margin-top: 4rem;
}
.footer__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2rem; }
.footer__heading { font-weight: 600; margin-bottom: 1rem; }
.footer__links { list-style: none; }
.footer__links li { margin-bottom: 0.5rem; }
.footer__links a { color: rgba(255,255,255,0.7); text-decoration: none; }
.footer__links a:hover { color: white; }
.footer__copyright { text-align: center; color: rgba(255,255,255,0.5); padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); }

/* Responsive */
@media (max-width: 768px) {
  .hero__title { font-size: 2rem; }
  .features--3-cols .features__grid,
  .features--4-cols .features__grid { grid-template-columns: 1fr; }
  .stats__grid { gap: 2rem; }
}
`;
}

// Helper functions
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function indent(text: string, spaces: number): string {
  const padding = ' '.repeat(spaces);
  return text.split('\n').map(line => padding + line).join('\n');
}

function minifyHTML(html: string): string {
  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s+>/g, '>')
    .replace(/<\s+/g, '<')
    .trim();
}
