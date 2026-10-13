/* Escudos de cada era: dibujos propios (sin derechos de terceros), sobrios y sin iconografía devocional. */
(function () {
  "use strict";
  const T = 'fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"';
  const F = 'fill="#fff"';
  const ICONOS = {
    // Columna romana: el mundo del Imperio
    prologo: `<g ${T}><path d="M30 34h40M33 40h34M36 40v40M44 40v40M52 40v40M60 40v40M64 40v40M32 80h36M28 87h44"/></g>`,
    // Bula con sello: el poder papal
    papado: `<g ${T}><path d="M30 32h34a6 6 0 0 1 6 6v40H36a6 6 0 0 1-6-6z"/><path d="M38 44h22M38 52h22M38 60h14"/></g><circle cx="64" cy="76" r="9" ${F}/>`,
    // Palmera y dunas: Arabia
    islam: `<g ${T}><path d="M50 82c-2-14 0-28 4-40"/><path d="M54 42c-8-6-18-6-24 0M54 42c4-8 14-12 22-8M54 42c-2-9-10-14-18-13M54 42c8-2 16 2 20 9"/><path d="M24 86c10-6 20-6 30 0s20 6 30 0"/></g>`,
    // Corona imperial: Carlomagno
    imperio: `<g ${T}><path d="M28 74l-4-30 16 14 10-20 10 20 16-14-4 30z"/><path d="M28 82h44"/></g>`,
    // Espada y escudo: las Cruzadas
    cruzadas: `<g ${T}><path d="M50 26v46M40 64h20M50 72v12"/><path d="M50 26l-4 8v30M50 26l4 8v30"/></g>`,
    // Libro abierto y pluma: copiar las Escrituras
    monacato: `<g ${T}><path d="M24 44c10-4 18-4 26 2 8-6 16-6 26-2v34c-10-4-18-4-26 2-8-6-16-6-26-2z"/><path d="M50 46v34"/><path d="M66 26c6 4 6 12 0 18l-8 8"/></g>`,
    // Vela encendida: luz antes de la Reforma
    precursores: `<g ${T}><path d="M42 50h16v34H42z"/><path d="M50 50v-6"/></g><path d="M50 26c6 8 7 13 0 18-7-5-6-10 0-18z" ${F}/>`,
    // Martillo y tesis: Wittenberg 1517
    reforma: `<g ${T}><path d="M30 30h28l8 8v44H30z"/><path d="M36 44h20M36 52h22M36 60h18"/><path d="M58 70l14-14M66 50l12 12"/></g>`,
    // Globo con meridianos: misiones y despertares
    moderna: `<g ${T}><circle cx="50" cy="56" r="24"/><path d="M26 56h48M50 32c-10 8-10 40 0 48M50 32c10 8 10 40 0 48"/></g>`,
    // Montañas andinas y libro: la Iglesia en Colombia
    colombia: `<g ${T}><path d="M22 70l16-24 10 14 10-18 20 28"/><path d="M34 82c6-3 11-3 16 0 5-3 10-3 16 0"/></g><circle cx="66" cy="32" r="6" ${F}/>`
  };
  window.escudoEra = function (era, clase) {
    const ic = ICONOS[era.id] || "";
    return `<svg class="${clase || "escudo"}" viewBox="0 0 100 120" role="img" aria-label="Escudo de la era ${era.nombre.replace(/"/g, "")}">
      <path d="M50 4 L92 18 V58 C92 88 70 106 50 116 C30 106 8 88 8 58 V18 Z" fill="${era.color}" stroke="color-mix(in srgb, ${era.color} 60%, #000)" stroke-width="3"/>
      <path d="M50 12 L84 23 V58 C84 83 66 98 50 107 C34 98 16 83 16 58 V23 Z" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2"/>
      <g transform="translate(0,2)">${ic}</g></svg>`;
  };
})();
