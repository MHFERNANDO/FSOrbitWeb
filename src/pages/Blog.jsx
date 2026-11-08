import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import SplitHeading from '@/components/SplitHeading';
import Icon from '@/components/Icon';
import Breadcrumbs from '@/components/Breadcrumbs';
import { usePageSeo } from '@/hooks/usePageSeo';
import { blogPosts } from '@/data/blog';

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
          <ul className="grid">
            {blogPosts.map((post, i) => (
              <Reveal as="li" type="rise" index={i} key={post.slug} className="border-b border-[color:var(--line)] first:border-t">
                <Link
                  to={`/blog/${post.slug}`}
                  viewTransition
                  className="group -mx-s4 grid gap-x-s7 gap-y-s3 px-s4 py-s8 transition-colors duration-(--d3) hover:bg-ink-850 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] md:items-baseline"
                >
                  <h2 className="font-display text-[length:var(--fs-h3)] font-extrabold leading-[var(--lh-tight)] transition-colors group-hover:text-signal">
                    {post.title}
                  </h2>
                  <p className="max-w-[46ch] text-text-2">{post.description}</p>
                  <Icon name="arrow-right" className="hidden text-text-3 transition-transform group-hover:translate-x-1 group-hover:text-signal md:block" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
