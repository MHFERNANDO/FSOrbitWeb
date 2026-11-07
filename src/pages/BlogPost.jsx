import { useParams } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';
import Breadcrumbs from '@/components/Breadcrumbs';
import NotFound from './NotFound';
import { usePageSeo } from '@/hooks/usePageSeo';
import { articleNode } from '@/seo/jsonld';
import { renderInline } from '@/lib/inlineLinks';
import { trackClick } from '@/lib/analytics';
import { getPost } from '@/data/blog';
import { getPostContent } from '@/data/blogContent';
import { formatDate } from '@/lib/utils';

const WA_BASE = 'https://wa.me/593983113942?text=';

function Block({ block }) {
  if (block.h2) {
    return (
      <h2 className="mt-s8 flex items-start gap-s3 font-display text-[length:var(--fs-h3)] font-extrabold leading-[var(--lh-tight)] first:mt-0">
        <span aria-hidden="true" className="mt-[0.3em] h-[0.9em] w-1 shrink-0 rounded-full bg-signal" />
        {block.h2}
      </h2>
    );
  }
  if (block.p) {
    return <p className="text-[1.0625rem] leading-[1.75] text-text-2">{renderInline(block.p)}</p>;
  }
  const Tag = block.ol ? 'ol' : 'ul';
  const items = block.ol || block.ul;
  return (
    <Tag className={`grid gap-s3 pl-s6 leading-[1.7] text-text-2 marker:text-signal ${block.ol ? 'list-decimal' : 'list-disc'}`}>
      {items.map((item) => (
        <li key={item.slice(0, 40)}>{renderInline(item)}</li>
      ))}
    </Tag>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);
  const content = getPostContent(slug);
  const path = `/blog/${slug}`;

  const crumbs = post
    ? [
        { name: 'Inicio', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path },
      ]
    : [];

  usePageSeo({
    path: post ? path : '/blog',
    crumbs,
    type: 'WebPage',
    ogType: 'article',
    datePublished: post?.datePublished,
    dateModified: post?.dateModified,
    nodes: post
      ? [articleNode({ path, headline: post.title, description: post.description, datePublished: post.datePublished, dateModified: post.dateModified })]
      : [],
  });

  if (!post || !content) return <NotFound />;

  return (
    <main id="main">
      <article>
        <header className="mx-auto max-w-[var(--maxw)] px-(--gutter) pb-[clamp(40px,5vw,72px)] pt-[clamp(72px,10vw,152px)]">
          <Breadcrumbs crumbs={crumbs} />
          <time dateTime={post.datePublished} className="font-mono text-[length:var(--fs-mono)] tracking-[var(--tr-mono)] text-text-3">
            {`${formatDate(post.datePublished)} · ${post.readingMinutes} min de lectura`}
          </time>
          <h1 className="mt-s4 max-w-[22ch] font-display text-[length:var(--fs-h1)] font-extrabold leading-[var(--lh-tight)] tracking-[var(--tr-display)]">
            {post.title}
          </h1>
          <p className="mt-s6 max-w-[60ch] text-[length:var(--fs-lead)] text-text-2">{content.intro}</p>
        </header>

        <div className="border-t border-[color:var(--line)]">
          <div className="mx-auto grid max-w-[var(--maxw)] gap-s5 px-(--gutter) py-[var(--section-y)]">
            <div className="grid max-w-[68ch] gap-s5">
              {content.body.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          </div>
        </div>
      </article>

      <section className="border-t border-[color:var(--line)]">
        <Reveal
          as="div"
          type="rise"
          className="mx-auto flex max-w-(--maxw) flex-col items-start justify-between gap-s6 px-(--gutter) py-[var(--section-y)] md:flex-row md:items-center"
        >
          <div className="grid gap-s3">
            <h2 className="max-w-[24ch] font-display text-[length:var(--fs-h3)] font-extrabold leading-[var(--lh-tight)]">
              ¿Quieres una página web para tu negocio?
            </h2>
            <p className="max-w-[54ch] text-text-2">
              {renderInline('Mira nuestro servicio de [diseño de páginas web en Cuenca](/servicios/diseno-web-cuenca) o revisa los [precios](/precios).')}
            </p>
          </div>
          <a
            href={`${WA_BASE}${encodeURIComponent('Leí un artículo del blog y quiero cotizar una página web')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('whatsapp', { source: 'blog_post', post: post.slug })}
            className="inline-flex shrink-0 items-center gap-s3 rounded-r2 bg-signal px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink"
          >
            Cotizar por WhatsApp
            <Icon name="arrow-right" />
          </a>
        </Reveal>
      </section>
    </main>
  );
}
