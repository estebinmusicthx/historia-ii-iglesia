/* Portada de bienvenida: collage de imágenes libres, momentos clave y versículos (Reina-Valera 1909, dominio público). */
(function () {
  "use strict";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const VERSOS = [
    ["Jesucristo es el mismo ayer, y hoy, y por los siglos.", "Hebreos 13:8"],
    ["Sobre esta piedra edificaré mi iglesia; y las puertas del infierno no prevalecerán contra ella.", "Mateo 16:18"],
    ["Mas recibiréis la virtud del Espíritu Santo que vendrá sobre vosotros; y me seréis testigos… hasta lo último de la tierra.", "Hechos 1:8"],
    ["Mas el justo vivirá por la fe.", "Romanos 1:17"],
    ["Mas la palabra del Señor permanece perpetuamente.", "1 Pedro 1:25"],
    ["Porque por gracia sois salvos por la fe; y esto no de vosotros, pues es don de Dios.", "Efesios 2:8"],
    ["No con ejército, ni con fuerza, sino con mi espíritu, ha dicho Jehová de los ejércitos.", "Zacarías 4:6"],
    ["Y perseveraban en la doctrina de los apóstoles, y en la comunión, y en el partimiento del pan, y en las oraciones.", "Hechos 2:42"]
  ];
  const MOMENTOS = ["pentecostes", "nicea", "caida-roma", "coronacion-800", "cisma-1054", "cruzada-1", "benito", "hus", "constantinopla-1453", "biblia-gutenberg", "tesis", "worms", "calvino", "biblia-oso", "westfalia", "aldersgate", "azusa", "pratt", "lugar-presencia"];

  // Lo que costó que el mensaje llegara: escenas tomadas de hitos verificados de la línea.
  const ESCENAS = [
    ["c. 30", "Jerusalén · Gólgota", "«Consumado es.» (Juan 19:30)", null, "cruz"],
    ["", "El templo", "«El velo del templo se rompió en dos, de alto á bajo.» (Mateo 27:51)", null, "velo"],
    ["33", "Pentecostés", "«Y fueron todos llenos del Espíritu Santo.» (Hechos 2:4)", null, "pentecostes"],
    ["64 – 313", "La Iglesia perseguida", "Durante casi tres siglos, muchos cristianos mueren por su fe; se reúnen en secreto, hasta el Edicto de Milán (313).", null, "perseguida"],
    ["476 – 1417", "Roma", "El poder de los papas crece hasta dominar reyes e imperios.", null, "papas"],
    ["1095 – 1291", "Las Cruzadas", "Ejércitos parten hacia Jerusalén en nombre de la fe.", null, "cruzadas"],
    ["s. VI – XV", "Monasterios", "Monjes copian la Biblia a mano, letra por letra, durante siglos.", "monacato_montecassino"],
    ["1415", "Constanza", "Juan Hus muere en la hoguera por denunciar la corrupción y predicar la Palabra.", "precursores_hus"],
    ["1455", "Maguncia", "La imprenta multiplica la Biblia.", "reforma_gutenberg"],
    ["31/10/1517", "Wittenberg", "Martín Lutero publica las 95 tesis contra la venta de indulgencias: la salvación no se compra.", null, "puerta"],
    ["1536", "Inglaterra", "William Tyndale es ejecutado por traducir la Biblia al inglés.", "reforma_tyndale"],
    ["1569", "Basilea", "La Biblia llega completa al español: la Biblia del Oso.", "reforma_biblia_oso"],
    ["1856", "Bogotá", "Llega a Colombia el primer misionero presbiteriano.", "colombia_bogota_xix"],
    ["1948 – 1958", "Colombia", "La Violencia: templos quemados y creyentes evangélicos asesinados.", null],
    ["1981", "Bogotá", "Chet Bitterman, traductor de la Biblia, da su vida.", null],
    ["Hoy", "Bogotá", "Su sangre te dió redención", null, "final"]
  ];

  function recorrido(alTerminar) {
    const IMG = window.IMAGENES || {};
    const $r = document.createElement("section");
    $r.className = "recorrido"; $r.setAttribute("aria-label", "Lo que costó que el mensaje llegara");
    $r.innerHTML = `<div class="rc-fondo"></div><div class="rc-svg"></div><div class="rc-velo"></div>
      <div class="rc-intro grande">Lo que costó que el mensaje<br>llegara hasta ti…</div>
      <div class="rc-escena"><div class="rc-anio"></div><div class="rc-lugar"></div><p class="rc-texto"></p></div>
      <div class="rc-camino oculto-camino"><div class="rc-linea"><span class="rc-luz"></span></div>
        <ol>${ESCENAS.map((e, i) => `<li style="left:${(i / (ESCENAS.length - 1)) * 100}%"><span></span><small>${esc(e[0] || e[1])}</small></li>`).join("")}</ol></div>
      <button type="button" class="rc-saltar">Saltar ⏭</button>`;
    document.body.appendChild($r);
    document.body.classList.add("con-portada");
    let k = -1, t = null, fin = false;
    const $f = $r.querySelector(".rc-fondo"), $e = $r.querySelector(".rc-escena"), $luz = $r.querySelector(".rc-luz"), $li = $r.querySelectorAll(".rc-camino li");
    function terminar() { if (fin) return; fin = true; clearTimeout(t); $r.classList.add("sale"); setTimeout(() => $r.remove(), 900); alTerminar(); }
    function siguiente() {
      k++;
      if (k >= ESCENAS.length) { t = setTimeout(terminar, 1200); return; }
      const [anio, lugar, texto, img, svg] = ESCENAS[k];
      $e.classList.remove("in");
      setTimeout(() => {
        $r.querySelector(".rc-anio").textContent = anio; $r.querySelector(".rc-lugar").textContent = lugar; $r.querySelector(".rc-texto").textContent = texto;
        if (k === ESCENAS.length - 1) {
          const gotas = [21, 52, 80].map((x, i) => `<i class="rc-gota" style="left:${x}%;--d:${(1.4 + i * 0.35).toFixed(2)}s;--h:${[14, 22, 12][i]}px"></i>`).join("");
          $r.querySelector(".rc-texto").innerHTML = `<span class="rc-pre">Su sangre te dió</span><span class="rc-redencion" data-t="REDENCIÓN">REDENCIÓN${gotas}</span><cite class="rc-cita">«En el cual tenemos redención por su sangre, la remisión de pecados.» Efesios 1:7</cite>`;
        }
        const src = img && IMG[img] ? IMG[img].src.replace("/960px-", "/500px-") : "";
        $f.style.backgroundImage = src ? `url('${src}')` : "none"; $f.classList.remove("kb"); void $f.offsetWidth; $f.classList.add("kb");
        const $s = $r.querySelector(".rc-svg"); $s.innerHTML = svg && window.ESCENAS_SVG ? window.ESCENAS_SVG[svg] : ""; $r.classList.toggle("con-svg", !!svg);
        $r.classList.toggle("final", k === ESCENAS.length - 1);
        $e.classList.add("in");
        $luz.style.left = (k / (ESCENAS.length - 1)) * 100 + "%";
        $li.forEach((li, i) => li.classList.toggle("ok", i <= k));
      }, 350);
      t = setTimeout(siguiente, k === ESCENAS.length - 1 ? 5600 : (ESCENAS[k][4] === "velo" ? 4600 : ESCENAS[k][4] === "cruz" ? 4000 : ESCENAS[k][4] ? 3400 : 2400));
    }
    $r.querySelector(".rc-saltar").addEventListener("click", terminar);
    document.addEventListener("keydown", function k2(ev) { if (ev.key === "Escape") { document.removeEventListener("keydown", k2); terminar(); } });
    // 1) título grande en el centro  2) se encoge y sube  3) rayo sobre la cruz  4) aparece la línea de tiempo
    setTimeout(() => $r.querySelector(".rc-intro").classList.remove("grande"), 2600);
    setTimeout(siguiente, 3600);
    setTimeout(() => $r.querySelector(".rc-camino").classList.remove("oculto-camino"), 3600 + 350 + 1500);
  }

  function pintar() {
    const IMG = window.IMAGENES || {}, EV = Object.fromEntries((window.EVENTOS || []).map(e => [e.id, e]));
    const usadas = [...new Set((window.EVENTOS || []).map(e => e.img).filter(k => k && IMG[k]))].map(k => IMG[k]);
    const fotos = usadas.map(i => i.src.replace("/960px-", "/500px-"));
    const mezcla = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const tiles = mezcla(fotos.concat(fotos)).slice(0, 36);
    const momentos = MOMENTOS.map(id => EV[id]).filter(Boolean);
    const $p = document.createElement("section");
    $p.className = "portada"; $p.setAttribute("aria-label", "Portada");
    $p.innerHTML = `
      <div class="pt-collage" aria-hidden="true">${tiles.map((src, i) => `<div class="pt-tile" style="--i:${i};background-image:url('${esc(src)}')"></div>`).join("")}</div>
      <div class="pt-velo" aria-hidden="true"></div>
      <div class="pt-centro">
        <div class="pt-k">${esc(window.CURSO.escuela)}</div>
        <h1 class="pt-t">Historia II</h1>
        <div class="pt-s">Iglesia medieval, reformada y moderna</div>
        <div class="pt-m">(Materia Presencial)</div>
        <div class="pt-momento" aria-live="polite"><span class="pt-anio"></span><span class="pt-hito"></span></div>
        <blockquote class="pt-verso"><p></p><cite></cite></blockquote>
        <button type="button" class="pt-iniciar">Iniciar <span aria-hidden="true">→</span></button>
        <div class="pt-pie">De Pentecostés a hoy · ${(window.EVENTOS || []).length} hitos · notas de clase e investigación verificada</div>
      </div>`;
    document.body.appendChild($p);
    document.body.classList.add("con-portada");
    // Momentos y versículos que rotan
    let m = 0, v = Math.floor(Math.random() * VERSOS.length);
    const $a = $p.querySelector(".pt-anio"), $h = $p.querySelector(".pt-hito"), $vp = $p.querySelector(".pt-verso p"), $vc = $p.querySelector(".pt-verso cite");
    const ponMomento = () => { const e = momentos[m++ % momentos.length]; $p.querySelector(".pt-momento").classList.remove("in"); setTimeout(() => { $a.textContent = e.f; $h.textContent = e.t; $p.querySelector(".pt-momento").classList.add("in"); }, 250); };
    const ponVerso = () => { const [t, r] = VERSOS[v++ % VERSOS.length]; const $b = $p.querySelector(".pt-verso"); $b.classList.remove("in"); setTimeout(() => { $vp.textContent = "«" + t + "»"; $vc.textContent = r + " (RV 1909)"; $b.classList.add("in"); }, 300); };
    ponMomento(); ponVerso();
    const t1 = setInterval(ponMomento, 2600), t2 = setInterval(ponVerso, 7000);
    const cerrar = () => { clearInterval(t1); clearInterval(t2); $p.classList.add("sale"); document.body.classList.remove("con-portada"); setTimeout(() => $p.remove(), 700); window.scrollTo(0, 0); };
    $p.querySelector(".pt-iniciar").addEventListener("click", cerrar);
    document.addEventListener("keydown", function k(ev) { if (ev.key === "Escape" || ev.key === "Enter") { document.removeEventListener("keydown", k); if (document.body.contains($p)) cerrar(); } });
    $p.querySelector(".pt-iniciar").focus({ preventScroll: true });
  }
  // Solo al entrar por la página principal.
  const h = location.hash;
  const inicio = () => recorrido(pintar);
  if (!h || h === "#" || h === "#/") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inicio); else inicio();
  }
  window.mostrarPortada = pintar;
})();
