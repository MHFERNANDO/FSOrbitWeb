import { Link } from 'react-router-dom';
import PageHead from '@/components/PageHead';
import Closing from '@/components/Closing';
import { usePageSeo } from '@/hooks/usePageSeo';
import { blogPosts } from '@/data/blog';

const CRUMBS = [
  { name: 'Inicio', path: '/' },
  { name: 'Blog', path: '/blog' },
];

export default function Blog() {
  usePageSeo({ path: '/blog', crumbs: CRUMBS, type: 'Blog' });

  return (
    <main id="main">
      <PageHead
        crumbs={CRUMBS}
        lines={['Guías para negocios', 'de Cuenca y Ecuador']}
        lead="Artículos cortos sobre páginas web, precios, Instagram y Google Maps, escritos para dueños de negocio y no para programadores."
      />

      <section className="wrap section--tight" aria-label="Artículos">
        {blogPosts.length === 0 ? (
          <div className="state">
            <h2 className="h3">Todavía no hay artículos</h2>
            <p>
              Estamos escribiendo los primeros. Si tienes una duda sobre tu página web,{' '}
              <Link className="link" to="/contacto">
                escríbenos
              </Link>{' '}
              y te respondemos directo.
            </p>
          </div>
        ) : (
          <div className="rows">
            {blogPosts.map((post) => (
              <Link className="row row--2" to={`/blog/${post.slug}`} key={post.slug}>
                <h2 className="h3 row-title">{post.title}</h2>
                <p>{post.description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Closing source="blog" title="¿Tienes una duda que no está aquí?" text="Escríbenos por WhatsApp y te respondemos nosotros, sin compromiso." />
    </main>
  );
}
