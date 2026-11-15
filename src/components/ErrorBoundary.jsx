import { Component } from 'react';
import { contact } from '@/data/content';

// Si una pagina falla al cargar o al dibujarse (por ejemplo, se corta la
// conexion al pedir su codigo), se explica que paso y como seguir.
export default class ErrorBoundary extends Component {
  state = { error: null, pathname: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.pathname !== props.pathname) return { error: null, pathname: props.pathname };
    return null;
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main id="main" className="wrap state">
        <h1 className="h2">Esta página no terminó de cargar</h1>
        <p>
          Suele pasar cuando se corta la conexión a mitad de camino. Recarga la página; si sigue igual, escríbenos a{' '}
          <a className="link" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          .
        </p>
        <div className="actions">
          <button type="button" className="btn" onClick={() => window.location.reload()}>
            Recargar la página
          </button>
          <a className="link" href="/">
            Ir al inicio
          </a>
        </div>
      </main>
    );
  }
}
