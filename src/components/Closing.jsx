import WaButton from './WaButton';

export default function Closing({ title = 'Cuéntanos qué necesita tu negocio', text, waText, source, children }) {
  return (
    <section className="rule">
      <div className="wrap section closing">
        <h2 className="h2">{title}</h2>
        <p>
          {text ||
            'Escríbenos por WhatsApp. Te respondemos con una propuesta: precio, plazo estimado y forma de pago, antes de empezar.'}
        </p>
        <div className="actions" data-dock-hide>
          <WaButton text={waText} source={source} />
          {children}
        </div>
      </div>
    </section>
  );
}
