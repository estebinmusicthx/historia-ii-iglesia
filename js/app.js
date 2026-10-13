/* Línea del tiempo · Historia II. Vanilla JS, sin dependencias. Funciona con doble clic (file://) y en GitHub Pages. */
(function () {
  "use strict";
  const ERAS = window.ERAS || [], EVENTOS = (window.EVENTOS || []).slice().sort((a, b) => a.a - b.a), IMG = window.IMAGENES || {};
  const $main = document.getElementById("contenido");
  const eraPorId = Object.assign(Object.create(null), Object.fromEntries(ERAS.map(e => [e.id, e])));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Separa en renglones las enumeraciones de las notas ("1. … 2. …", "1) … 2) …").
  const fmt = s => esc(s).replace(/(^|[\s.;:])(\d{1,2})([.)])\s(?=[A-ZÁÉÍÓÚ¿¡&])/g, (m, a, n, p, i) => (i === 0 ? "" : a.trim() + "\n") + n + p + " ");
  const ext = (u, t) => `<a href="${esc(u)}" target="_blank" rel="noopener">${t}</a>`;

  const SP = window.SUPRESENCIA || { historia: [], fe: [] };
  const SPX = Object.fromEntries([...SP.historia.map(x => [x.id, { ...x, tipo: "historia" }]), ...SP.fe.map(x => [x.id, { ...x, tipo: "fe" }])]);
  EVENTOS.forEach(e => { if (SPX[e.id] && !(e.tags || []).includes("supresencia")) e.tags = ["supresencia"].concat(e.tags || []); });
  const TEMAS = window.TEMAS || [];
  TEMAS.forEach(t => t.ids.forEach(id => { const e = EVENTOS.find(x => x.id === id); if (e && !(e.tags || []).includes("t-" + t.id)) e.tags = (e.tags || []).concat("t-" + t.id); }));
  const ETIQ = { "t-musulmanes": "Los musulmanes", "t-lutero": "Martín Lutero", "t-calvinismo": "El calvinismo", "t-arminianismo": "El arminianismo", "t-corrientes": "Las nuevas corrientes", supresencia: "El Lugar de Su Presencia", colombia: "Colombia", eeuu: "Estados Unidos", avivamiento: "Avivamientos", martir: "Mártires", mision: "Misiones", biblia: "Biblia", persona: "Personas", concilio: "Concilios", iglesias: "Iglesias grandes", reflexion: "Reflexión" };

  /* ---------- Biblia: ventana con el pasaje (Reina-Valera 1909, dominio público) ---------- */
  // [nombre, número de libro]
  const LIBROS = { "Gn": ["Génesis", 1], "Éx": ["Éxodo", 2], "Sal": ["Salmos", 19], "Ez": ["Ezequiel", 26], "Hab": ["Habacuc", 35], "Zac": ["Zacarías", 38],
    "Mt": ["Mateo", 40], "Jn": ["Juan", 43], "Hch": ["Hechos", 44], "Ro": ["Romanos", 45], "1 Co": ["1 Corintios", 46], "Gá": ["Gálatas", 48], "Ef": ["Efesios", 49],
    "Fil": ["Filipenses", 50], "Col": ["Colosenses", 51], "1 Ti": ["1 Timoteo", 54], "2 Ti": ["2 Timoteo", 55], "Tit": ["Tito", 56], "Heb": ["Hebreos", 58],
    "1 P": ["1 Pedro", 60], "1 Jn": ["1 Juan", 62], "Ap": ["Apocalipsis", 66] };
  const RE_REF = /^((?:\d )?[A-Za-zÁÉÍÓÚáéíóú]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?(?:\s*[–-]\s*(\d+))?$/;
  function parseRef(ref) {
    const m = ref.trim().match(RE_REF); if (!m || !LIBROS[m[1]]) return null;
    const [nombre, n] = LIBROS[m[1]], c1 = +m[2], c2 = m[5] && !m[3] ? +m[5] : c1;
    return { nombre, n, c1, c2, v1: m[3] ? +m[3] : null, v2: m[4] ? +m[4] : (m[3] ? +m[3] : null),
      texto: `${nombre} ${m[2]}${m[3] ? ":" + m[3] + (m[4] ? "-" + m[4] : "") : ""}${c2 !== c1 ? "–" + c2 : ""}` };
  }
  const urlRVR1960 = r => `https://www.biblegateway.com/passage/?search=${encodeURIComponent(r.texto.replace("–", "-"))}&version=RVR1960`;
  function versiculo(ref) {
    return parseRef(ref) ? `<button type="button" class="vers-btn" data-ref="${esc(ref)}">${esc(ref)}</button>` : esc(ref);
  }
  // Convierte en botones las citas dentro de un texto: "(Ef 5:23; Col 1:18)".
  const RE_CITA = new RegExp(String.raw`(^|[\s(;])(` + Object.keys(LIBROS).sort((a, b) => b.length - a.length).map(k => k.replace(" ", String.raw`\s`)).join("|") + String.raw`)\s(\d+(?::\d+(?:-\d+)?)?)`, "g");
  const citas = t => esc(t).replace(RE_CITA, (m, pre, l, r) => pre + versiculo(l.replace(/\s/, " ") + " " + r));

  const cacheCap = {};
  const capitulo = (n, c) => cacheCap[n + "/" + c] || (cacheCap[n + "/" + c] = fetch(`https://api.getbible.net/v2/valera/${encodeURIComponent(n)}/${encodeURIComponent(c)}.json`, { credentials: "omit", referrerPolicy: "no-referrer" }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }));
  let $dlg = null;
  function abrirBiblia(ref) {
    const r = parseRef(ref); if (!r) return;
    if (!$dlg) {
      $dlg = document.createElement("dialog"); $dlg.className = "biblia";
      $dlg.innerHTML = `<div class="b-cab"><div><h2></h2><small>Reina-Valera 1909 · dominio público</small></div><button type="button" class="b-cerrar" aria-label="Cerrar">✕</button></div>
        <div class="b-texto" tabindex="0"></div><div class="b-pie"></div>`;
      document.body.appendChild($dlg);
      $dlg.querySelector(".b-cerrar").addEventListener("click", () => $dlg.close());
      $dlg.addEventListener("click", ev => { if (ev.target === $dlg) $dlg.close(); });
    }
    $dlg.querySelector("h2").textContent = r.texto;
    const $t = $dlg.querySelector(".b-texto"); $t.innerHTML = "<p class='b-cargando'>Cargando pasaje…</p>";
    $dlg.querySelector(".b-pie").innerHTML = `Texto: Reina-Valera 1909 (dominio público), vía ${ext("https://getbible.net/", "getbible.net")} · ${ext(urlRVR1960(r), "Leer en RVR1960 (BibleGateway)")}`;
    if (!$dlg.open) $dlg.showModal();
    const caps = []; for (let c = r.c1; c <= r.c2; c++) caps.push(c);
    Promise.all(caps.map(c => capitulo(r.n, c))).then(datos => {
      $t.innerHTML = datos.map((d, k) => {
        const vs = (Array.isArray(d && d.verses) ? d.verses : []).filter(v => r.v1 == null || (v.verse >= r.v1 && v.verse <= r.v2));
        return (caps.length > 1 ? `<h3>Capítulo ${caps[k]}</h3>` : "") + `<p>${vs.map(v => `<sup>${esc(v.verse)}</sup>${esc(String(v.text || "").trim())}`).join(" ")}</p>`;
      }).join("");
      $t.scrollTop = 0;
    }).catch(() => { $t.innerHTML = `<p>No se pudo cargar el pasaje en este momento. ${ext(urlRVR1960(r), "Ábralo en BibleGateway")}.</p>`; });
  }
  document.addEventListener("click", ev => { const b = ev.target.closest(".vers-btn"); if (b) abrirBiblia(b.dataset.ref); });

  /* ---------- Piezas ---------- */
  function figura(clave) {
    const im = clave && IMG[clave];
    if (!im) return "";
    return `<figure class="foto-hito"><img loading="lazy" src="${esc(im.src)}" alt="${esc(im.titulo)}">
      <figcaption>${esc(im.titulo)}${im.anio ? " (" + esc(im.anio) + ")" : ""}. ${esc(im.autor)} · ${esc(im.licencia)} · ${ext(im.pagina, "Wikimedia Commons")}</figcaption></figure>`;
  }
  const chipsOrigen = e => [e.clase ? '<span class="chip c-clase">Notas de clase</span>' : "", e.prec ? '<span class="chip c-prec">Precisión</span>' : "", e.comp ? '<span class="chip c-comp">Investigación</span>' : ""].join("");
  // En la tarjeta, los chips de origen son botones que resaltan su bloque.
  const botonesOrigen = e => [e.clase ? '<button type="button" class="chip c-clase" data-bloque="b-clase" aria-pressed="false">Notas de clase</button>' : "", e.prec ? '<button type="button" class="chip c-prec" data-bloque="b-prec" aria-pressed="false">Precisión</button>' : "", e.comp ? '<button type="button" class="chip c-comp" data-bloque="b-comp" aria-pressed="false">Investigación</button>' : ""].join("");

  function tarjeta(e) {
    const fig = figura(e.img);
    const fuentes = (e.fuentes || []).length ? `<div class="fuentes-hito"><b>Fuentes de la investigación:</b><ol>${e.fuentes.map(([n, u]) => `<li>${ext(u, esc(n))}</li>`).join("")}</ol></div>` : "";
    const sp = SPX[e.id];
    return `<article class="hito revela${e.clase ? "" : " solo-comp"}${sp ? " sp" : ""}" id="h-${esc(e.id)}">
      <div class="tarjeta">${sp ? `<div class="sp-banda"><b>El Lugar de Su Presencia</b> · ${sp.tipo === "historia" ? "Su historia" : "Raíces de su fe"}: ${esc(sp.porque)}</div>` : ""}
        <div class="t-cab">
          <button type="button" class="t-abrir" aria-expanded="false" aria-controls="c-${esc(e.id)}"><span class="t-fecha">${esc(e.f)}</span><h3>${esc(e.t)}</h3><span class="t-flecha" aria-hidden="true">▾</span></button>
          <div class="marcas"><div class="m-temas">${(e.tags || []).filter(t => ETIQ[t]).map(t => `<span class="chip">${ETIQ[t]}</span>`).join("")}</div><div class="m-origen">${botonesOrigen(e)}</div></div>
        </div>
        <div class="t-cuerpo${fig ? "" : " sin-foto"}" id="c-${esc(e.id)}" hidden>
          <div class="t-textos">
            ${e.clase ? `<div class="bloque b-clase"><div class="et">Notas de clase <small>Historia II · Escuela Bíblica BEREA${e.nota ? " · " + esc(e.nota) : ""}</small></div><p>${fmt(e.clase)}</p></div>` : ""}
            ${e.prec ? `<div class="bloque b-prec"><div class="et">Precisión histórica <small>la nota se mantiene; esto la corrige o aclara</small></div><p>${esc(e.prec)}</p></div>` : ""}
            ${e.comp ? `<div class="bloque b-comp"><div class="et">Investigación <small>no está en las notas · ver fuentes</small></div><p>${fmt(e.comp)}</p></div>` : ""}
            ${(e.vers || []).length ? `<div class="vers"><b>Biblia:</b> ${e.vers.map(versiculo).join(" ")}</div>` : ""}
            ${fuentes}
          </div>
          ${fig}
        </div>
      </div></article>`;
  }

  function imagenEra(era) {
    if (era.img && IMG[era.img]) return IMG[era.img].src;
    const ev = EVENTOS.find(e => e.era === era.id && e.img && IMG[e.img]);
    return ev ? IMG[ev.img].src : "";
  }
  const rango = era => `${era.desde} – ${era.id === "moderna" || era.id === "colombia" ? "hoy" : era.hasta}`;

  /* ---------- Navegación: volver y ruta ---------- */
  let rutaAnterior = null;
  const migas = partes => `<nav class="migas" aria-label="Ruta de navegación">
    <button type="button" class="volver" data-volver>← Volver</button>
    <ol><li><a href="#/">Inicio</a></li>${partes.map((p, i) => `<li>${p[1] && i < partes.length - 1 ? `<a href="${p[1]}">${esc(p[0])}</a>` : `<span aria-current="page">${esc(p[0])}</span>`}</li>`).join("")}</ol></nav>`;
  document.addEventListener("click", ev => {
    if (!ev.target.closest("[data-volver]")) return;
    if (rutaAnterior !== null) history.back(); else location.hash = "#/";
  });

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
      const tarjetaEra = era => {
        const evs = EVENTOS.filter(e => e.era === era.id), nC = evs.filter(e => e.clase).length;
        return `<a class="era-card revela" href="#/era/${era.id}" style="--c:${era.color}">
          <div class="foto" style="background-image:url('${esc(imagenEra(era))}')">${window.escudoEra ? window.escudoEra(era, "escudo-mini") : ""}<span class="num">${esc(era.n)}</span></div>
          <div class="cuerpo"><h3>${esc(era.nombre)}</h3><div class="rango">${rango(era)}</div>
          <div class="cuenta">${evs.length} hitos · <b>${nC ? nC + " de notas de clase" : "Aportes de investigación"}</b></div></div></a>`; };
      const tarjetaTema = t => {
        const evs = t.ids.map(id => EVENTOS.find(e => e.id === id)).filter(Boolean), nC = evs.filter(e => e.clase).length;
        const conImg = evs.find(e => e.img && IMG[e.img]), anios = evs.map(e => e.a).sort((x, y) => x - y);
        return `<a class="era-card tema-en-eras revela" href="#/tema/${t.id}" style="--c:${t.color}">
          <div class="foto" style="background-image:url('${esc(t.img && IMG[t.img] ? IMG[t.img].src : conImg ? IMG[conImg.img].src : "")}')">${window.escudoEra ? window.escudoEra({ id: t.icono, color: t.color, nombre: t.titulo }, "escudo-mini") : ""}<span class="num">Tema</span></div>
          <div class="cuerpo"><h3>${esc(t.titulo)}</h3><div class="rango">${anios[0]} – ${anios[anios.length - 1] >= 2026 ? "hoy" : anios[anios.length - 1]}</div>
          <div class="cuenta">${evs.length} hitos · <b>${nC} de notas de clase</b></div></div></a>`; };
      const inicioTema = t => Math.min(...t.ids.map(id => (EVENTOS.find(e => e.id === id) || { a: 9999 }).a));
      grupos += `<div class="grupo"><h2>${esc(g)}</h2></div><div class="eras">` + ERAS.filter(e => e.grupo === g).map(era =>
        tarjetaEra(era) + TEMAS.filter(t => t.despues === era.id).sort((a, b) => inicioTema(a) - inicioTema(b)).map(tarjetaTema).join("")).join("") + `</div>`;
    });
    $main.innerHTML = `
      <section class="hero hero-gran">${(() => { const imgs = [...new Set(EVENTOS.map(e => e.img).filter(k => k && IMG[k]))].map(k => IMG[k].src.replace("/960px-", "/500px-"));
        return `<div class="hero-collage" aria-hidden="true">${imgs.slice(0, 24).map((src, i) => `<span style="--i:${i};background-image:url('${esc(src)}')"></span>`).join("")}</div><div class="hero-velo" aria-hidden="true"></div><div class="hero-luz" aria-hidden="true"></div>`; })()}
        <div class="hero-txt"><div class="k">${esc(window.CURSO.escuela)}</div>
        <h1>Historia II<span>${esc(window.CURSO.subtitulo.replace(" (Materia Presencial)", ""))}</span><small class="modalidad">(Materia Presencial)</small></h1><div class="hero-verso">«Jesucristo es el mismo ayer, y hoy, y por los siglos.» <cite>Hebreos 13:8</cite></div><a class="hero-ver" href="#/linea">Recorrer la línea completa →</a></div></section>
      <h2 class="ley-t">Material de consulta de la línea de tiempo con base en:</h2>
      <section class="leyenda" aria-label="Material de la línea de tiempo">
        <div class="ley" style="--b:var(--clase-borde);--c:var(--clase)"><b>Notas de clase</b>Transcripción fiel de lo tomado en cada lección, con la referencia de la página del cuaderno.</div>
        <div class="ley" style="--b:var(--prec-borde);--c:var(--prec)"><b>Precisión</b>Aclaración con su fuente cuando un dato de las notas difiere de la historia documentada. La nota se conserva.</div>
        <div class="ley" style="--b:var(--comp-borde);--c:var(--comp)"><b>Investigación</b>Información que amplía las notas, tomada de fuentes abiertas, enlazadas y verificadas.</div>
      </section>
      <section class="regla"><h2>De Pentecostés a hoy</h2>
        <div class="regla-barra">${bloques.map(b => `<a href="${b.r}" title="${b.t} (${b.d}–${b.h === MAX ? "hoy" : b.h})" aria-label="${b.t}" style="width:${pct(b.h) - pct(b.d)}%;background:${b.c}"></a>`).join("")}</div>
        <div class="regla-marcas">${marcas.map(m => `<span style="left:${pct(m)}%">${m === MAX ? "hoy" : m}</span>`).join("")}</div>
        <p class="regla-nota">Antecedentes · Iglesia Medieval (476–1453) · Iglesia Reformada (1453–1648) · Iglesia moderna</p></section>
      ${grupos}`;
  }

  function vistaEra(id, hitoId) {
    const era = typeof id === "string" ? eraPorId[id] : null;
    if (!era) return vistaNoEncontrada();
    document.documentElement.style.setProperty("--era", era.color);
    const i = ERAS.indexOf(era), ant = ERAS[i - 1], sig = ERAS[i + 1];
    const evs = EVENTOS.filter(e => e.era === id);
    $main.innerHTML = migas([[era.grupo, "#/"], [`${era.n}: ${era.nombre}`]]) + `
      <section class="era-cab"><div class="era-tit">${window.escudoEra ? window.escudoEra(era, "escudo") : ""}<div><div class="k">${esc(era.n)}</div><h1>${esc(era.nombre)}</h1>
        <div class="rango">${rango(era)}</div><div class="grupo-n">${esc(era.grupo)}</div></div></div>
        <div class="resumenes">
          ${era.clase ? `<div class="bloque b-clase"><div class="et">Notas de clase <small>resumen de la etapa</small></div><p>${esc(era.clase)}</p></div>` : `<div class="bloque b-clase"><div class="et">Aportes de investigación</div><p>Este enfoque no hace parte de las notas de clase: es un aporte de investigación, con cada dato referenciado a su fuente.</p></div>`}
          <div class="bloque b-comp"><div class="et">Investigación</div><p>${esc(era.comp)}</p></div>
        </div>
        <div class="controles-era"><label class="filtro-era"><input type="checkbox" id="solo-clase"> Ver solo los hitos que están en las notas de clase</label>
          <span class="abrir-todo"><button type="button" data-todo="1">Abrir todos</button><button type="button" data-todo="0">Cerrar todos</button></span></div>
      </section>
      ${(window.LAMINAS || {})[id] ? `<section class="lamina" id="lamina" aria-label="Lámina interactiva"></section>` : ""}
      <div class="filtro-lamina oculto" role="status"><span></span><button type="button">Quitar filtro ✕</button></div>
      <section class="linea" id="linea">${evs.map(tarjeta).join("")}</section>
      <h2 class="seccion-t">Reflexión de fe</h2>
      <div class="bloque b-ref"><div class="et">Desde la fe de El Lugar de Su Presencia <small>${ext(window.CURSO.creemos, "ver «Qué creemos»")}</small></div><p>${citas(era.fe)}</p></div>
      ${(() => { const libros = (window.BIBLIOGRAFIA || []).filter(b => b.eras.includes(era.id)); return libros.length ? `<h2 class="seccion-t">Para profundizar</h2>
      <div class="biblio"><p class="j-ayuda">Bibliografía del curso que cubre esta era (según el alcance de cada obra):</p><ul>${libros.map(b => `<li>${esc(b.ref)}${b.nota ? ` <small>${esc(b.nota)}</small>` : ""}</li>`).join("")}</ul></div>` : ""; })()}
      <details class="desp desp-juegos">
        <summary><span>Comprueba tus conocimientos<small>Selecciona el juego de tu preferencia</small></span></summary>
        <section class="juegos" id="juegos" aria-label="Juegos de repaso"></section>
      </details>
      <nav class="nav-eras" aria-label="Eras vecinas">
        ${ant ? `<a href="#/era/${ant.id}"><small>← Anterior</small>${esc(ant.nombre)}</a>` : "<span></span>"}
        ${sig ? `<a class="sig" href="#/era/${sig.id}"><small>Siguiente →</small>${esc(sig.nombre)}</a>` : "<span></span>"}
      </nav>`;
    juegos($main.querySelector("#juegos"), era, evs);
    const $fl = $main.querySelector(".filtro-lamina");
    if ($main._filtroLamina) $main.removeEventListener("lamina-filtro", $main._filtroLamina);
    $main._filtroLamina = ev => {
      const ids = ev.detail.ids;
      $main.querySelectorAll(".hito").forEach(h => { const dentro = !ids || ids.includes(h.id.slice(2)); h.classList.toggle("fuera-filtro", !dentro); if (ids && dentro) { const c = h.querySelector(".t-cuerpo"); c.hidden = false; h.querySelector(".t-abrir").setAttribute("aria-expanded", "true"); h.classList.add("abierto", "visible"); } });
      $fl.classList.toggle("oculto", !ids);
      if (ids) $fl.querySelector("span").innerHTML = `Mostrando ${ids.length} ${ids.length === 1 ? "hito" : "hitos"} de: <b>${esc(ev.detail.nombre)}</b>`;
    };
    $main.addEventListener("lamina-filtro", $main._filtroLamina);
    $fl.querySelector("button").addEventListener("click", () => { const l = $main.querySelector("#lamina"); if (l) l.dispatchEvent(new Event("lamina-quitar")); });
    if ($main.querySelector("#lamina") && window.pintarLamina) window.pintarLamina($main.querySelector("#lamina"), id);
    $main.querySelector("#solo-clase").addEventListener("change", ev => {
      $main.querySelectorAll(".hito.solo-comp").forEach(h => h.classList.toggle("oculto", ev.target.checked));
    });
    reglaFija(era, evs);
    const abrir = (h, si) => { const b = h.querySelector(".t-abrir"), c = h.querySelector(".t-cuerpo"); b.setAttribute("aria-expanded", String(si)); c.hidden = !si; h.classList.toggle("abierto", si); };
    $main.querySelectorAll(".hito").forEach(h => {
      h.querySelector(".t-abrir").addEventListener("click", () => abrir(h, h.querySelector(".t-cuerpo").hidden));
      h.querySelectorAll(".m-origen button").forEach(b => b.addEventListener("click", () => {
        const on = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", String(on));
        abrir(h, true);
        const bl = h.querySelector("." + b.dataset.bloque);
        if (bl) { bl.classList.toggle("resaltado", on); if (on) bl.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
      }));
    });
    const estadoTodos = () => { const hs = [...$main.querySelectorAll(".hito:not(.fuera-filtro)")], ab = hs.filter(h => !h.querySelector(".t-cuerpo").hidden).length;
      const bs = $main.querySelectorAll(".controles-era .abrir-todo button");
      bs.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.todo === "1" ? ab === hs.length && hs.length > 0 : ab === 0))); };
    $main.querySelectorAll(".controles-era .abrir-todo button").forEach(b => b.addEventListener("click", () => { $main.querySelectorAll(".hito").forEach(h => abrir(h, b.dataset.todo === "1")); estadoTodos(); }));
    $main.querySelectorAll(".t-abrir").forEach(b => b.addEventListener("click", () => setTimeout(estadoTodos)));
    estadoTodos();
    if (hitoId) requestAnimationFrame(() => { const h = document.getElementById("h-" + hitoId); if (h) { abrir(h, true); h.classList.add("visible"); h.scrollIntoView({ block: "start" }); } });
  }

  /* ---------- Juegos de repaso ---------- */
  const barajar = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const NO_CLAVE = new Set(["Iglesia", "Imperio", "Concilio", "Cruzada", "Reforma", "Edicto", "Batalla", "Gran", "Santo", "Sacro", "Romano", "Las", "Los", "Una", "Del", "Para", "Como"]);
  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const MAX_INTENTOS = 3;

  function juegos($j, era, evs) {
    const enClase = evs.filter(e => e.clase);
    const base = enClase.length >= 6 ? enClase : evs; // prioriza lo visto en clase
    let puntos = 0, total = 0;
    const clave = "nota-" + era.id;
    let mejor = null; try { mejor = JSON.parse(localStorage.getItem(clave)); } catch (e) {}
    $j.innerHTML = `
      <div class="j-zona">
        <div class="j-tabs" role="tablist">
          <button type="button" role="tab" data-j="completar" aria-selected="true">Completar</button>
          <button type="button" role="tab" data-j="vf" aria-selected="false">¿Verdadero o falso?</button>
          <button type="button" role="tab" data-j="cuando" aria-selected="false">¿Cuándo fue?</button>
          <button type="button" role="tab" data-j="ordenar" aria-selected="false">Ordenar</button>
          <button type="button" role="tab" data-j="preguntas" aria-selected="false">Preguntas</button>
        </div>
        <div class="j-panel" aria-live="polite"></div>
      </div>
      <aside class="j-nota" aria-label="Nota del repaso">
        <small>Su nota</small>
        <div class="j-num">—</div>
        <div class="j-escala">sobre 5,0</div>
        <div class="j-barra"><span></span></div>
        <div class="j-det">0 preguntas respondidas</div>
        <div class="j-msg">Responda para ver su nota.</div>
        <div class="j-regla">Primer intento: 1 punto · segundo: ½ · tercero: ¼</div>
        <div class="j-mejor"></div>
        <button type="button" class="j-reiniciar">Reiniciar nota</button>
      </aside>`;
    const $p = $j.querySelector(".j-panel"), $n = $j.querySelector(".j-nota");
    const fmtN = n => n.toFixed(1).replace(".", ",");
    function pintarNota() {
      const nota = total ? 5 * puntos / total : null;
      $n.querySelector(".j-num").textContent = nota == null ? "—" : fmtN(nota);
      $n.querySelector(".j-barra span").style.width = (total ? 100 * puntos / total : 0) + "%";
      $n.querySelector(".j-det").textContent = `${total} ${total === 1 ? "pregunta respondida" : "preguntas respondidas"}`;
      $n.querySelector(".j-msg").textContent = nota == null ? "Responda para ver su nota." : nota >= 4.5 ? "¡Excelente!" : nota >= 3.5 ? "Muy bien, siga así." : nota >= 3 ? "Aprobado: repase los hitos que falló." : "A repasar: consulte los hitos sugeridos.";
      $n.className = "j-nota" + (nota == null ? "" : nota >= 3.5 ? " alta" : nota >= 3 ? " media" : " baja");
      if (total >= 5 && nota != null && (!mejor || nota > mejor.nota)) { mejor = { nota }; try { localStorage.setItem(clave, JSON.stringify(mejor)); } catch (e) {} }
      $n.querySelector(".j-mejor").textContent = mejor ? `Mejor nota en esta era: ${fmtN(mejor.nota)}` : "";
    }
    const anotar = p => { total++; puntos += p; pintarNota(); };
    $n.querySelector(".j-reiniciar").addEventListener("click", () => { puntos = 0; total = 0; pintarNota(); });
    pintarNota();

    const consultar = e => `Consulte la era <b>${esc(eraPorId[e.era].nombre)}</b>, hito ${`<a href="#/era/${e.era}/${e.id}">${esc(e.f)} · ${esc(e.t)}</a>`}.`;

    // Pregunta de opción múltiple con hasta 3 intentos.
    function opcion(it, e, onAcierto) {
      let intentos = 0;
      const maxI = Math.min(MAX_INTENTOS, it.querySelectorAll(".j-ops button").length - 1);
      const $fb = it.querySelector(".j-fb");
      it.querySelectorAll(".j-ops button").forEach(b => b.addEventListener("click", () => {
        if (it.classList.contains("hecho") || b.disabled) return;
        intentos++;
        if (b.dataset.v === it.dataset.r) {
          b.classList.add("si"); it.classList.add("hecho", "bien");
          it.querySelectorAll(".j-ops button").forEach(x => x.disabled = true);
          $fb.innerHTML = intentos === 1 ? "¡Correcto!" : `¡Correcto, al intento ${intentos}!`;
          anotar(intentos === 1 ? 1 : intentos === 2 ? .5 : .25);
          if (onAcierto) onAcierto();
        } else if (intentos >= maxI) {
          b.classList.add("no"); it.classList.add("hecho", "mal");
          it.querySelectorAll(".j-ops button").forEach(x => { x.disabled = true; if (x.dataset.v === it.dataset.r) x.classList.add("si"); });
          $fb.innerHTML = `La respuesta correcta es <b>${esc(it.dataset.r)}</b>. ${consultar(e)}`;
          anotar(0);
          if (onAcierto) onAcierto();
        } else {
          b.classList.add("no"); b.disabled = true;
          $fb.innerHTML = `No es correcto. Le quedan ${maxI - intentos} ${maxI - intentos === 1 ? "intento" : "intentos"}. Pista: ${consultar(e)}`;
        }
      }));
    }
    const otra = fn => `<button type="button" class="j-otra" data-otra="${fn}">Otra ronda</button>`;
    const enlazarOtra = fn => $p.querySelector(".j-otra").addEventListener("click", fn);

    // 1. Completar: falta una palabra clave del título del hito.
    function completar() {
      const palabras = e => e.t.split(/\s+/).map(w => w.replace(/[(),:;'"«»¿?¡!.]/g, ""));
      const esClave = (w, k) => k > 0 && w.length >= 4 && /^[A-ZÁÉÍÓÚÑ]/.test(w) && !NO_CLAVE.has(w);
      let pool = [...new Set(evs.flatMap(e => palabras(e).filter(esClave)))];
      if (pool.length < 8) pool = [...new Set(pool.concat(barajar(EVENTOS.flatMap(e => palabras(e).filter(esClave)))).slice(0, 40))]; // completa opciones con otras eras
      let items = barajar(base.filter(e => palabras(e).some(esClave))).slice(0, 5);
      if (items.length < 3) items = barajar(evs.filter(e => palabras(e).some(esClave))).slice(0, 5);
      if (!items.length) { $j.querySelector('.j-tabs button[data-j="vf"]').click(); return; }
      $p.innerHTML = `<p class="j-ayuda">Elija la palabra que completa cada hito. Tiene hasta 3 intentos.</p>` + items.map(e => {
        const ws = palabras(e), cand = ws.filter(esClave), resp = cand[Math.floor(Math.random() * cand.length)];
        const frase = esc(e.t).replace(new RegExp("(^|[^\\wÁÉÍÓÚáéíóúÑñ])" + escRe(esc(resp)) + "(?![\\wÁÉÍÓÚáéíóúÑñ])"), '$1<span class="j-hueco">______</span>');
        const ops = barajar([resp, ...barajar(pool.filter(w => w !== resp && !ws.includes(w))).slice(0, 3)]);
        return `<div class="j-item" data-id="${e.id}" data-r="${esc(resp)}"><div class="j-q"><span class="j-f">${esc(e.f)}</span> ${frase}</div>
          <div class="j-ops">${ops.map(o => `<button type="button" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div><div class="j-fb"></div></div>`;
      }).join("") + otra("completar");
      $p.querySelectorAll(".j-item").forEach(it => { const e = evs.find(x => x.id === it.dataset.id); opcion(it, e, () => { const h = it.querySelector(".j-hueco"); if (h) h.textContent = it.dataset.r; }); });
      enlazarOtra(completar);
    }
    // 2. Verdadero o falso sobre la fecha de un hito.
    function vf() {
      const fechas = [...new Set(evs.map(x => x.f).filter(f => /\d/.test(f)))];
      const items = barajar(base.filter(e => /\d/.test(e.f))).slice(0, 6).map(e => {
        const verdad = Math.random() < .5 || fechas.length < 2;
        const f = verdad ? e.f : barajar(fechas.filter(x => x !== e.f))[0];
        return { e, f, verdad };
      });
      $p.innerHTML = `<p class="j-ayuda">¿La fecha corresponde al hito? Responda verdadero o falso.</p>` + items.map(({ e, f, verdad }) =>
        `<div class="j-item" data-id="${e.id}" data-r="${verdad ? "Verdadero" : "Falso"}"><div class="j-q"><b>${esc(e.t)}</b> ocurrió en <span class="j-f">${esc(f)}</span>.</div>
          <div class="j-ops"><button type="button" data-v="Verdadero">Verdadero</button><button type="button" data-v="Falso">Falso</button></div><div class="j-fb"></div></div>`).join("") + otra("vf");
      $p.querySelectorAll(".j-item").forEach((it, k) => {
        const { e } = items[k];
        it.querySelectorAll(".j-ops button").forEach(b => b.addEventListener("click", () => {
          if (it.classList.contains("hecho")) return;
          const bien = b.dataset.v === it.dataset.r;
          it.classList.add("hecho", bien ? "bien" : "mal"); b.classList.add(bien ? "si" : "no");
          it.querySelectorAll(".j-ops button").forEach(x => x.disabled = true);
          it.querySelector(".j-fb").innerHTML = bien ? "¡Correcto!" : `Es <b>${it.dataset.r.toLowerCase()}</b>: la fecha correcta es ${esc(e.f)}. ${consultar(e)}`;
          anotar(bien ? 1 : 0);
        }));
      });
      enlazarOtra(vf);
    }
    // 3. ¿Cuándo fue? Elegir la fecha correcta.
    function cuando() {
      const items = barajar(base).slice(0, 5);
      $p.innerHTML = `<p class="j-ayuda">¿En qué fecha ocurrió cada hito? Tiene hasta 3 intentos.</p>` + items.map(e => {
        const ops = barajar([e.f, ...barajar([...new Set(evs.map(x => x.f).filter(f => f !== e.f && /\d/.test(f)))]).slice(0, 3)]);
        return `<div class="j-item" data-id="${e.id}" data-r="${esc(e.f)}"><div class="j-q">${esc(e.t)}</div>
          <div class="j-ops">${ops.map(o => `<button type="button" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div><div class="j-fb"></div></div>`;
      }).join("") + otra("cuando");
      $p.querySelectorAll(".j-item").forEach(it => opcion(it, evs.find(x => x.id === it.dataset.id)));
      enlazarOtra(cuando);
    }
    // 4. Ordenar: tocar los hitos del más antiguo al más reciente.
    function ordenar() {
      const elegidos = [], usados = new Set();
      for (const e of barajar(base)) { if (!usados.has(e.a)) { usados.add(e.a); elegidos.push(e); } if (elegidos.length === 5) break; }
      const correcto = elegidos.slice().sort((a, b) => a.a - b.a).map(e => e.id);
      const sel = [];
      $p.innerHTML = `<p class="j-ayuda">Toque los hitos en orden, del más antiguo al más reciente.</p>
        <div class="j-orden">${barajar(elegidos).map(e => `<button type="button" data-id="${e.id}"><span class="j-pos"></span>${esc(e.t)}</button>`).join("")}</div>
        <div class="j-fb"></div>` + otra("ordenar");
      $p.querySelectorAll(".j-orden button").forEach(b => b.addEventListener("click", () => {
        if (b.disabled) return; sel.push(b.dataset.id); b.disabled = true; b.querySelector(".j-pos").textContent = sel.length;
        if (sel.length < correcto.length) return;
        const malos = [];
        sel.forEach((id, k) => { const bb = $p.querySelector(`.j-orden button[data-id="${id}"]`), bien = id === correcto[k]; bb.classList.add(bien ? "si" : "no"); if (!bien) malos.push(id); anotar(bien ? 1 : 0); });
        $p.querySelector(".j-fb").innerHTML = `<b>${correcto.length - malos.length} de ${correcto.length} en su lugar.</b><ol class="j-correcto">` +
          correcto.map(id => { const e = evs.find(x => x.id === id); return `<li${malos.includes(id) ? ' class="j-fallo"' : ""}><a href="#/era/${e.era}/${e.id}">${esc(e.f)} · ${esc(e.t)}</a></li>`; }).join("") + "</ol>" +
          (malos.length ? "Revise los hitos marcados para ubicarlos mejor en el tiempo." : "¡Orden perfecto!");
      }));
      enlazarOtra(ordenar);
    }
    // 5. Preguntas abiertas: piense, voltee y califíquese.
    function preguntas() {
      $p.innerHTML = `<p class="j-ayuda">Piense la respuesta, voltee la tarjeta y califíquese con honestidad.</p><div class="repaso">${era.repaso.map((q, k) => `<div class="carta"><button type="button" class="j-voltear" aria-label="Pregunta ${k + 1}: ${esc(q.p)}. Toque para ver la respuesta.">
        <span class="cara"><span>${esc(q.p)}</span><small>Toque para ver la respuesta</small></span>
        <span class="cara atras"><span>${esc(q.r)}</span><small>Respuesta</small></span></button>
        <div class="j-auto"><button type="button" data-v="1">✓ La sabía</button><button type="button" data-v="0">✗ No la sabía</button></div></div>`).join("")}</div>`;
      $p.querySelectorAll(".carta").forEach(c => {
        c.querySelector(".j-voltear").addEventListener("click", () => c.classList.toggle("girada"));
        c.querySelectorAll(".j-auto button").forEach(b => b.addEventListener("click", () => { if (c.classList.contains("calificada")) return; c.classList.add("calificada", b.dataset.v === "1" ? "bien" : "mal", "girada"); anotar(b.dataset.v === "1" ? 1 : 0); }));
      });
    }
    const J = { completar, vf, cuando, ordenar, preguntas };
    $j.querySelectorAll(".j-tabs button").forEach(t => t.addEventListener("click", () => {
      $j.querySelectorAll(".j-tabs button").forEach(x => x.setAttribute("aria-selected", String(x === t))); J[t.dataset.j]();
    }));
    completar();
  }

  function spSeccion() { const EVI = Object.fromEntries(EVENTOS.map(e => [e.id, e])); const fila = x => { const e = EVI[x.id]; return e ? `<li><a href="#/era/${e.era}/${e.id}"><span class="sp-f">${esc(e.f)}</span><span><b>${esc(e.t)}</b><small>${esc(x.porque)}</small></span></a></li>` : ""; };
        return `<section class="sp-portada" aria-label="El Lugar de Su Presencia en esta historia">
        <div class="sp-cab"><div class="sp-sello">✦</div><div><h2>El Lugar de Su Presencia en esta historia</h2><p>Este trabajo es para la Escuela Bíblica BEREA. Aquí están los hitos de la propia iglesia y aquellos donde nace o se recupera lo que ella confiesa (${ext(window.CURSO.creemos, "Qué creemos")}).</p></div></div>
        <div class="sp-cols"><div><h3>Su historia</h3><ol>${SP.historia.map(fila).join("")}</ol></div><div><h3>Raíces de su fe</h3><ol>${SP.fe.map(fila).join("")}</ol></div></div>
        <button type="button" class="sp-todo">Filtrar la línea por estos hitos ↓</button></section>`; }

  let temaInicial = null;
  document.addEventListener("click", ev => { const a = ev.target.closest("[data-tema]"); if (a) temaInicial = a.dataset.tema; });
  function vistaLinea() {
    const estado = { q: "", era: "", tag: "", soloClase: false };
    const romano = n => { const v = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]; let r = ""; for (const [a, s] of v) while (n >= a) { r += s; n -= a; } return r; };
    const nombreEra = e => e.n.startsWith("Etapa") ? e.n + ": " + e.nombre : e.nombre;
    $main.innerHTML = migas([["Línea completa"]]) + `<div class="doc"><h1>Línea completa</h1><p>Todos los hitos en orden cronológico, de Pentecostés a hoy. Busque por palabra o use los filtros.</p></div>
      <div class="filtros">
        <input class="buscar" type="search" placeholder="Buscar: Lutero, Nicea, Bogotá, avivamiento…" aria-label="Buscar en la línea del tiempo">
        <div class="f-desp">
          <details class="f-menu" id="f-era"><summary>Era: <b>Todas</b></summary>
            <div class="f-ops"><button type="button" aria-pressed="true" data-v="" data-n="Todas">Todas las eras</button>${ERAS.map(e => `<button type="button" aria-pressed="false" data-v="${e.id}" data-n="${esc(e.nombre)}" style="--c:${e.color}"><i></i>${esc(nombreEra(e))}</button>`).join("")}</div></details>
          <details class="f-menu" id="f-tag"><summary>Tema: <b>Todos</b></summary>
            <div class="f-ops"><button type="button" aria-pressed="true" data-v="" data-n="Todos">Todos los temas</button>${Object.entries(ETIQ).map(([k, v]) => `<button type="button" aria-pressed="false" data-v="${k}" data-n="${v}">${v}</button>`).join("")}<button type="button" aria-pressed="false" data-v="__clase" data-n="Solo notas de clase">Solo notas de clase</button></div></details>
          <span class="contador" aria-live="polite"></span>
        </div>
      </div><div class="lt"></div>`;
    const $l = $main.querySelector(".lt"), $c = $main.querySelector(".contador");
    const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    function pintar() {
      const q = norm(estado.q);
      const r = EVENTOS.filter(e => (!estado.era || e.era === estado.era) && (!estado.tag || (e.tags || []).includes(estado.tag)) && (!estado.soloClase || e.clase) &&
        (!q || norm([e.t, e.f, e.clase, e.comp, e.prec].join(" ")).includes(q)));
      $c.textContent = `${r.length} de ${EVENTOS.length} hitos`;
      if (!r.length) { $l.innerHTML = `<p class="lt-vacio">No hay resultados.</p>`; return; }
      let html = "", siglo = null, lado = 0;
      r.forEach(e => {
        const era = eraPorId[e.era], s = Math.max(1, Math.ceil(e.a / 100));
        if (s !== siglo) { siglo = s; html += `<div class="lt-siglo"><span>Siglo ${romano(s)}</span></div>`; }
        if (e.id === "mayflower" && !estado.era && !estado.tag && !q) html += `<button type="button" class="lt-tema lt-hilo revela" data-hilo="eeuu" style="--c:#2e5e8e">
            <span class="lt-tema-t">Estados Unidos: de las colonias a su influencia en el mundo</span><span class="lt-tema-p">De los puritanos del Mayflower (1620) a los Grandes Despertares, el metodismo americano, el movimiento de santidad y la calle Azusa; después, sus misioneros llegan a América Latina y a Colombia.</span>
            <span class="lt-tema-ir">Ver solo este recorrido · ${EVENTOS.filter(x => (x.tags || []).includes("eeuu")).length} hitos →</span></button>`;
        const tm = TEMAS.find(t => t.ancla === e.id);
        if (tm && !estado.era && !q) { const n = tm.ids.filter(id => EVENTOS.some(x => x.id === id)).length;
          html += `<a class="lt-tema revela" href="#/tema/${tm.id}" style="--c:${tm.color}">${window.escudoEra ? window.escudoEra({ id: tm.icono, color: tm.color, nombre: tm.titulo }, "escudo-tema") : ""}
            <span class="lt-tema-t">${esc(tm.titulo)}</span><span class="lt-tema-p">${esc(tm.clase.split(". ").slice(0, 2).join(". ").replace(/\.?$/, "."))}</span>
            <span class="lt-tema-ir">Ver todo el tema · ${n} hitos →</span></a>`; }
        const im = e.img && IMG[e.img];
        if (e.id === "lugar-presencia") {
          html += `<button type="button" class="lt-estrella revela" aria-expanded="false" aria-controls="sp-panel">
            <span class="lt-estrella-sello" aria-hidden="true">✦</span>
            <span class="lt-estrella-k">${esc(e.f)} · Bogotá</span>
            <span class="lt-estrella-t">El Lugar de Su Presencia</span>
            <span class="lt-estrella-p">Andrés y Rocío Corson inician la iglesia en una sala prestada; crece con la adoración de Su Presencia y llega a varias ciudades y países.</span>
            <span class="lt-estrella-ir">Ver su lugar en esta historia ▾</span></button>
            <div id="sp-panel" class="sp-panel" hidden>${spSeccion()}<a class="sp-hito" href="#/era/${e.era}/${e.id}">Abrir el hito de El Lugar de Su Presencia →</a></div>`;
          return;
        }
        html += `<a class="lt-item revela ${lado++ % 2 ? "der" : "izq"}${SPX[e.id] ? " sp" : ""}" href="#/era/${e.era}/${e.id}" style="--c:${era.color}">
          <span class="lt-punto" aria-hidden="true"></span>
          <span class="lt-tarjeta">${im ? `<img loading="lazy" src="${esc(im.src)}" alt="">` : ""}
            <span class="lt-txt"><span class="lt-f">${esc(e.f)}</span><span class="lt-t">${esc(e.t)}</span>
            <span class="lt-meta"><span class="lt-era">${esc(era.nombre)}</span>${chipsOrigen(e)}</span></span></span></a>`;
      });
      html += `<div class="lt-fin revela">
        <span class="lt-fin-linea" aria-hidden="true"></span>
        <div class="lt-fin-k">Hechos 29</div>
        <div class="lt-fin-t">La historia se sigue escribiendo.</div>
        <div class="lt-fin-p">Su obra con la Iglesia aún no ha terminado.</div>
        <blockquote class="lt-fin-v">«El que comenzó en vosotros la buena obra, la perfeccionará hasta el día de Jesucristo.» <cite>Filipenses 1:6</cite></blockquote>
        <small class="lt-fin-n">El libro de Hechos tiene 28 capítulos; el capítulo 29 lo sigue escribiendo la Iglesia hoy.</small></div>`;
      html += `<div class="lt-venida revela">
        <span class="lt-venida-linea" aria-hidden="true"></span>
        <span class="lt-venida-luz" aria-hidden="true"></span>
        <div class="lt-venida-k">El final de la línea</div>
        <div class="lt-venida-t">II Venida de Cristo</div>
        <blockquote class="lt-venida-v">«Este mismo Jesús que ha sido tomado desde vosotros arriba en el cielo, así vendrá como le habéis visto ir al cielo.» <cite>Hechos 1:11</cite></blockquote>
        <div class="lt-venida-m">«Ciertamente, vengo en breve. Amén, sea así. Ven, Señor Jesús.» <cite>Apocalipsis 22:20</cite></div></div>`;
      $l.innerHTML = html;
      const $est = $l.querySelector(".lt-estrella");
      if ($est) {
        const $pan = $l.querySelector("#sp-panel");
        $est.addEventListener("click", () => { const abrir = $pan.hidden; $pan.hidden = !abrir; $est.setAttribute("aria-expanded", String(abrir));
          $est.querySelector(".lt-estrella-ir").textContent = abrir ? "Cerrar ▴" : "Ver su lugar en esta historia ▾"; if (abrir) $pan.scrollIntoView({ block: "nearest", behavior: "smooth" }); });
        const $sb = $pan.querySelector(".sp-todo");
        if ($sb) $sb.addEventListener("click", () => { const b = $main.querySelector('#f-tag .f-ops button[data-v="supresencia"]'); if (b) b.click(); $main.querySelector(".filtros").scrollIntoView({ behavior: "smooth" }); });
      }
      revelar();
    }
    $main.querySelector(".buscar").addEventListener("input", ev => { estado.q = ev.target.value; pintar(); });
    function menu(sel, cb) {
      const d = $main.querySelector(sel);
      d.addEventListener("click", ev => { const b = ev.target.closest(".f-ops button"); if (!b) return;
        d.querySelectorAll(".f-ops button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        d.querySelector("summary b").textContent = b.dataset.n; d.open = false; cb(b.dataset.v); pintar(); });
    }
    menu("#f-era", v => estado.era = v);
    if (!$main.dataset.escuchaHilo) $main.dataset.escuchaHilo = "1", $main.addEventListener("click", ev => { const h = ev.target.closest("[data-hilo]"); if (!h) return; const b = $main.querySelector(`#f-tag .f-ops button[data-v="${CSS.escape(h.dataset.hilo)}"]`); if (b) b.click(); setTimeout(() => { const f = $main.querySelector(".filtros"); if (f) f.scrollIntoView({ behavior: "smooth" }); }, 60); });
    menu("#f-tag", v => { estado.soloClase = v === "__clase"; estado.tag = v === "__clase" ? "" : v; });
    if (temaInicial) { const b = $main.querySelector(`#f-tag .f-ops button[data-v="${CSS.escape(temaInicial)}"]`); if (b) b.click(); temaInicial = null; }
    // cerrar un menú al abrir el otro
    $main.querySelectorAll(".f-menu").forEach(d => d.addEventListener("toggle", () => { if (d.open) $main.querySelectorAll(".f-menu").forEach(o => { if (o !== d) o.open = false; }); }));
    pintar();
  }


  function vistaTema(id) {
    const t = TEMAS.find(x => x.id === id); if (!t) return vistaNoEncontrada();
    const evs = t.ids.map(i => EVENTOS.find(e => e.id === i)).filter(Boolean).sort((a, b) => a.a - b.a);
    document.documentElement.style.setProperty("--era", t.color);
    $main.innerHTML = migas([["Línea completa", "#/linea"], [t.titulo]]) + `
      <section class="era-cab"><div class="era-tit">${window.escudoEra ? window.escudoEra({ id: t.icono, color: t.color, nombre: t.titulo }, "escudo") : ""}<div><div class="k">Tema del curso</div><h1>${esc(t.titulo)}</h1>
        <div class="rango">${esc(evs[0] ? evs[0].f : "")} – ${esc(evs.length ? evs[evs.length - 1].f : "")}</div><div class="grupo-n">${evs.length} hitos de distintas eras</div></div></div>
        <div class="resumenes" style="grid-template-columns:1fr"><div class="bloque b-clase"><div class="et">Notas de clase <small>síntesis del tema</small></div><p>${esc(t.clase)}</p></div></div>
        <div class="controles-era"><span></span><span class="abrir-todo"><button type="button" data-todo="1">Abrir todos</button><button type="button" data-todo="0">Cerrar todos</button></span></div>
      </section>
      <section class="linea">${evs.map(e => tarjeta(e).replace('<div class="t-cab">', `<div class="t-cab"><div class="tema-era">${esc(eraPorId[e.era].nombre)}</div>`)).join("")}</section>`;
    const abrir = (h, si) => { const b = h.querySelector(".t-abrir"), c = h.querySelector(".t-cuerpo"); b.setAttribute("aria-expanded", String(si)); c.hidden = !si; h.classList.toggle("abierto", si); };
    $main.querySelectorAll(".hito").forEach(h => { h.querySelector(".t-abrir").addEventListener("click", () => abrir(h, h.querySelector(".t-cuerpo").hidden));
      h.querySelectorAll(".m-origen button").forEach(b => b.addEventListener("click", () => { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", String(on)); abrir(h, true); const bl = h.querySelector("." + b.dataset.bloque); if (bl) bl.classList.toggle("resaltado", on); })); });
    $main.querySelectorAll(".abrir-todo button").forEach(b => b.addEventListener("click", () => $main.querySelectorAll(".hito").forEach(h => abrir(h, b.dataset.todo === "1"))));
  }

  function vistaGlosario() {
    const G = (window.GLOSARIO || []).slice().sort((a, b) => a.t.localeCompare(b.t, "es"));
    const EVI = Object.fromEntries(EVENTOS.map(e => [e.id, e]));
    const letras = [...new Set(G.map(g => g.t[0].toUpperCase()))];
    $main.innerHTML = migas([["Glosario"]]) + `<div class="doc"><h1>Conceptos clave</h1><p>Glosario entregado con el material del curso. Cada concepto enlaza al hito donde se trata en la línea del tiempo.</p></div>
      <div class="filtros"><input class="buscar" type="search" placeholder="Buscar un concepto…" aria-label="Buscar en el glosario">
        <div class="chips">${letras.map(l => `<button type="button" data-l="${l}">${l}</button>`).join("")}</div></div>
      <div class="glosario">${G.map(g => { const e = g.h && EVI[g.h]; return `<div class="g-item" data-letra="${esc(g.t[0].toUpperCase())}" data-txt="${esc((g.t + " " + g.d).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase())}">
        <div class="g-giro">
          <div class="g-cara g-frente"><span class="g-term">${esc(g.t)}</span><small>Toque para ver el significado</small></div>
          <div class="g-cara g-reves"><span class="g-term-mini">${esc(g.t)}</span><p>${citas(g.d)}</p>
            ${g.prec ? `<div class="bloque b-prec"><div class="et">Precisión</div><p>${esc(g.prec)} ${g.fuente ? ext(g.fuente[1], esc(g.fuente[0])) : ""}</p></div>` : ""}
            ${g.v ? `<div class="vers"><b>Biblia:</b> ${versiculo(g.v)}</div>` : ""}
            ${e ? `<a class="g-hito" href="#/era/${e.era}/${e.id}">Ver en la línea: ${esc(e.f)} · ${esc(e.t)} →</a>` : ""}
            <small class="g-volver">↺ Toque para voltear</small></div>
        </div></div>`; }).join("")}</div>`;
    const $b = $main.querySelector(".buscar");
    $b.addEventListener("input", () => { const q = $b.value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
      $main.querySelectorAll(".g-item").forEach(x => x.classList.toggle("oculto", !!q && !x.dataset.txt.includes(q))); });
    $main.querySelectorAll(".chips button").forEach(b => b.addEventListener("click", () => { const x = $main.querySelector(`.g-item[data-letra="${b.dataset.l}"]:not(.oculto)`); if (x) x.scrollIntoView({ block: "start", behavior: "smooth" }); }));
    $main.querySelectorAll(".g-item").forEach(it => {
      it.tabIndex = 0; it.setAttribute("role", "button"); it.setAttribute("aria-label", it.querySelector(".g-term").textContent + ": ver el significado");
      const girar = () => it.classList.toggle("girada");
      it.addEventListener("click", ev => { if (ev.target.closest("a, .vers-btn")) return; girar(); });
      it.addEventListener("keydown", ev => { if ((ev.key === "Enter" || ev.key === " ") && ev.target === it) { ev.preventDefault(); girar(); } });
    });
  }

  function vistaFuentes() {
    const todas = new Map();
    EVENTOS.forEach(e => (e.fuentes || []).forEach(([n, u]) => { if (!todas.has(u)) todas.set(u, { n, ids: [] }); todas.get(u).ids.push(e); }));
    const usadas = new Set(EVENTOS.map(e => e.img).concat(ERAS.map(e => e.img), TEMAS.map(t => t.img)).filter(Boolean));
    const imgs = Object.entries(IMG).filter(([k, v]) => v && usadas.has(k));
    const nClase = EVENTOS.filter(e => e.clase).length, nPrec = EVENTOS.filter(e => e.prec).length;
    $main.innerHTML = migas([["Fuentes y créditos"]]) + `<div class="doc">
      <h1>Fuentes y créditos</h1>
      <h2>Cómo se construyó</h2>
      <ul>
        <li><b>Curso:</b> ${esc(window.CURSO.titulo)}. ${esc(window.CURSO.escuela)}. Docente: ${esc(window.CURSO.docente)}. Más referencia: ${ext(window.CURSO.url, "sitio del curso")} (acceso con cuenta institucional).</li>
        <li><b>Material mandante:</b> las notas de clase tomadas en ese curso. Se transcribieron tal como fueron tomadas; cada hito indica la tanda y la página de las notas. ${nClase} de ${EVENTOS.length} hitos vienen de las notas.</li>
        <li><b>Precisiones (${nPrec}):</b> cuando una fecha o un dato de las notas no coincide con la historia documentada, la nota se conserva y se añade la corrección con su fuente.</li>
        <li><b>Investigación:</b> lo que no está en las notas se tomó de fuentes abiertas (Wikipedia, archivos históricos, prensa y estudios académicos). Cada dato de investigación se verificó contra su fuente y cada enlace se comprobó.</li>
        <li><b>Perspectiva:</b> la de El Lugar de Su Presencia, iglesia evangélica de Bogotá: la Biblia como Palabra de Dios y autoridad, un solo Dios en tres personas, salvación por arrepentimiento y fe en Jesucristo, llenura del Espíritu Santo y dones del Espíritu activos hoy (${ext(window.CURSO.creemos, "Qué creemos")}). Las secciones "Reflexión de fe" son aplicación devocional; los hechos históricos van con su fuente.</li>
      </ul>
      <h2>Licencias</h2>
      <ul>
        <li><b>Contenido reservado a El Lugar de Su Presencia — Escuela Bíblica BEREA.</b> Los resúmenes son redacción propia; las fuentes complementarias se citan y enlazan, no se copian, y pertenecen a sus respectivos autores.</li>
        <li>Imágenes: Wikimedia Commons, solo dominio público, CC0, CC BY o CC BY-SA; conservan la licencia de sus autores. Abajo están el autor, la licencia y el enlace de cada una.</li>
        <li>Biblia: al hacer clic en una cita se abre el pasaje en la Reina-Valera 1909 (dominio público), servido por ${ext("https://getbible.net/", "getbible.net")}; cada ventana enlaza también a la Reina-Valera 1960 en BibleGateway (© Sociedades Bíblicas en América Latina), cuyo texto no se reproduce.</li>
        <li>Mapas: datos geográficos de ${ext("https://www.naturalearthdata.com/", "Natural Earth")} (dominio público), vía world-atlas; dibujados con las librerías d3-geo y topojson-client (licencia ISC). Las rutas son aproximadas y resumen hitos ya verificados.</li>
        <li>Tipografías Cinzel, EB Garamond e IM Fell English (Google Fonts, licencia SIL Open Font License). El fondo muestra palabras de Jesús en griego koiné (texto del Nuevo Testamento griego) y en latín (Vulgata), ambos de dominio público.</li>
      </ul>
      <h2>Bibliografía del curso</h2>
      <p>Obras indicadas en la materia. Tienen derechos de sus autores y editoriales: se citan como referencia y no se reproducen.</p>
      <ul class="biblio-lista">${(window.BIBLIOGRAFIA || []).map(b => `<li>${esc(b.ref)} <small>— ${esc(b.alcance)}${b.nota ? " " + esc(b.nota) : ""}</small></li>`).join("")}</ul>
      <h2>Fuentes de la investigación (${todas.size})</h2>
      <ol>${[...todas.entries()].map(([u, v]) => `<li>${ext(u, esc(v.n))} — usada en: ${v.ids.map(e => `<a href="#/era/${e.era}/${e.id}">${esc(e.t)}</a>`).join(", ")}</li>`).join("")}</ol>
      <h2>Créditos de imágenes (${imgs.length})</h2>
      <div class="tabla-wrap"><table class="tabla"><thead><tr><th></th><th>Imagen</th><th>Autor</th><th>Licencia</th><th>Fuente</th></tr></thead><tbody>
        ${imgs.map(([, v]) => `<tr><td><img loading="lazy" src="${esc(v.src)}" alt=""></td><td>${esc(v.titulo)}${v.anio ? " (" + esc(v.anio) + ")" : ""}</td><td>${esc(v.autor)}</td><td>${esc(v.licencia)}</td><td>${ext(v.pagina, "Commons")}</td></tr>`).join("")}
      </tbody></table></div>
    </div>`;
    // Cada sección (h2 + su contenido) queda como desplegable; la primera abierta.
    const doc = $main.querySelector(".doc");
    [...doc.querySelectorAll(":scope > h2")].forEach((h, k) => {
      const d = document.createElement("details"); d.className = "desp";
      const sm = document.createElement("summary"); sm.innerHTML = h.innerHTML; d.appendChild(sm);
      h.replaceWith(d);
      while (d.nextSibling && !(d.nextSibling.nodeType === 1 && d.nextSibling.tagName === "H2")) d.appendChild(d.nextSibling);
    });
    const ctl = document.createElement("div"); ctl.className = "abrir-todo desp-ctl";
    ctl.innerHTML = '<button type="button" data-todo="1">Abrir todo</button><button type="button" data-todo="0">Cerrar todo</button>';
    doc.querySelector("h1").after(ctl);
    const estadoDesp = () => { const ds = [...doc.querySelectorAll("details.desp")], abiertos = ds.filter(d => d.open).length;
      ctl.querySelector('[data-todo="1"]').setAttribute("aria-pressed", String(abiertos === ds.length));
      ctl.querySelector('[data-todo="0"]').setAttribute("aria-pressed", String(abiertos === 0)); };
    ctl.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { doc.querySelectorAll("details.desp").forEach(d => d.open = b.dataset.todo === "1"); estadoDesp(); }));
    doc.querySelectorAll("details.desp").forEach(d => d.addEventListener("toggle", estadoDesp));
    estadoDesp();
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
    if ($dlg && $dlg.open) $dlg.close();
    document.getElementById("regla-fija").classList.remove("activa");
    document.documentElement.style.removeProperty("--era");
    let actual = "inicio";
    if (p[0] === "era") { vistaEra(p[1], p[2]); actual = ""; }
    else if (p[0] === "linea") { vistaLinea(); actual = "linea"; }
    else if (p[0] === "fuentes") { vistaFuentes(); actual = "fuentes"; }
    else if (p[0] === "glosario") { vistaGlosario(); actual = "glosario"; }
    else if (p[0] === "tema") { vistaTema(p[1]); actual = ""; }
    else if (!p[0]) vistaInicio();
    else vistaNoEncontrada();
    document.querySelectorAll(".menu a").forEach(a => { if (a.dataset.ruta === actual) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    if (!(p[0] === "era" && p[2])) window.scrollTo(0, 0);
    revelar();
    const era = p[0] === "era" && eraPorId[p[1]];
    document.title = era ? `${era.nombre} · Historia II` : "Historia II - Iglesia medieval, reformada y moderna (Materia Presencial)";
  }
  window.addEventListener("hashchange", ev => { rutaAnterior = ev.oldURL; ruta(); });

  /* ---------- Fondo: palabras de Jesús en griego koiné y en latín (Vulgata), dominio público, muy desvanecidas ---------- */
  (function fondoPalabras() {
    const V = [
      ["Ἐγώ εἰμι ἡ ὁδὸς καὶ ἡ ἀλήθεια καὶ ἡ ζωή", "el"], ["Ego sum via, et veritas, et vita.", "la"],
      ["Τετέλεσται", "el"], ["Consummatum est.", "la"],
      ["Ἐγώ εἰμι τὸ φῶς τοῦ κόσμου", "el"], ["Ego sum lux mundi.", "la"],
      ["Ἐγώ εἰμι ἡ ἀνάστασις καὶ ἡ ζωή", "el"], ["Ego sum resurrectio et vita.", "la"],
      ["Δεῦτε πρός με πάντες οἱ κοπιῶντες καὶ πεφορτισμένοι, κἀγὼ ἀναπαύσω ὑμᾶς", "el"], ["Venite ad me omnes qui laboratis et onerati estis, et ego reficiam vos.", "la"],
      ["ἵνα ἀγαπᾶτε ἀλλήλους", "el"], ["Ut diligatis invicem.", "la"],
      ["Ἐγώ εἰμι ὁ ἄρτος τῆς ζωῆς", "el"], ["Ego sum panis vitae.", "la"],
      ["ἐπὶ ταύτῃ τῇ πέτρᾳ οἰκοδομήσω μου τὴν ἐκκλησίαν", "el"], ["Super hanc petram aedificabo ecclesiam meam.", "la"],
      ["πορευθέντες μαθητεύσατε πάντα τὰ ἔθνη", "el"], ["Euntes ergo docete omnes gentes.", "la"]
    ];
    const f = document.createElement("div"); f.className = "fondo-latin"; f.setAttribute("aria-hidden", "true");
    let html = "";
    for (let i = 0; i < 44; i++) { const [t, l] = V[(i * 7) % V.length], z = [22, 28, 34, 26, 38][i % 5], x = (i * 37) % 60 - 10;
      html += `<p lang="${l}" class="fl-${l}" style="font-size:${z}px;margin-left:${x}%;--r:${((i % 3) - 1) * .6}deg">${t}</p>`; }
    f.innerHTML = html; document.body.prepend(f);
  })();

  /* ---------- Tema ---------- */
  const raiz = document.documentElement;
  try { const t = localStorage.getItem("tema"); if (t) raiz.dataset.theme = t; } catch (e) {}
  document.getElementById("tema").addEventListener("click", () => {
    const oscuro = raiz.dataset.theme ? raiz.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    raiz.dataset.theme = oscuro ? "light" : "dark";
    try { localStorage.setItem("tema", raiz.dataset.theme); } catch (e) {}
  });

  const $subir = document.createElement("button");
  $subir.type = "button"; $subir.className = "subir"; $subir.setAttribute("aria-label", "Subir al inicio de la página"); $subir.textContent = "↑";
  document.body.appendChild($subir);
  $subir.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => $subir.classList.toggle("visible", scrollY > 700), { passive: true });

  ruta();
})();
