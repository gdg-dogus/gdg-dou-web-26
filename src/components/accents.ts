// "use client" olmayan ayrı dosya: server bileşenleri de bu listeyi okuyabilsin diye
// (client dosyasından sadece bileşen import edilebilir, düz veri gelmez).
/**
 * Sırayla dönen dört Google rengi; listelerde her öğeye farklı renk vermek için.
 * `shape` şekil dolgusu, `text` yazı rengi, `on` o rengin zemini üstündeki yazı rengi.
 */
export const accents = [
  { text: "text-g-blue", shape: "fill-g-blue", on: "text-white" },
  { text: "text-g-red", shape: "fill-g-red", on: "text-white" },
  { text: "text-g-yellow", shape: "fill-g-yellow", on: "text-neutral-900" },
  { text: "text-g-green", shape: "fill-g-green", on: "text-white" },
] as const;
