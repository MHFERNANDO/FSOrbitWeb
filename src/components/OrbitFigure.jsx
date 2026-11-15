// Version estatica del objeto en orbita: el atomo del logo dibujado con
// texto de codigo sobre sus cuatro orbitas. Es lo que se ve en el primer
// pintado y lo que queda en dispositivos sin la escena 3D.
const CODE = [
  'const sitio = escribir({ para: "tu negocio", en: "Cuenca" }); ',
  '<main><h1>Páginas web a medida</h1><a href="wa.me">Escribir</a></main> ',
  'export default function Pagina() { return <Sitio sinPlantillas /> } ',
  'h1 { font-stretch: var(--ancho); color: #00f3fb; } @media (pointer) ',
];
// Se dibuja a 12 px y se escala a 0.62: el texto conserva un cuerpo
// legible para las herramientas aunque el dibujo sea pequeno.
const ORBIT = 'M -222 0 a 222 80 0 1 0 444 0 a 222 80 0 1 0 -444 0';

export default function OrbitFigure() {
  return (
    <svg className="figure orbit-figure" viewBox="-160 -160 320 320" aria-hidden="true" focusable="false">
      <defs>
        <path id="orbita" d={ORBIT} />
      </defs>
      <g transform="scale(0.62)">
      <g className="orbit-spin">
        {CODE.map((line, i) => (
          <g key={line} transform={`rotate(${i * 45})`}>
            <text>
              <textPath href="#orbita" textLength="1400" lengthAdjust="spacing">
                {line.repeat(2)}
              </textPath>
            </text>
          </g>
        ))}
      </g>
      </g>
      <text className="orbit-core" textAnchor="middle" y="5">
        {'{ }'}
      </text>
    </svg>
  );
}
