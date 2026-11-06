import { useParams } from 'react-router-dom';
import ServicePage from './ServicePage';
import NotFound from './NotFound';
import { getServicePage } from '@/data/servicePages';
import { getServiceContent } from '@/data/serviceContent';

// Una sola ruta /servicios/:slug para las 5 landings. Si el slug no
// existe se muestra el 404 (en produccion Vercel responde 404 real
// porque no hay archivo prerenderizado para esa ruta).
export default function Servicio() {
  const { slug } = useParams();
  const meta = getServicePage(slug);
  const content = getServiceContent(slug);
  if (!meta || !content) return <NotFound />;
  return <ServicePage service={{ ...meta, ...content }} />;
}
