/* Láminas interactivas: mapa real (Natural Earth, dominio público) + recuadros con datos verificados. */
(function () {
  "use strict";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const W = 960, H = 560, ATLAS = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/";
  const cache = {};
  const cargar = archivo => cache[archivo] || (cache[archivo] = fetch(ATLAS + archivo).then(r => r.json()));

  window.pintarLamina = function ($cont, eraId) {
    const L = (window.LAMINAS || {})[eraId];
    if (!L || !window.d3 || !window.topojson) { $cont.remove(); return; }
    const LUG = window.LUGARES, EV = Object.fromEntries((window.EVENTOS || []).map(e => [e.id, e]));
    const C = Object.assign({ intro: "", quien: "Protagonistas", obj: "Objetivo", res: "Resultado" }, L.cajas || {});
    $cont.innerHTML = `
      <div class="lam-cab"><div><h2>${esc(L.titulo)}</h2><p>${esc(L.sub)}</p></div>
        <div class="lam-sel" role="group" aria-label="Elegir (toque de nuevo para quitar)">${L.items.map((it, k) => `<button type="button" aria-pressed="false" data-k="${k}"><b>${esc(it.n)}</b><small>${esc(it.anios)}</small></button>`).join("")}</div></div>
      <div class="lam-cuerpo">
        <div class="lam-izq"></div>
        <figure class="lam-mapa"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Mapa de ${esc(L.titulo)}"><g class="lam-tierra"></g><g class="lam-fronteras"></g><g class="lam-lineas"></g><g class="lam-etq"></g><g class="lam-rutas"></g><g class="lam-ciudades"></g></svg>
          <figcaption>Mapa: Natural Earth (dominio público) · ubicaciones y rutas aproximadas</figcaption></figure>
        <div class="lam-der"></div>
      </div>
      <ol class="lam-pasos"></ol>`;
    const svg = $cont.querySelector("svg");
    const [[lo0, la0], [lo1, la1]] = L.vista;
    const marco = { type: "MultiPoint", coordinates: [[lo0, la0], [lo1, la1], [lo0, la1], [lo1, la0], [(lo0 + lo1) / 2, la0], [(lo0 + lo1) / 2, la1]] };
    const proj = (L.proy === "mercator" ? d3.geoMercator() : d3.geoConicConformal().rotate([-(lo0 + lo1) / 2, 0]).parallels([la0 + (la1 - la0) * .25, la0 + (la1 - la0) * .75]))
      .fitExtent([[10, 10], [W - 10, H - 10]], marco);
    const camino = d3.geoPath(proj);
    const P = id => proj([LUG[id][1], LUG[id][2]]);
    cargar("land-50m.json").then(t => { svg.querySelector(".lam-tierra").innerHTML = `<path d="${camino(topojson.feature(t, t.objects.land))}"/>`; })
      .catch(() => { svg.querySelector(".lam-tierra").innerHTML = `<text x="20" y="30" class="lam-aviso">No se pudo cargar el mapa base (requiere internet).</text>`; });
    if (L.fronteras) cargar("countries-50m.json").then(t => { svg.querySelector(".lam-fronteras").innerHTML = `<path d="${camino(topojson.mesh(t, t.objects.countries, (a, b) => a !== b))}"/>`; }).catch(() => {});
    if (L.lineas) svg.querySelector(".lam-lineas").innerHTML = L.lineas.map(l => `<path class="lam-linea" d="${camino({ type: "LineString", coordinates: l.p })}"/>` + (l.t ? (() => { const [x, y] = proj(l.p[l.p.length - 1]); return `<text class="lam-linea-t" x="${x}" y="${y - 6}">${esc(l.t)}</text>`; })() : "")).join("");

    function curva(pts) {
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0;
        d += ` Q${mx - dy * .12},${my + dx * .12} ${x1},${y1}`;
      }
      return d;
    }
    const resumen = t => { t = String(t || ""); return t.length > 230 ? t.slice(0, 230).replace(/\s+\S*$/, "") + "…" : t; };
    const EST = { exito: ["Logró su objetivo", "ok"], parcial: ["Resultado parcial", "medio"], fracaso: ["Fracaso", "mal"] };

    const hitosDe = it => [...new Set([it.hito].concat(it.rel || [], (it.pasos || []).map(p => p[3])).filter(h => h && EV[h]))];
    function filtrar(ids, nombre) { $cont.dispatchEvent(new CustomEvent("lamina-filtro", { bubbles: true, detail: { ids, nombre } })); }
    function general() {
      $cont.querySelectorAll(".lam-sel button").forEach(b => b.setAttribute("aria-pressed", "false"));
      $cont.querySelector(".lam-izq").innerHTML = `<div class="lam-caja"><h3>${esc(L.titulo)}</h3><p>${esc(L.sub)}</p></div>`;
      $cont.querySelector(".lam-der").innerHTML = `<div class="lam-caja lam-ayuda"><h4>Cómo usarla</h4><p>Toque una opción de arriba: el mapa muestra su detalle y abajo quedan solo sus hitos. Tóquela de nuevo para volver a ver todo.</p></div>`;
      svg.querySelector(".lam-etq").innerHTML = "";
      const g = svg.querySelector(".lam-rutas"); g.innerHTML = "";
      L.items.forEach(it => (it.rutas || []).forEach(r => { const p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", curva(r.p.map(P))); p.setAttribute("class", "lam-ruta tenue"); p.style.stroke = r.c; g.appendChild(p); }));
      const ids = [...new Set(L.items.flatMap(it => (it.rutas || []).flatMap(r => r.p).concat((it.pasos || []).map(s => s[1])).concat(it.puntos || [])))];
      svg.querySelector(".lam-ciudades").innerHTML = ids.map(id => { const [x, y] = P(id); return `<g class="lam-c" data-id="${id}" transform="translate(${x},${y})"><circle r="4"/><text x="8" y="-8">${esc(LUG[id][0])}</text></g>`; }).join("");
      $cont.querySelector(".lam-pasos").innerHTML = L.items.map((it, k) => `<li><button type="button" class="lam-ir-item" data-k="${k}"><span class="lam-n">${k + 1}</span><b>${esc(it.anios)}</b>${esc(it.titulo || (L.prefijo ? it.n + " " + L.prefijo : it.n))}</button></li>`).join("");
      $cont.querySelectorAll(".lam-ir-item").forEach(b => b.addEventListener("click", () => elegir(+b.dataset.k)));
      filtrar(null);
    }
    let actual = null;
    function elegir(k) { if (actual === k) { actual = null; general(); } else { actual = k; mostrar(k); } }
    function mostrar(k) {
      const it = L.items[k], ev = EV[it.hito];
      $cont.querySelectorAll(".lam-sel button").forEach((b, i) => b.setAttribute("aria-pressed", String(i === k)));
      filtrar(hitosDe(it), it.titulo || (L.prefijo ? it.n + " " + L.prefijo : it.n));
      const est = EST[it.estado];
      $cont.querySelector(".lam-izq").innerHTML = `
        <div class="lam-caja"><h3>${esc(it.titulo || (L.prefijo ? it.n + " " + L.prefijo : it.n))} <small>${esc(it.anios)}</small></h3><p>${esc(it.convoca || "")}</p></div>
        ${(it.lideres || []).length ? `<div class="lam-caja"><h4>${esc(it.quien || C.quien)}</h4><ul>${it.lideres.map(l => `<li>${esc(l)}</li>`).join("")}</ul></div>` : ""}
        ${it.objetivo ? `<div class="lam-caja"><h4>${esc(it.obj || C.obj)}</h4><p>${esc(it.objetivo)}</p></div>` : ""}`;
      $cont.querySelector(".lam-der").innerHTML = `
        ${it.resultado ? `<div class="lam-caja lam-res ${est ? est[1] : ""}"><h4>${esc(it.res || C.res)}${est ? " · " + est[0] : ""}</h4><p>${esc(it.resultado)}</p></div>` : ""}
        ${ev && ev.clase ? `<div class="lam-caja lam-clase"><h4>Notas de clase <small>${esc(ev.nota || "")}</small></h4><p>${esc(resumen(ev.clase))}</p></div>` : ""}
        ${ev ? `<a class="lam-ir" href="#/era/${ev.era}/${ev.id}">Abrir el hito y sus fuentes →</a>` : ""}`;
      svg.querySelector(".lam-etq").innerHTML = (it.etiquetas || []).map(([t, lo, la, c]) => { const [x, y] = proj([lo, la]); return `<text x="${x}" y="${y}" class="lam-poder"${c ? ` style="fill:${c}"` : ""}>${esc(t)}</text>`; }).join("");
      const g = svg.querySelector(".lam-rutas"); g.innerHTML = "";
      (it.rutas || []).forEach((r, i) => {
        const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("d", curva(r.p.map(P))); p.setAttribute("class", "lam-ruta"); p.style.stroke = r.c;
        g.appendChild(p);
        const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        p.getBoundingClientRect(); p.style.transition = `stroke-dashoffset ${1.4 + len / 900}s ease ${i * .35}s`; p.style.strokeDashoffset = 0;
      });
      const pasos = it.pasos || [];
      const ids = [...new Set((it.rutas || []).flatMap(r => r.p).concat(pasos.map(s => s[1])).concat(it.puntos || []))];
      svg.querySelector(".lam-ciudades").innerHTML = ids.map(id => { const [x, y] = P(id); const clave = pasos.some(s => s[1] === id);
        return `<g class="lam-c${clave ? " clave" : ""}" data-id="${id}" transform="translate(${x},${y})"><circle r="${clave ? 6 : 4}"/><text x="8" y="-8">${esc(LUG[id][0])}</text></g>`; }).join("");
      $cont.querySelector(".lam-pasos").innerHTML = pasos.map(([f, id, t, h], i) => { const e = h && EV[h];
        return `<li><button type="button" data-id="${id}"><span class="lam-n">${i + 1}</span><b>${esc(f)}</b>${esc(t)}</button>${e ? `<a class="lam-p-ir" href="#/era/${e.era}/${e.id}">ver hito →</a>` : ""}</li>`; }).join("");
      $cont.querySelectorAll(".lam-pasos button").forEach(b => { b.addEventListener("mouseenter", () => resaltar(b.dataset.id)); b.addEventListener("click", () => resaltar(b.dataset.id)); });
    }
    function resaltar(id) {
      svg.querySelectorAll(".lam-c").forEach(c => c.classList.toggle("activa", c.dataset.id === id));
      $cont.querySelectorAll(".lam-pasos button").forEach(b => b.classList.toggle("activa", b.dataset.id === id));
    }
    $cont.querySelectorAll(".lam-sel button").forEach(b => b.addEventListener("click", () => elegir(+b.dataset.k)));
    $cont.addEventListener("lamina-quitar", () => { actual = null; general(); });
    general();
  };
})();
