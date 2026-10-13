/* Escenas animadas propias (SVG dibujado para este sitio) para el recorrido de apertura. */
(function () {
  "use strict";
  const caballo = (x, d) => `<g class="es-jinete" style="--d:${d}s;transform:translateX(${x}px)">
      <g class="es-galope">
        <path d="M0 0 C20 -18 70 -22 100 -10 L118 -34 L132 -30 L124 -6 C126 6 116 14 104 12 L96 40 M18 6 L6 42 M30 8 L34 42 M84 12 L80 42" fill="none" stroke="#0d0a07" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
        <ellipse cx="55" cy="0" rx="50" ry="16" fill="#0d0a07"/>
        <path d="M118 -34 L140 -28 L134 -20 Z" fill="#0d0a07"/>
        <path d="M44 -16 L48 -52 L62 -52 L64 -16 Z" fill="#0d0a07"/><circle cx="55" cy="-62" r="10" fill="#0d0a07"/>
        <path d="M58 -40 L190 -86" stroke="#0d0a07" stroke-width="5" stroke-linecap="round"/>
        <path d="M34 -46 h-14 v22 c0 8 7 12 7 12 s7-4 7-12 z" fill="#0d0a07"/>
      </g></g>`;
  window.ESCENAS_SVG = {
    // Tres cruces en el monte, tormenta y relámpagos
    cruz: `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" class="es es-cruz">
      <defs><radialGradient id="es-cielo" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#3a2a1c"/><stop offset="1" stop-color="#07050a"/></radialGradient></defs>
      <rect width="1600" height="900" fill="url(#es-cielo)"/>
      <rect class="es-destello" width="1600" height="900" fill="#e8ecff"/>
      <polyline class="es-rayo" points="1180,0 1130,170 1190,180 1110,380 1160,390 1070,600" fill="none" stroke="#f4f6ff" stroke-width="6" stroke-linejoin="round"/>
      <polyline class="es-rayo-cruz" points="900,-20 860,90 905,100 840,210 870,215 812,302" fill="none" stroke="#f4f6ff" stroke-width="8" stroke-linejoin="round"/>
      <polyline class="es-rayo r2" points="360,0 400,140 350,150 420,320" fill="none" stroke="#f4f6ff" stroke-width="4" stroke-linejoin="round"/>
      <path d="M0 900 L0 760 C300 700 520 640 800 600 C1080 640 1300 700 1600 760 L1600 900 Z" fill="#050403"/>
      <g fill="#050403"><rect x="788" y="300" width="24" height="310"/><rect x="720" y="370" width="160" height="22"/></g><g class="es-cruz-brillo" fill="none" stroke="#fff3c9" stroke-width="3"><rect x="788" y="300" width="24" height="310"/><rect x="720" y="370" width="160" height="22"/></g><g fill="#050403">
      <rect x="596" y="410" width="16" height="230"/><rect x="552" y="460" width="104" height="16"/>
      <rect x="988" y="410" width="16" height="230"/><rect x="944" y="460" width="104" height="16"/></g>
    </svg>`,
    // El velo del templo se rasga de arriba abajo
    velo: `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" class="es es-velo">
      <defs><radialGradient id="es-luz" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff3c9"/><stop offset=".5" stop-color="#d8b45a"/><stop offset="1" stop-color="#1a0d06"/></radialGradient>
        <linearGradient id="es-tela" x1="0" x2="1"><stop offset="0" stop-color="#5a0d12"/><stop offset=".5" stop-color="#8e1a22"/><stop offset="1" stop-color="#4a0a0f"/></linearGradient>
        <clipPath id="es-corte-i"><polygon points="0,0 800,0 791,36 782,72 808,108 778,144 802,180 793,216 777,252 800,288 776,324 797,360 778,396 779,432 796,468 817,504 780,540 786,576 807,612 823,648 804,684 795,720 825,756 776,792 819,828 789,864 800,900 0,900"/></clipPath><clipPath id="es-corte-d"><polygon points="1600,0 800,0 791,36 782,72 808,108 778,144 802,180 793,216 777,252 800,288 776,324 797,360 778,396 779,432 796,468 817,504 780,540 786,576 807,612 823,648 804,684 795,720 825,756 776,792 819,828 789,864 800,900 1600,900"/></clipPath></defs>
      <rect width="1600" height="900" fill="url(#es-luz)"/>
      <g class="es-mitad izq"><g clip-path="url(#es-corte-i)"><rect x="0" y="0" width="1600" height="900" fill="url(#es-tela)"/><g stroke="rgba(0,0,0,.35)" stroke-width="10"><line x1="90" y1="0" x2="90" y2="900"/><line x1="210" y1="0" x2="210" y2="900"/><line x1="330" y1="0" x2="330" y2="900"/><line x1="450" y1="0" x2="450" y2="900"/><line x1="570" y1="0" x2="570" y2="900"/><line x1="690" y1="0" x2="690" y2="900"/></g></g>
        <polyline points="800,0 791,36 782,72 808,108 778,144 802,180 793,216 777,252 800,288 776,324 797,360 778,396 779,432 796,468 817,504 780,540 786,576 807,612 823,648 804,684 795,720 825,756 776,792 819,828 789,864 800,900" fill="none" stroke="#3a0609" stroke-width="5"/></g>
      <g class="es-mitad der"><g clip-path="url(#es-corte-d)"><rect x="0" y="0" width="1600" height="900" fill="url(#es-tela)"/><g stroke="rgba(0,0,0,.35)" stroke-width="10"><line x1="910" y1="0" x2="910" y2="900"/><line x1="1030" y1="0" x2="1030" y2="900"/><line x1="1150" y1="0" x2="1150" y2="900"/><line x1="1270" y1="0" x2="1270" y2="900"/><line x1="1390" y1="0" x2="1390" y2="900"/><line x1="1510" y1="0" x2="1510" y2="900"/></g></g>
        <polyline points="800,0 791,36 782,72 808,108 778,144 802,180 793,216 777,252 800,288 776,324 797,360 778,396 779,432 796,468 817,504 780,540 786,576 807,612 823,648 804,684 795,720 825,756 776,792 819,828 789,864 800,900" fill="none" stroke="#3a0609" stroke-width="5"/></g>
      <polyline class="es-rasgadura" points="800,0 791,36 782,72 808,108 778,144 802,180 793,216 777,252 800,288 776,324 797,360 778,396 779,432 796,468 817,504 780,540 786,576 807,612 823,648 804,684 795,720 825,756 776,792 819,828 789,864 800,900" fill="none" stroke="#fff3c9" stroke-width="7" stroke-linejoin="round"/>
      <polyline class="es-rayo-velo" points="760,-20 820,60 780,80 812,150 796,170 800,190" fill="none" stroke="#f4f6ff" stroke-width="7" stroke-linejoin="round"/>
      <rect class="es-destello-velo" width="1600" height="900" fill="#ffffff"/>
      <rect width="1600" height="26" fill="#2a1e05"/>
    </svg>`,
    // Pentecostés: lenguas como de fuego sobre cada uno
    pentecostes: `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" class="es es-pente">
      <defs><radialGradient id="es-casa" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#3b2614"/><stop offset="1" stop-color="#0a0705"/></radialGradient>
        <linearGradient id="es-fuego" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff7a1a"/><stop offset=".6" stop-color="#ffc23a"/><stop offset="1" stop-color="#fff3c9"/></linearGradient></defs>
      <rect width="1600" height="900" fill="url(#es-casa)"/>
      <g class="es-viento" stroke="rgba(255,243,201,.35)" stroke-width="4" fill="none" stroke-linecap="round">
        <path d="M-100 160 C300 120 500 220 900 170 S1500 140 1800 190"/><path d="M-100 240 C400 200 700 290 1100 240 S1600 220 1800 260"/></g>
      ${Array.from({ length: 12 }, (_, i) => { const x = 170 + i * 115, y = 640 + (i % 2) * 20;
        return `<g fill="#060403"><circle cx="${x}" cy="${y}" r="30"/><path d="M${x - 50} 900 C${x - 50} ${y + 50} ${x + 50} ${y + 50} ${x + 50} 900 Z"/></g>
          <path class="es-llama" style="--d:${(i * 0.12).toFixed(2)}s" d="M${x} ${y - 112} C${x + 20} ${y - 86} ${x + 18} ${y - 62} ${x} ${y - 50} C${x - 18} ${y - 62} ${x - 20} ${y - 86} ${x} ${y - 112} Z" fill="url(#es-fuego)"/>`; }).join("")}
    </svg>`,
    // La Iglesia perseguida: catacumbas con lámparas y el pez (ichthys) grabado
    perseguida: `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" class="es es-persec">
      <defs><radialGradient id="es-tunel" cx="50%" cy="55%" r="60%"><stop offset="0" stop-color="#4a3420"/><stop offset=".55" stop-color="#1c130b"/><stop offset="1" stop-color="#050302"/></radialGradient>
        <radialGradient id="es-lampara"><stop offset="0" stop-color="#fff1b8"/><stop offset=".4" stop-color="rgba(255,190,90,.6)"/><stop offset="1" stop-color="rgba(255,150,40,0)"/></radialGradient></defs>
      <rect width="1600" height="900" fill="url(#es-tunel)"/>
      <path d="M560 900 L560 420 C560 250 1040 250 1040 420 L1040 900 Z" fill="#0b0805"/>
      <g fill="#2a1d10">${[120, 300, 1300, 1480].map(x => `<rect x="${x - 70}" y="300" width="140" height="60" rx="8"/><rect x="${x - 70}" y="420" width="140" height="60" rx="8"/><rect x="${x - 70}" y="540" width="140" height="60" rx="8"/>`).join("")}</g>
      <path class="es-pez" d="M690 360 C760 300 860 300 920 360 L960 330 L960 390 L920 360 C860 420 760 420 690 360 Z" fill="none" stroke="#d8b45a" stroke-width="6"/>
      ${[[420, 480], [1180, 480], [800, 640]].map(([x, y], i) => `<g class="es-llamita" style="--d:${i * .4}s"><circle cx="${x}" cy="${y}" r="90" fill="url(#es-lampara)"/><path d="M${x} ${y - 22} C${x + 10} ${y - 8} ${x + 8} ${y + 4} ${x} ${y + 8} C${x - 8} ${y + 4} ${x - 10} ${y - 8} ${x} ${y - 22} Z" fill="#ffd36b"/></g>`).join("")}
      ${Array.from({ length: 7 }, (_, i) => { const x = 610 + i * 64; return `<g fill="#050302"><circle cx="${x}" cy="760" r="22"/><path d="M${x - 34} 900 C${x - 34} 790 ${x + 34} 790 ${x + 34} 900 Z"/></g>`; }).join("")}
    </svg>`,
    // Wittenberg 1517: el martillo clava las 95 tesis en la puerta
    puerta: `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" class="es es-puerta">
      <defs><linearGradient id="es-madera" x1="0" x2="1"><stop offset="0" stop-color="#3a2210"/><stop offset=".5" stop-color="#5a3518"/><stop offset="1" stop-color="#2e1a0b"/></linearGradient></defs>
      <rect width="1600" height="900" fill="#1a130d"/>
      <path d="M470 900 L470 300 C470 120 1130 120 1130 300 L1130 900 Z" fill="#2a1f16"/>
      <path d="M520 900 L520 310 C520 170 1080 170 1080 310 L1080 900 Z" fill="url(#es-madera)"/>
      <g stroke="rgba(0,0,0,.4)" stroke-width="8">${[613, 706, 800, 893, 986].map(x => `<line x1="${x}" y1="230" x2="${x}" y2="900"/>`).join("")}</g>
      <g fill="#1a1008">${[400, 560, 720].map(y => `<rect x="520" y="${y}" width="560" height="14"/>`).join("")}</g>
      <g class="es-hoja"><rect x="690" y="380" width="220" height="290" fill="#efe2bf"/>
        <text x="800" y="440" text-anchor="middle" font-family="Cinzel,serif" font-size="30" font-weight="700" fill="#3a2a10">95 TESIS</text>
        <g stroke="#9b8a63" stroke-width="5">${[480, 510, 540, 570, 600, 630].map(y => `<line x1="715" y1="${y}" x2="885" y2="${y}"/>`).join("")}</g>
        <circle cx="800" cy="392" r="7" fill="#3a2a10"/></g>
      <g class="es-martillo"><rect x="840" y="300" width="22" height="170" rx="6" fill="#6b4a26" transform="rotate(-35 851 385)"/>
        <rect x="792" y="268" width="96" height="42" rx="6" fill="#55595e" transform="rotate(-35 840 289)"/></g>
      <rect class="es-golpe" width="1600" height="900" fill="#fff3c9"/>
    </svg>`,
    // Las Cruzadas: jinetes al galope
    cruzadas: `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" class="es es-cruzadas">
      <defs><linearGradient id="es-ocaso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1208"/><stop offset=".6" stop-color="#b8541f"/><stop offset="1" stop-color="#e9a04a"/></linearGradient></defs>
      <rect width="1600" height="900" fill="url(#es-ocaso)"/><circle cx="1180" cy="560" r="120" fill="#f6dd8f" opacity=".75"/>
      <path d="M0 900 L0 690 L1600 690 L1600 900 Z" fill="#0d0a07"/>
      <g transform="translate(0,640)">${caballo(-300, 0)}${caballo(-560, .35)}${caballo(-820, .7)}</g>
    </svg>`,
    // El poder de los papas: Roma y la tiara
    papas: `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" class="es es-papas">
      <defs><radialGradient id="es-roma" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#5a4320"/><stop offset="1" stop-color="#0d0a07"/></radialGradient></defs>
      <rect width="1600" height="900" fill="url(#es-roma)"/>
      <g class="es-cupula" fill="#0d0a07"><path d="M560 720 C560 500 1040 500 1040 720 Z"/><rect x="520" y="720" width="560" height="60"/><rect x="760" y="430" width="80" height="80"/><path d="M780 430 L800 380 L820 430 Z"/>
        <rect x="200" y="760" width="1200" height="140"/>${[260, 360, 460, 1140, 1240, 1340].map(x => `<rect x="${x}" y="700" width="40" height="80"/>`).join("")}</g>
      <g class="es-tiara" transform="translate(1260,560)"><path d="M-70 60 C-70 -40 -40 -100 0 -120 C40 -100 70 -40 70 60 Z" fill="#d8b45a"/>
        <g stroke="#7a5a12" stroke-width="10"><line x1="-66" y1="20" x2="66" y2="20"/><line x1="-56" y1="-20" x2="56" y2="-20"/><line x1="-38" y1="-62" x2="38" y2="-62"/></g>
        <circle cx="0" cy="-128" r="12" fill="#d8b45a"/></g>
    </svg>`
  };
})();

/* Capas de realismo: niebla, lluvia, rayos de luz, brasas y polvo (dibujo propio). */
(function () {
  "use strict";
  const E = window.ESCENAS_SVG; if (!E) return;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const defs = `<defs>
    <filter id="es-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="38"/></filter>
    <filter id="es-blur-s"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="es-ruido" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .4  0 0 0 0 .3  0 0 0 .55 0"/></filter>
    <filter id="es-textura"><feTurbulence type="fractalNoise" baseFrequency=".012 .06" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  </defs>`;
  const niebla = (y, color, op) => `<g class="es-niebla" filter="url(#es-blur)" opacity="${op}">${Array.from({ length: 6 }, (_, i) =>
    `<ellipse cx="${i * 320 + rnd(-60, 60)}" cy="${y + rnd(-40, 40)}" rx="${rnd(260, 380)}" ry="${rnd(50, 90)}" fill="${color}" style="--v:${rnd(14, 24).toFixed(1)}s"/>`).join("")}</g>`;
  const lluvia = () => `<g class="es-lluvia" stroke="rgba(200,210,235,.28)" stroke-width="2" stroke-linecap="round">${Array.from({ length: 110 }, () => {
    const x = rnd(-100, 1700), y = rnd(-900, 900), l = rnd(30, 70); return `<line x1="${x}" y1="${y}" x2="${x - l * .25}" y2="${y + l}" style="--v:${rnd(.5, .9).toFixed(2)}s;--d:${rnd(0, .9).toFixed(2)}s"/>`; }).join("")}</g>`;
  const rayos = (cx, color) => `<g class="es-rayos" filter="url(#es-blur-s)" opacity=".55">${Array.from({ length: 9 }, (_, i) => {
    const a = -60 + i * 15, w = rnd(18, 46); return `<polygon points="${cx},-40 ${cx + Math.tan(a * Math.PI / 180) * 900 - w},900 ${cx + Math.tan(a * Math.PI / 180) * 900 + w},900" fill="${color}" style="--d:${(i * .25).toFixed(2)}s"/>`; }).join("")}</g>`;
  const brasas = (n, y0, color) => `<g class="es-brasas">${Array.from({ length: n }, () =>
    `<circle cx="${rnd(0, 1600)}" cy="${rnd(y0, 900)}" r="${rnd(1.5, 4).toFixed(1)}" fill="${color}" style="--v:${rnd(3, 6).toFixed(1)}s;--d:${rnd(0, 3).toFixed(1)}s;--x:${rnd(-80, 80).toFixed(0)}px"/>`).join("")}</g>`;
  const polvo = () => `<g class="es-polvo" filter="url(#es-blur)" opacity=".55">${Array.from({ length: 5 }, (_, i) =>
    `<ellipse cx="${-200 + i * 140}" cy="${700 + rnd(-20, 20)}" rx="${rnd(160, 240)}" ry="${rnd(40, 70)}" fill="#c98a4a" style="--d:${(i * .25).toFixed(2)}s"/>`).join("")}</g>`;
  const grano = `<rect class="es-grano" width="1600" height="900" filter="url(#es-ruido)"/>`;
  const vineta = `<radialGradient id="es-vin" cx="50%" cy="50%" r="75%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".8"/></radialGradient><rect width="1600" height="900" fill="url(#es-vin)"/>`;
  const mejorar = (k, antes, despues) => {
    if (!E[k]) return;
    E[k] = E[k].replace(/(<svg[^>]*>)/, `$1${defs}`).replace(/<\/svg>\s*$/, `${despues}${grano}${vineta}</svg>`);
    if (antes) E[k] = E[k].replace(antes[0], antes[1] + antes[0]);
  };
  // Cruz: nubes bajas, lluvia; las cruces con textura de madera
  mejorar("cruz", ['<path d="M0 900 L0 760', niebla(220, "#1b1622", .9) + lluvia()], niebla(820, "#0d0a0f", .8));
  if (E.cruz) E.cruz = E.cruz.replace('<g fill="#050403"><rect x="788"', '<g fill="#050403" class="es-maderos"><rect x="788"');
  mejorar("velo", null, rayos(800, "rgba(255,243,201,.55)") + brasas(26, 200, "#fff3c9"));
  mejorar("pentecostes", ['<g class="es-viento"', rayos(800, "rgba(255,200,110,.35)")], brasas(40, 300, "#ffc23a"));
  mejorar("perseguida", null, niebla(860, "#140d07", .9) + brasas(18, 400, "#ffd36b"));
  mejorar("papas", ['<g class="es-cupula"', rayos(800, "rgba(246,221,143,.35)")], niebla(840, "#0d0a07", .8));
  mejorar("cruzadas", ['<path d="M0 900 L0 690', niebla(560, "#e9a04a", .45)], polvo());
  mejorar("puerta", null, rayos(1300, "rgba(255,226,160,.25)"));
})();
