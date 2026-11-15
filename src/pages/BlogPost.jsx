import { useParams } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import Closing from '@/components/Closing';
import NotFound from './NotFound';
import { usePageSeo } from '@/hooks/usePageSeo';
import { articleNode } from '@/seo/jsonld';
import { renderInline } from '@/lib/inlineLinks';
import { getPost } from '@/data/blog';
import { getPostContent } from '@/data/blogContent';

function Block({ block }) {
  if (block.h2) return <h2>{block.h2}</h2>;
  if (block.p) return <p>{renderInline(block.p)}</p>;
  const List = block.ol ? 'ol' : 'ul';
  return (
    <List>
      {(block.ol || block.ul).map((item) => (
        <li key={item.slice(0, 40)}>{renderInline(item)}</li>
      ))}
    </List>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);
  const content = getPostContent(slug);
  const path = `/blog/${slug}`;
  const crumbs = [
    { name: 'Inicio', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post?.title ?? 'Artículo', path },
  ];

  usePageSeo({
    path,
    crumbs,
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
      <article className="wrap">
        <header className="page-head" style={{ maxWidth: '24em', fontSize: 'clamp(1rem, 1vw + 0.8rem, 1.25rem)' }}>
          <Breadcrumbs crumbs={crumbs} />
          <h1 className="h2">{post.title}</h1>
        </header>
        <div className="article">
          <p className="lead">{renderInline(content.intro)}</p>
          {content.body.map((block, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Block key={i} block={block} />
          ))}
        </div>
        <div style={{ height: 'var(--section-y)' }} />
      </article>

      <Closing
        source={`blog_${slug}`}
        title="¿Quieres una página web para tu negocio?"
        text="Mira el servicio de diseño de páginas web en Cuenca o escríbenos y te respondemos con una propuesta."
        waText="Leí un artículo del blog y quiero cotizar una página web"
      />
    </main>
  );
}
