// Cuantos "em" mide la linea mas larga de un titular en Anybody 800 para
// un ancho dado (eje wdth). Usa la tabla medida por
// scripts/measure-display.mjs, asi el tamano del titular se resuelve en
// CSS sin medir en el navegador.
import metrics from './anybodyMetrics.json';

const STOPS = [50, 75, 100, 125, 150];
const TRACKING = -0.012;

function advance(char, wdth) {
  const w = Math.min(150, Math.max(50, wdth));
  let i = STOPS.findIndex((s) => s >= w);
  if (i <= 0) i = 1;
  const a = STOPS[i - 1];
  const b = STOPS[i];
  const t = (w - a) / (b - a);
  const at = (stop) => metrics[stop][char] ?? metrics[stop].n;
  return at(a) + (at(b) - at(a)) * t;
}

export function fitOf(lines, wdth) {
  let max = 0;
  for (const line of lines) {
    let sum = 0;
    for (const char of line) sum += advance(char, wdth) + TRACKING;
    if (sum > max) max = sum;
  }
  // 3% de aire: redondeos del navegador y kerning.
  return +(max * 1.03).toFixed(3);
}
