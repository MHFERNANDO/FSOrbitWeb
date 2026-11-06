import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import SplitHeading from '@/components/SplitHeading';
import Icon from '@/components/Icon';
import Breadcrumbs from '@/components/Breadcrumbs';
import { usePageSeo } from '@/hooks/usePageSeo';
import { blogPosts } from '@/data/blog';
import { formatDate } from '@/lib/utils';

const CRUMBS = [
  { name: 'Inicio', path: '/' },
  { name: 'Blog', path: '/blog' },
];

export default function Blog() {
  usePageSeo({
    path: '/blog',
    crumbs: CRUMBS,
    type: 'CollectionPage',
    dateModified: blogPosts.map((p) => p.dateModified).sort().at(-1),
  });

  return (
    <main id="main">
      <header className="mx-auto max-w-(--maxw) px-(--gutter) pb-[clamp(56px,7vw,96px)] pt-[clamp(72px,10vw,152px)]">
        <Breadcrumbs crumbs={CRUMBS} />
        <Reveal as="span" type="fade" className="mb-s5 inline-block font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3">
          Blog
        </Reveal>
        <SplitHeading
          as="h1"
          className="max-w-[18ch] font-display text-[length:var(--fs-h1)] font-extrabold leading-[var(--lh-tight)] tracking-[var(--tr-display)]"
          segments={[{ text: 'Guías para tu' }, { break: true }, { text: 'negocio en internet.', highlight: true }]}
        />
        <Reveal as="p" type="rise" className="mt-s5 max-w-[56ch] text-[length:var(--fs-lead)] text-text-2">
          Artículos prácticos sobre páginas web, precios, redes sociales y Google Maps para negocios de Cuenca y de todo Ecuador.
        </Reveal>
      </header>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-(--maxw) px-(--gutter) py-[var(--section-y)]">
          <ul className="grid gap-s5 md:grid-cols-3">
            {blogPosts.map((post, i) => (
              <Reveal as="li" type="rise" index={i} key={post.slug} className="grid">
                <article className="group grid content-start gap-s4 rounded-r3 border border-[color:var(--line)] p-s6 transition-colors hover:border-[color:var(--line-2)]">
                  <time dateTime={post.datePublished} className="font-mono text-[length:var(--fs-small)] text-text-3">
                    {`${formatDate(post.datePublished)} · ${post.readingMinutes} min de lectura`}
                  </time>
                  <h2 className="font-display text-[length:var(--fs-h4)] font-extrabold leading-[var(--lh-tight)]">
                    <Link to={`/blog/${post.slug}`} viewTransition className="transition-colors hover:text-signal">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-text-2">{post.description}</p>
                  <Link
                    to={`/blog/${post.slug}`}
                    viewTransition
                    className="inline-flex items-center gap-s2 text-[length:var(--fs-small)] text-text-2 transition-colors hover:text-text"
                  >
                    Leer artículo
                    <Icon name="arrow-right" className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
