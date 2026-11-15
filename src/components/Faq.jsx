// Preguntas en <details>: el navegador maneja teclado y estado; el CSS
// anima la apertura (responde a una accion del usuario).
export default function Faq({ items }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
