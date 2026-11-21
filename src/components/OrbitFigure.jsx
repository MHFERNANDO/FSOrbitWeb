// Version fija del modelo: un cuadro del logo de codigo renderizado en
// Blender. Es lo que se ve en el primer pintado y lo que queda donde no hay
// modelo en vivo (sin WebGL, ahorro de datos). Es una imagen y no un SVG con
// texto: asi no frena el primer pintado.
export default function OrbitFigure() {
  return (
    <img
      className="figure orbit-figure"
      src="/assets/orbit-poster.webp"
      width="640"
      height="640"
      alt=""
      decoding="async"
      fetchPriority="low"
    />
  );
}
