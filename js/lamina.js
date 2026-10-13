/* Láminas interactivas: mapa real (Natural Earth, dominio público) + recuadros con datos verificados. */
(function () {
  "use strict";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const W = 960, H = 560;
  let tierra = null;
  const cargarTierra = () => tierra || (tierra = fetch("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-50m.json").then(r => r.json()).then(t => topojson.feature(t, t.objects.land)));

  window.pintarLamina = function ($cont, eraId) {
    const L = (window.LAMINAS || {})[eraId];
    if (!L || !window.d3 || !window.topojson) { $cont.remove(); return; }
    const LUG = window.LUGARES, EV = Object.fromEntries((window.EVENTOS || []).map(e => [e.id, e]));
    $cont.innerHTML = `
      <div class="lam-cab"><div><h2>${esc(L.titulo)}</h2><p>${esc(L.sub)}</p></div>
        <div class="lam-sel" role="tablist" aria-label="Elegir">${L.items.map((it, k) => `<button type="button" role="tab" aria-selected="${k === 0}" data-k="${k}"><b>${esc(it.n)}</b><small>${esc(it.anios)}</small></button>`).join("")}</div></div>
      <div class="lam-cuerpo">
        <div class="lam-izq"></div>
        <figure class="lam-mapa"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Mapa"><g class="lam-tierra"></g><g class="lam-etq"></g><g class="lam-rutas"></g><g class="lam-ciudades"></g></svg>
          <figcaption>Mapa: Natural Earth (dominio público) · rutas aproximadas</figcaption></figure>
        <div class="lam-der"></div>
      </div>
      <ol class="lam-pasos"></ol>`;
    const svg = $cont.querySelector("svg");
    const proj = d3.geoConicConformal().rotate([-20, 0]).parallels([30, 50])
      .fitExtent([[10, 10], [W - 10, H - 10]], { type: "MultiPoint", coordinates: [[L.vista[0][0], L.vista[0][1]], [L.vista[1][0], L.vista[1][1]], [L.vista[0][0], L.vista[1][1]], [L.vista[1][0], L.vista[0][1]]] });
    const camino = d3.geoPath(proj);
    const P = id => proj([LUG[id][1], LUG[id][2]]);
    cargarTierra().then(f => { svg.querySelector(".lam-tierra").innerHTML = `<path d="${camino(f)}"/>`; }).catch(() => {
      svg.querySelector(".lam-tierra").innerHTML = `<text x="20" y="30" class="lam-aviso">No se pudo cargar el mapa base.</text>`;
    });

    function curva(pts) {
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0;
        d += ` Q${mx - dy * .12},${my + dx * .12} ${x1},${y1}`;
      }
      return d;
    }
    const resumen = t => { t = String(t || ""); return t.length > 230 ? t.slice(0, 230).replace(/\s+\S*$/, "") + "…" : t; };

    function mostrar(k) {
      const it = L.items[k], ev = EV[it.hito];
      $cont.querySelectorAll(".lam-sel button").forEach((b, i) => b.setAttribute("aria-selected", String(i === k)));
      const est = { exito: ["Logró su objetivo", "ok"], parcial: ["Resultado parcial", "medio"], fracaso: ["Fracaso", "mal"] }[it.estado];
      $cont.querySelector(".lam-izq").innerHTML = `
        <div class="lam-caja"><h3>${esc(it.n)} Cruzada <small>${esc(it.anios)}</small></h3><p>${esc(it.convoca)}</p></div>
        <div class="lam-caja"><h4>Protagonistas</h4><ul>${it.lideres.map(l => `<li>${esc(l)}</li>`).join("")}</ul></div>
        <div class="lam-caja"><h4>Objetivo</h4><p>${esc(it.objetivo)}</p></div>`;
      $cont.querySelector(".lam-der").innerHTML = `
        <div class="lam-caja lam-res ${est[1]}"><h4>Resultado · ${est[0]}</h4><p>${esc(it.resultado)}</p></div>
        ${ev && ev.clase ? `<div class="lam-caja lam-clase"><h4>Notas de clase <small>${esc(ev.nota || "")}</small></h4><p>${esc(resumen(ev.clase))}</p></div>` : ""}
        <a class="lam-ir" href="#/era/${ev ? ev.era : ""}/${it.hito}">Abrir el hito y sus fuentes →</a>`;
      // etiquetas de poderes
      svg.querySelector(".lam-etq").innerHTML = it.etiquetas.map(([t, lo, la]) => { const [x, y] = proj([lo, la]); return `<text x="${x}" y="${y}" class="lam-poder">${esc(t)}</text>`; }).join("");
      // rutas animadas
      const g = svg.querySelector(".lam-rutas"); g.innerHTML = "";
      it.rutas.forEach((r, i) => {
        const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("d", curva(r.p.map(P))); p.setAttribute("class", "lam-ruta"); p.style.stroke = r.c;
        g.appendChild(p);
        const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        p.getBoundingClientRect(); p.style.transition = `stroke-dashoffset ${1.4 + len / 900}s ease ${i * .35}s`; p.style.strokeDashoffset = 0;
      });
      // ciudades de esta cruzada
      const ids = [...new Set(it.rutas.flatMap(r => r.p).concat(it.pasos.map(s => s[1])))];
      svg.querySelector(".lam-ciudades").innerHTML = ids.map(id => { const [x, y] = P(id); const destino = it.pasos.some(s => s[1] === id);
        return `<g class="lam-c${destino ? " clave" : ""}" data-id="${id}" transform="translate(${x},${y})"><circle r="${destino ? 6 : 4}"/><text x="8" y="-8">${esc(LUG[id][0])}</text></g>`; }).join("");
      // pasos
      $cont.querySelector(".lam-pasos").innerHTML = it.pasos.map(([f, id, t], i) => `<li><button type="button" data-id="${id}"><span class="lam-n">${i + 1}</span><b>${esc(f)}</b>${esc(t)}</button></li>`).join("");
      $cont.querySelectorAll(".lam-pasos button").forEach(b => b.addEventListener("mouseenter", () => resaltar(b.dataset.id)));
      $cont.querySelectorAll(".lam-pasos button").forEach(b => b.addEventListener("click", () => resaltar(b.dataset.id)));
    }
    function resaltar(id) {
      svg.querySelectorAll(".lam-c").forEach(c => c.classList.toggle("activa", c.dataset.id === id));
      $cont.querySelectorAll(".lam-pasos button").forEach(b => b.classList.toggle("activa", b.dataset.id === id));
    }
    $cont.querySelectorAll(".lam-sel button").forEach(b => b.addEventListener("click", () => mostrar(+b.dataset.k)));
    mostrar(0);
  };
})();
