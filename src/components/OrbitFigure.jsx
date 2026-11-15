// Version estatica del objeto en orbita: el atomo del logo dibujado con
// texto de codigo sobre sus cuatro orbitas. Es lo que se ve en el primer
// pintado y lo que queda en dispositivos sin la escena 3D.
const CODE = [
  'const sitio = escribir({ para: "tu negocio", en: "Cuenca" }); ',
  '<main><h1>Páginas web a medida</h1><a href="wa.me">Escribir</a></main> ',
  'export default function Pagina() { return <Sitio sinPlantillas /> } ',
  'h1 { font-stretch: var(--ancho); color: #00f3fb; } @media (pointer) ',
];
const ORBIT = 'M -138 0 a 138 50 0 1 0 276 0 a 138 50 0 1 0 -276 0';

export default function OrbitFigure() {
  return (
    <svg className="figure orbit-figure" viewBox="-160 -160 320 320" aria-hidden="true" focusable="false">
      <defs>
        <path id="orbita" d={ORBIT} />
      </defs>
      <g className="orbit-spin">
        {CODE.map((line, i) => (
          <g key={line} transform={`rotate(${i * 45})`}>
            <text>
              <textPath href="#orbita" textLength="868" lengthAdjust="spacing">
                {line.repeat(2)}
              </textPath>
            </text>
          </g>
        ))}
      </g>
      <text className="orbit-core" textAnchor="middle" y="5">
        {'{ }'}
      </text>
    </svg>
  );
}
