import { useSeo } from './useSeo';
import { pageGraph } from '@/seo/jsonld';
import { routeMeta } from '@/seo/routes';

// Atajo para todas las paginas: toma title/description de la fuente
// unica (src/seo/routes.js) y arma el @graph de la ruta. `crumbs` es el
// mismo arreglo que se pasa al componente <Breadcrumbs>.
export function usePageSeo({ path, crumbs, nodes, type, image, datePublished, dateModified, name, ogType }) {
  const meta = routeMeta(path);
  const title = meta?.title ?? 'FS Orbit';
  const description = meta?.description ?? '';
  useSeo({
    title,
    description,
    path,
    ogType,
    jsonLd: pageGraph({ path, name: name || title, description, type, crumbs, image, datePublished, dateModified, nodes }),
  });
  return { title, description };
}
