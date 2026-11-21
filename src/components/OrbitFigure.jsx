// Version fija del modelo: el logo renderizado en Blender. Se ve solo donde
// no hay modelo en vivo (sin WebGL, ahorro de datos). Es un fondo CSS y no
// un <img>: con el modelo activo el bloque no se muestra y la imagen ni se
// descarga, asi no compite con el titular y las fuentes al cargar.
export default function OrbitFigure() {
  return <div className="figure orbit-figure" role="presentation" />;
}
