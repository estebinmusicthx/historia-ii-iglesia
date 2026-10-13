/* Línea del tiempo · Historia II. Vanilla JS, sin dependencias. Funciona con doble clic (file://) y en GitHub Pages. */
(function () {
  "use strict";
  const ERAS = window.ERAS || [], EVENTOS = (window.EVENTOS || []).slice().sort((a, b) => a.a - b.a), IMG = window.IMAGENES || {};
  const $main = document.getElementById("contenido");
  const eraPorId = Object.fromEntries(ERAS.map(e => [e.id, e]));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Separa en renglones las enumeraciones de las notas ("1. … 2. …", "1) … 2) …").
  const fmt = s => esc(s).replace(/(^|[\s.;:])(\d{1,2})([.)])\s(?=[A-ZÁÉÍÓÚ¿¡&])/g, (m, a, n, p, i) => (i === 0 ? "" : a.trim() + "\n") + n + p + " ");
  const ext = (u, t) => `<a href="${esc(u)}" target="_blank" rel="noopener">${t}</a>`;

  const ETIQ = { colombia: "Colombia", avivamiento: "Avivamientos", martir: "Mártires", mision: "Misiones", biblia: "Biblia", persona: "Personas", concilio: "Concilios", iglesias: "Iglesias grandes", reflexion: "Reflexión" };

  /* ---------- Versículos → BibleGateway (RVR1960, solo enlace) ---------- */
  const LIBROS = { "Hch": "Hechos", "Gá": "Gálatas", "Jn": "Juan", "1 Jn": "1 Juan", "Ro": "Romanos", "Éx": "Éxodo", "Ez": "Ezequiel", "Hab": "Habacuc", "Ef": "Efesios", "Col": "Colosenses", "1 Ti": "1 Timoteo", "2 Ti": "2 Timoteo", "Tit": "Tito", "Heb": "Hebreos", "Fil": "Filipenses", "Sal": "Salmos", "Ap": "Apocalipsis", "Mt": "Mateo", "1 Co": "1 Corintios" };
  function versiculo(ref) {
    const m = ref.match(/^((?:\d )?[A-Za-zÁÉÍÓÚáéíóú]+)\s+(.+)$/);
    const libro = m && LIBROS[m[1]] ? LIBROS[m[1]] : null;
    const q = libro ? `${libro} ${m[2].replace(/\s*–\s*/g, "-")}` : ref;
    return ext(`https://www.biblegateway.com/passage/?search=${encodeURIComponent(q)}&version=RVR1960`, esc(ref));
  }
  window.__versiculoURL = versiculo; // usado por la herramienta de verificación

  /* ---------- Piezas ---------- */
  function figura(clave) {
    const im = clave && IMG[clave];
    if (!im) return "";
    return `<figure class="foto-hito"><img loading="lazy" src="${esc(im.src)}" alt="${esc(im.titulo)}">
      <figcaption>${esc(im.titulo)}${im.anio ? " (" + esc(im.anio) + ")" : ""}. ${esc(im.autor)} · ${esc(im.licencia)} · ${ext(im.pagina, "Wikimedia Commons")}</figcaption></figure>`;
  }
  const chipsOrigen = e => [e.clase ? '<span class="chip c-clase">Notas de clase</span>' : "", e.prec ? '<span class="chip c-prec">Precisión</span>' : "", e.comp ? '<span class="chip c-comp">Complemento</span>' : ""].join("");

  function tarjeta(e) {
    const fig = figura(e.img);
    const fuentes = (e.fuentes || []).length ? `<div class="fuentes-hito"><b>Fuentes del complemento:</b><ol>${e.fuentes.map(([n, u]) => `<li>${ext(u, esc(n))}</li>`).join("")}</ol></div>` : "";
    return `<article class="hito revela${e.clase ? "" : " solo-comp"}" id="h-${esc(e.id)}">
      <div class="tarjeta">
        <div class="t-cab"><div class="t-fecha">${esc(e.f)}</div>
          <div><h3>${esc(e.t)}</h3><div class="marcas">${chipsOrigen(e)}${(e.tags || []).filter(t => ETIQ[t]).map(t => `<span class="chip">${ETIQ[t]}</span>`).join("")}</div></div></div>
        <div class="t-cuerpo${fig ? "" : " sin-foto"}">
          <div class="t-textos">
            ${e.clase ? `<div class="bloque b-clase"><div class="et">Notas de clase <small>Historia II · Escuela Bíblica BEREA${e.nota ? " · " + esc(e.nota) : ""}</small></div><p>${fmt(e.clase)}</p></div>` : ""}
            ${e.prec ? `<div class="bloque b-prec"><div class="et">Precisión histórica <small>la nota se mantiene; esto la corrige o aclara</small></div><p>${esc(e.prec)}</p></div>` : ""}
            ${e.comp ? `<div class="bloque b-comp"><div class="et">Complemento <small>no está en las notas · ver fuentes</small></div><p>${fmt(e.comp)}</p></div>` : ""}
            ${(e.vers || []).length ? `<div class="vers"><b>Biblia:</b> ${e.vers.map(versiculo).join(" ")}</div>` : ""}
            ${fuentes}
          </div>
          ${fig}
        </div>
      </div></article>`;
  }

  function imagenEra(era) {
    const ev = EVENTOS.find(e => e.era === era.id && e.img && IMG[e.img]);
    return ev ? IMG[ev.img].src : "";
  }
  const rango = era => `${era.desde} – ${era.id === "moderna" || era.id === "colombia" ? "hoy" : era.hasta}`;

  /* ---------- Vistas ---------- */
  function vistaInicio() {
    const MIN = 33, MAX = 2026;
    // Barra proporcional con los bloques grandes del curso; las etapas temáticas se ven abajo.
    const bloques = [
      { t: "Antecedentes", d: 33, h: 476, c: "#9a6b3f", r: "#/era/prologo" },
      { t: "Iglesia Medieval", d: 476, h: 1453, c: "#8c2f39", r: "#/era/papado" },
      { t: "Iglesia Reformada", d: 1453, h: 1648, c: "#b8862b", r: "#/era/reforma" },
      { t: "Iglesia moderna", d: 1648, h: MAX, c: "#2e6e9e", r: "#/era/moderna" }
    ];
    const pct = y => ((y - MIN) / (MAX - MIN)) * 100;
    const marcas = [33, 476, 1054, 1453, 1517, 1648, 1901, 2026];
    let grupos = "";
    [...new Set(ERAS.map(e => e.grupo))].forEach(g => {
      grupos += `<div class="grupo"><h2>${esc(g)}</h2></div><div class="eras">` + ERAS.filter(e => e.grupo === g).map(era => {
        const evs = EVENTOS.filter(e => e.era === era.id), nC = evs.filter(e => e.clase).length;
        return `<a class="era-card revela" href="#/era/${era.id}" style="--c:${era.color}">
          <div class="foto" style="background-image:url('${esc(imagenEra(era))}')"><span class="num">${esc(era.n)}</span></div>
          <div class="cuerpo"><h3>${esc(era.nombre)}</h3><div class="rango">${rango(era)}</div>
          <div class="cuenta">${evs.length} hitos · <b>${nC} de notas de clase</b></div></div></a>`;
      }).join("") + `</div>`;
    });
    $main.innerHTML = `
      <section class="hero"><div class="k">${esc(window.CURSO.escuela)}</div>
        <h1>Historia II<span>${esc(window.CURSO.subtitulo)}</span></h1></section>
      <h2 class="ley-t">Material de la línea de tiempo basado en</h2>
      <section class="leyenda" aria-label="Material de la línea de tiempo">
        <div class="ley" style="--b:var(--clase-borde);--c:var(--clase)"><b>Notas de clase</b>Transcripción fiel de lo tomado en cada lección, con la referencia de la página del cuaderno.</div>
        <div class="ley" style="--b:var(--prec-borde);--c:var(--prec)"><b>Precisión</b>Aclaración con su fuente cuando un dato de las notas difiere de la historia documentada. La nota se conserva.</div>
        <div class="ley" style="--b:var(--comp-borde);--c:var(--comp)"><b>Complemento</b>Información que amplía las notas, tomada de fuentes abiertas, enlazadas y verificadas.</div>
      </section>
      <section class="regla"><h2>De Pentecostés a hoy</h2>
        <div class="regla-barra">${bloques.map(b => `<a href="${b.r}" title="${b.t} (${b.d}–${b.h === MAX ? "hoy" : b.h})" aria-label="${b.t}" style="width:${pct(b.h) - pct(b.d)}%;background:${b.c}"></a>`).join("")}</div>
        <div class="regla-marcas">${marcas.map(m => `<span style="left:${pct(m)}%">${m === MAX ? "hoy" : m}</span>`).join("")}</div>
        <p class="regla-nota">Antecedentes · Iglesia Medieval (476–1453) · Iglesia Reformada (1453–1648) · Iglesia moderna</p></section>
      ${grupos}`;
  }

  function vistaEra(id, hitoId) {
    const era = eraPorId[id];
    if (!era) return vistaNoEncontrada();
    document.documentElement.style.setProperty("--era", era.color);
    const i = ERAS.indexOf(era), ant = ERAS[i - 1], sig = ERAS[i + 1];
    const evs = EVENTOS.filter(e => e.era === id);
    $main.innerHTML = `
      <section class="era-cab"><div class="k">${esc(era.n)}</div><h1>${esc(era.nombre)}</h1>
        <div class="rango">${rango(era)}</div><div class="grupo-n">${esc(era.grupo)}</div>
        <div class="resumenes">
          ${era.clase ? `<div class="bloque b-clase"><div class="et">Notas de clase <small>resumen de la etapa</small></div><p>${esc(era.clase)}</p></div>` : `<div class="bloque b-clase"><div class="et">Notas de clase</div><p>Este enfoque no está en las notas de clase: todo su contenido es complemento con fuentes.</p></div>`}
          <div class="bloque b-comp"><div class="et">Complemento</div><p>${esc(era.comp)}</p></div>
        </div>
        <label class="filtro-era"><input type="checkbox" id="solo-clase"> Ver solo los hitos que están en las notas de clase</label>
      </section>
      <section class="linea" id="linea">${evs.map(tarjeta).join("")}</section>
      <h2 class="seccion-t">Reflexión de fe</h2>
      <div class="bloque b-ref"><div class="et">Desde la fe de El Lugar de Su Presencia <small>${ext(window.CURSO.creemos, "ver «Qué creemos»")}</small></div><p>${esc(era.fe)}</p></div>
      <h2 class="seccion-t">Repaso</h2>
      <div class="repaso">${era.repaso.map((q, k) => `<div class="carta"><button type="button" aria-label="Pregunta ${k + 1}: ${esc(q.p)}. Toque para ver la respuesta.">
        <span class="cara"><span>${esc(q.p)}</span><small>Toque para ver la respuesta</small></span>
        <span class="cara atras"><span>${esc(q.r)}</span><small>Respuesta</small></span></button></div>`).join("")}</div>
      <nav class="nav-eras" aria-label="Eras vecinas">
        ${ant ? `<a href="#/era/${ant.id}"><small>← Anterior</small>${esc(ant.nombre)}</a>` : "<span></span>"}
        ${sig ? `<a class="sig" href="#/era/${sig.id}"><small>Siguiente →</small>${esc(sig.nombre)}</a>` : "<span></span>"}
      </nav>`;
    $main.querySelectorAll(".carta button").forEach(b => b.addEventListener("click", () => b.parentElement.classList.toggle("girada")));
    $main.querySelector("#solo-clase").addEventListener("change", ev => {
      $main.querySelectorAll(".hito.solo-comp").forEach(h => h.classList.toggle("oculto", ev.target.checked));
    });
    reglaFija(era, evs);
    if (hitoId) requestAnimationFrame(() => { const h = document.getElementById("h-" + hitoId); if (h) { h.classList.add("visible"); h.scrollIntoView({ block: "start" }); } });
  }

  function vistaLinea() {
    const estado = { q: "", era: "", tag: "", soloClase: false };
    $main.innerHTML = `<div class="doc"><h1>Línea completa</h1><p>Todos los hitos en orden cronológico. Busque por palabra o filtre por era y tema.</p></div>
      <div class="filtros">
        <input class="buscar" type="search" placeholder="Buscar: Lutero, Nicea, Bogotá, avivamiento…" aria-label="Buscar en la línea del tiempo">
        <div class="chips" id="f-era" role="group" aria-label="Filtrar por era"><button type="button" aria-pressed="true" data-v="">Todas las eras</button>${ERAS.map(e => `<button type="button" aria-pressed="false" data-v="${e.id}">${esc(e.n === "Etapa 1" || e.n.startsWith("Etapa") ? e.n + ": " + e.nombre : e.nombre)}</button>`).join("")}</div>
        <div class="chips" id="f-tag" role="group" aria-label="Filtrar por tema"><button type="button" aria-pressed="true" data-v="">Todos los temas</button>${Object.entries(ETIQ).map(([k, v]) => `<button type="button" aria-pressed="false" data-v="${k}">${v}</button>`).join("")}<button type="button" aria-pressed="false" data-v="__clase">Solo notas de clase</button></div>
        <div class="contador" aria-live="polite"></div>
      </div><ul class="lista"></ul>`;
    const $l = $main.querySelector(".lista"), $c = $main.querySelector(".contador");
    const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    function pintar() {
      const q = norm(estado.q);
      const r = EVENTOS.filter(e => (!estado.era || e.era === estado.era) && (!estado.tag || (e.tags || []).includes(estado.tag)) && (!estado.soloClase || e.clase) &&
        (!q || norm([e.t, e.f, e.clase, e.comp, e.prec].join(" ")).includes(q)));
      $c.textContent = `${r.length} de ${EVENTOS.length} hitos`;
      $l.innerHTML = r.map(e => { const era = eraPorId[e.era]; return `<li style="--c:${era.color}"><span class="f">${esc(e.f)}</span><div>
        <a href="#/era/${e.era}/${e.id}">${esc(e.t)}</a><div class="meta">${esc(era.nombre)} · ${chipsOrigen(e)}</div></div></li>`; }).join("") || "<li><span></span><div>No hay resultados.</div></li>";
    }
    $main.querySelector(".buscar").addEventListener("input", ev => { estado.q = ev.target.value; pintar(); });
    function grupoChips(sel, cb) {
      const g = $main.querySelector(sel);
      g.addEventListener("click", ev => { const b = ev.target.closest("button"); if (!b) return;
        g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b))); cb(b.dataset.v); pintar(); });
    }
    grupoChips("#f-era", v => estado.era = v);
    grupoChips("#f-tag", v => { estado.soloClase = v === "__clase"; estado.tag = v === "__clase" ? "" : v; });
    pintar();
  }

  function vistaFuentes() {
    const todas = new Map();
    EVENTOS.forEach(e => (e.fuentes || []).forEach(([n, u]) => { if (!todas.has(u)) todas.set(u, { n, ids: [] }); todas.get(u).ids.push(e); }));
    const usadas = new Set(EVENTOS.map(e => e.img).filter(Boolean));
    const imgs = Object.entries(IMG).filter(([k, v]) => v && usadas.has(k));
    const nClase = EVENTOS.filter(e => e.clase).length, nPrec = EVENTOS.filter(e => e.prec).length;
    $main.innerHTML = `<div class="doc">
      <h1>Fuentes y créditos</h1>
      <h2>Cómo se construyó</h2>
      <ul>
        <li><b>Curso:</b> ${esc(window.CURSO.titulo)}. ${esc(window.CURSO.escuela)}. Docente: ${esc(window.CURSO.docente)}. Más referencia: ${ext(window.CURSO.url, "sitio del curso")} (acceso con cuenta institucional).</li>
        <li><b>Material mandante:</b> las notas de clase tomadas en ese curso. Se transcribieron tal como fueron tomadas; cada hito indica la tanda y la página de las notas. ${nClase} de ${EVENTOS.length} hitos vienen de las notas.</li>
        <li><b>Precisiones (${nPrec}):</b> cuando una fecha o un dato de las notas no coincide con la historia documentada, la nota se conserva y se añade la corrección con su fuente.</li>
        <li><b>Complementos:</b> lo que no está en las notas se tomó de fuentes abiertas (Wikipedia, archivos históricos, prensa y estudios académicos). Cada complemento se verificó contra su fuente y cada enlace se comprobó.</li>
        <li><b>Perspectiva:</b> la de El Lugar de Su Presencia, iglesia evangélica de Bogotá: la Biblia como Palabra de Dios y autoridad, un solo Dios en tres personas, salvación por arrepentimiento y fe en Jesucristo, llenura del Espíritu Santo y dones del Espíritu activos hoy (${ext(window.CURSO.creemos, "Qué creemos")}). Las secciones "Reflexión de fe" son aplicación devocional; los hechos históricos van con su fuente.</li>
      </ul>
      <h2>Licencias</h2>
      <ul>
        <li><b>Contenido reservado a El Lugar de Su Presencia — Escuela Bíblica BEREA.</b> Los resúmenes son redacción propia; las fuentes complementarias se citan y enlazan, no se copian, y pertenecen a sus respectivos autores.</li>
        <li>Imágenes: Wikimedia Commons, solo dominio público, CC0, CC BY o CC BY-SA; conservan la licencia de sus autores. Abajo están el autor, la licencia y el enlace de cada una.</li>
        <li>Biblia: los versículos se enlazan a BibleGateway (Reina-Valera 1960, © Sociedades Bíblicas en América Latina); no se reproduce el texto bíblico salvo frases breves citadas con su referencia.</li>
        <li>Tipografías Cinzel y EB Garamond (Google Fonts, licencia SIL Open Font License).</li>
      </ul>
      <h2>Fuentes de los complementos (${todas.size})</h2>
      <ol>${[...todas.entries()].map(([u, v]) => `<li>${ext(u, esc(v.n))} — usada en: ${v.ids.map(e => `<a href="#/era/${e.era}/${e.id}">${esc(e.t)}</a>`).join(", ")}</li>`).join("")}</ol>
      <h2>Créditos de imágenes (${imgs.length})</h2>
      <div class="tabla-wrap"><table class="tabla"><thead><tr><th></th><th>Imagen</th><th>Autor</th><th>Licencia</th><th>Fuente</th></tr></thead><tbody>
        ${imgs.map(([, v]) => `<tr><td><img loading="lazy" src="${esc(v.src)}" alt=""></td><td>${esc(v.titulo)}${v.anio ? " (" + esc(v.anio) + ")" : ""}</td><td>${esc(v.autor)}</td><td>${esc(v.licencia)}</td><td>${ext(v.pagina, "Commons")}</td></tr>`).join("")}
      </tbody></table></div>
    </div>`;
  }

  function vistaNoEncontrada() { $main.innerHTML = `<div class="doc"><h1>No encontrado</h1><p><a href="#/">Volver a las eras</a></p></div>`; }

  /* ---------- Regla fija (año mientras se recorre una era) ---------- */
  let obsRegla = null;
  function reglaFija(era, evs) {
    const rf = document.getElementById("regla-fija"), marca = rf.querySelector(".rf-marca"), anio = rf.querySelector(".rf-anio");
    rf.classList.add("activa");
    const d = Math.min(era.desde, ...evs.map(e => e.a)), h = Math.max(era.hasta, ...evs.map(e => e.a));
    if (obsRegla) obsRegla.disconnect();
    obsRegla = new IntersectionObserver(ents => ents.forEach(en => {
      if (!en.isIntersecting) return;
      const e = evs.find(x => "h-" + x.id === en.target.id); if (!e) return;
      anio.textContent = e.f.length > 12 ? e.a : e.f;
      marca.style.left = ((e.a - d) / Math.max(1, h - d) * 100) + "%";
    }), { rootMargin: "-45% 0px -50% 0px" });
    $main.querySelectorAll(".hito").forEach(x => obsRegla.observe(x));
  }

  /* ---------- Revelado al hacer scroll ---------- */
  function revelar() {
    const io = new IntersectionObserver(ents => ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
    $main.querySelectorAll(".revela").forEach(x => io.observe(x));
  }

  /* ---------- Enrutador ---------- */
  function ruta() {
    const p = (location.hash || "#/").slice(2).split("/");
    document.getElementById("regla-fija").classList.remove("activa");
    document.documentElement.style.removeProperty("--era");
    let actual = "inicio";
    if (p[0] === "era") { vistaEra(p[1], p[2]); actual = ""; }
    else if (p[0] === "linea") { vistaLinea(); actual = "linea"; }
    else if (p[0] === "fuentes") { vistaFuentes(); actual = "fuentes"; }
    else if (!p[0]) vistaInicio();
    else vistaNoEncontrada();
    document.querySelectorAll(".menu a").forEach(a => { if (a.dataset.ruta === actual) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    if (!(p[0] === "era" && p[2])) window.scrollTo(0, 0);
    revelar();
    const era = p[0] === "era" && eraPorId[p[1]];
    document.title = era ? `${era.nombre} · Historia II` : "Historia II - Iglesia medieval, reformada y moderna (Materia Presencial)";
  }
  window.addEventListener("hashchange", ruta);

  /* ---------- Tema ---------- */
  const raiz = document.documentElement;
  try { const t = localStorage.getItem("tema"); if (t) raiz.dataset.theme = t; } catch (e) {}
  document.getElementById("tema").addEventListener("click", () => {
    const oscuro = raiz.dataset.theme ? raiz.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    raiz.dataset.theme = oscuro ? "light" : "dark";
    try { localStorage.setItem("tema", raiz.dataset.theme); } catch (e) {}
  });

  ruta();
})();
