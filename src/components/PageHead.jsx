import Breadcrumbs from './Breadcrumbs';
import Display from './Display';

export default function PageHead({ crumbs, lines, lead, children, from, to }) {
  return (
    <header className="wrap page-head">
      <Breadcrumbs crumbs={crumbs} />
      <Display lines={lines} from={from} to={to} />
      {lead && <p className="lead">{lead}</p>}
      {children}
    </header>
  );
}
