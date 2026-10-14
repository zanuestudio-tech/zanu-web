/* ==========================================================
   zanu startup — interacciones
   Editá estos datos antes de publicar:
   ========================================================== */
const ZANU = {
  platformUrl: "", // link a la plataforma de entrenadores. Mientras esté vacío, los botones de la demo abren WhatsApp
  email: "zanuestudio@gmail.com",                                     // email de contacto
  whatsapp: "5491153389320",                                  // número con código de país, sin + ni espacios (Lichi)
  whatsappMessage: "¡Hola, Lichi! Me interesa probar la fase demo de la plataforma para entrenadores.", // mensaje que aparece escrito al abrir WhatsApp
  instagram: "zanuestudio"                                    // usuario sin @
};

(() => {
  const doc = document.documentElement;
  doc.classList.add("js");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Datos dinámicos (links) ---------- */
  document.querySelectorAll("[data-link]").forEach(el => {
    const k = el.dataset.link;
    if (k === "platform") { el.href = ZANU.platformUrl || ("https://wa.me/" + ZANU.whatsapp + "?text=" + encodeURIComponent(ZANU.whatsappMessage)); el.target = "_blank"; el.rel = "noopener"; }
    if (k === "email") el.href = "mailto:" + ZANU.email;
    if (k === "whatsapp") { el.href = "https://wa.me/" + ZANU.whatsapp + "?text=" + encodeURIComponent(ZANU.whatsappMessage); el.target = "_blank"; el.rel = "noopener"; }
    if (k === "instagram") { el.href = "https://instagram.com/" + ZANU.instagram; el.target = "_blank"; el.rel = "noopener"; }
  });
  document.querySelectorAll("[data-text]").forEach(el => {
    const k = el.dataset.text;
    if (k === "email") el.textContent = ZANU.email;
    if (k === "instagram") el.textContent = "@" + ZANU.instagram;
    if (k === "whatsapp") el.textContent = "+54 9 11 5338-9320";
  });
  const y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Transición entre páginas ---------- */
  const wipe = document.querySelector(".wipe");
  if (wipe && !reduce) {
    wipe.classList.add("is-entering");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      wipe.classList.remove("is-entering");
      wipe.classList.add("is-leaving-out");
    }));
    document.addEventListener("click", e => {
      const a = e.target.closest("a");
      if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname) || url.hash && url.pathname === location.pathname) return;
      e.preventDefault();
      wipe.querySelector(".wipe-word").textContent = a.dataset.wipe || "zanu";
      wipe.classList.remove("is-leaving-out");
      wipe.classList.add("is-covering");
      setTimeout(() => { location.href = url.href; }, 460);
    });
    window.addEventListener("pageshow", ev => { if (ev.persisted) { wipe.classList.remove("is-covering"); wipe.classList.add("is-leaving-out"); } });
  }
  requestAnimationFrame(() => document.body.classList.add("ready"));

  /* ---------- Header: se esconde al bajar, aparece al subir ---------- */
  const header = document.querySelector(".site-header");
  let lastY = 0;
  const onScrollHeader = () => {
    const sy = window.scrollY;
    header.classList.toggle("is-solid", sy > 20);
    header.classList.toggle("is-hidden", sy > lastY && sy > 300 && !document.querySelector(".nav-links.is-open"));
    lastY = sy;
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Menú móvil ---------- */
  const menuBtn = document.querySelector(".menu-btn");
  const links = document.querySelector(".nav-links");
  if (menuBtn) menuBtn.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.textContent = open ? "Cerrar" : "Menú";
  });

  /* ---------- Pastilla que sigue al link del nav ---------- */
  const pill = document.querySelector(".nav-pill");
  if (pill && links) {
    const moveTo = a => {
      pill.style.width = a.offsetWidth + "px";
      pill.style.transform = `translateX(${a.offsetLeft}px)`;
    };
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("mouseenter", () => moveTo(a));
      a.addEventListener("focus", () => moveTo(a));
    });
    const current = links.querySelector('[aria-current="page"]') || links.querySelector("a");
    if (current) moveTo(current);
  }

  /* ---------- Botones: relleno desde el punto de entrada + magnetismo ---------- */
  document.querySelectorAll(".btn").forEach(btn => {
    if (!btn.querySelector(".btn-fill")) {
      const f = document.createElement("span"); f.className = "btn-fill"; btn.prepend(f);
    }
    const setOrigin = e => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--x", (e.clientX - r.left) + "px");
      btn.style.setProperty("--y", (e.clientY - r.top) + "px");
    };
    btn.addEventListener("mouseenter", setOrigin);
    btn.addEventListener("mouseleave", setOrigin);

    if (finePointer && !reduce && btn.hasAttribute("data-magnetic")) {
      const label = btn.querySelector(".btn-label");
      btn.addEventListener("mousemove", e => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * 0.28}px, ${dy * 0.38}px)`;
        if (label) label.style.transform = `translate(${dx * 0.12}px, ${dy * 0.16}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1), color .45s, border-color .45s";
        btn.style.transform = "";
        if (label) label.style.transform = "";
        setTimeout(() => { btn.style.transition = ""; }, 600);
      });
    }
  });

  /* ---------- Cursor propio ---------- */
  if (finePointer && !reduce) {
    document.body.classList.add("has-cursor");
    const ring = document.querySelector(".cursor");
    const dot = document.querySelector(".cursor-dot");
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener("mousemove", e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    });
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener("mouseover", e => {
      ring.classList.toggle("is-hover", !!e.target.closest("a, button, label, .chip, input, textarea"));
    });
    document.addEventListener("mouseleave", () => { ring.classList.add("is-hidden"); dot.classList.add("is-hidden"); });
    document.addEventListener("mouseenter", () => { ring.classList.remove("is-hidden"); dot.classList.remove("is-hidden"); });
  }

  /* ---------- Revelados por scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.2 });
  document.querySelectorAll(".reveal, .service, .cta").forEach(el => io.observe(el));

  /* ---------- Títulos letra por letra ---------- */
  document.querySelectorAll(".split-text").forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    let i = 0;
    words.forEach((w, wi) => {
      const ws = document.createElement("span");
      ws.style.display = "inline-block"; ws.style.whiteSpace = "nowrap";
      [...w].forEach(c => {
        const s = document.createElement("span");
        s.className = "ch"; s.textContent = c; s.style.setProperty("--i", i++);
        ws.appendChild(s);
      });
      el.appendChild(ws);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
    el.setAttribute("aria-label", words.join(" "));
  });

  /* ---------- Servicios: acordeón ---------- */
  document.querySelectorAll(".service-btn").forEach(b => {
    b.addEventListener("click", () => {
      const li = b.closest(".service");
      const open = !li.classList.contains("open");
      document.querySelectorAll(".service.open").forEach(o => {
        o.classList.remove("open"); o.querySelector(".service-btn").setAttribute("aria-expanded", "false");
      });
      if (open) { li.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
    });
  });

  /* ---------- Manifiesto: palabras que se encienden con el scroll ---------- */
  const man = document.querySelector(".manifesto-text");
  let manWords = [];
  if (man) {
    const keys = (man.dataset.keys || "").split(",");
    const words = man.textContent.trim().split(/\s+/);
    man.setAttribute("aria-label", man.textContent.trim());
    man.textContent = "";
    words.forEach((w, i) => {
      const s = document.createElement("span");
      s.className = "w" + (keys.includes(w.replace(/[.,]/g, "")) ? " key" : "");
      s.setAttribute("aria-hidden", "true");
      s.textContent = w;
      man.appendChild(s);
      if (i < words.length - 1) man.appendChild(document.createTextNode(" "));
    });
    manWords = [...man.querySelectorAll(".w")];
  }

  /* ---------- Proceso: scroll horizontal ---------- */
  const pWrap = document.querySelector(".process-track-wrap");
  const pTrack = document.querySelector(".process-track");
  const pBar = document.querySelector(".process-bar span");
  const steps = [...document.querySelectorAll(".step")];
  const horizontalOK = () => window.innerWidth > 760 && !reduce;

  /* ---------- Proyecto: se abre a medida que entra ---------- */
  const project = document.querySelector(".project");

  const onScroll = () => {
    const vh = window.innerHeight;
    if (manWords.length) {
      const r = man.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const n = Math.round(p * manWords.length);
      manWords.forEach((w, i) => w.classList.toggle("on", i < n));
    }
    if (pWrap && horizontalOK()) {
      const r = pWrap.getBoundingClientRect();
      const total = pWrap.offsetHeight - vh;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const max = pTrack.scrollWidth - window.innerWidth + 2 * parseFloat(getComputedStyle(pTrack).paddingLeft);
      pTrack.style.transform = `translateX(${-p * Math.max(0, max)}px)`;
      if (pBar) pBar.style.transform = `scaleX(${p})`;
      const idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
      steps.forEach((s, i) => s.classList.toggle("active", i === idx));
    } else if (pTrack) {
      pTrack.style.transform = "";
    }
    if (project && !reduce) {
      const r = project.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75)));
      const ix = 6 * (1 - p), iy = 8 * (1 - p);
      project.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round 36px)`;
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Tarjetas de socios: inclinación + brillo ---------- */
  if (finePointer && !reduce) {
    document.querySelectorAll(".founder").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(900px) rotateY(${(px - .5) * 8}deg) rotateX(${(.5 - py) * 8}deg)`;
        card.style.setProperty("--gx", px * 100 + "%");
        card.style.setProperty("--gy", py * 100 + "%");
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- Formulario de contacto ---------- */
  const form = document.querySelector(".form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get("nombre") || "").trim();
      const mail = (data.get("email") || "").trim();
      const msg = (data.get("mensaje") || "").trim();
      const types = data.getAll("tipo");
      let ok = true;
      const setErr = (field, text) => { const el = form.querySelector(`[data-error="${field}"]`); if (el) el.textContent = text; if (text) ok = false; };
      setErr("nombre", name ? "" : "Escribí tu nombre.");
      setErr("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) ? "" : "Revisá el email: falta la @ o el dominio.");
      setErr("mensaje", msg.length >= 10 ? "" : "Escribí un poco más (mínimo 10 caracteres).");
      if (!ok) return;
      const body = `Nombre: ${name}\nEmail: ${mail}\nMotivo: ${types.join(", ") || "Sin especificar"}\n\n${msg}`;
      location.href = `mailto:${ZANU.email}?subject=${encodeURIComponent("Contacto desde la web: " + name)}&body=${encodeURIComponent(body)}`;
      form.querySelector(".form-status").textContent = "Abrimos tu app de correo con el mensaje listo. Solo falta enviarlo.";
    });
  }

  /* ---------- Hero: logotipo de zanu startup hecho de puntos que reaccionan al cursor ----------
     Se dibuja con los trazados originales del manual de marca (no con una fuente). */
  const canvas = document.getElementById("dots");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const LETRAS = [
      ["M 0 0 L 92 0 L 92 26 L 38 74 L 92 74 L 92 100 L 0 100 L 0 74 L 52 26 L 0 26 Z", 0],
      ["M 0 50 A 48 50 0 0 1 96 50 A 48 50 0 0 1 0 50 Z M 26 50 A 22 25 0 0 0 70 50 A 22 25 0 0 0 26 50 Z M 68 0 L 96 0 L 96 100 L 68 100 Z", 104],
      ["M 0 100 L 0 48 A 48 48 0 0 1 96 48 L 96 100 L 68 100 L 68 48 A 20 23 0 0 0 28 48 L 28 100 Z", 224],
      ["M 0 0 L 0 52 A 48 48 0 0 0 96 52 L 96 0 L 68 0 L 68 52 A 20 23 0 0 1 28 52 L 28 0 Z", 344]
    ];
    const PETALO = "M 0 0 C 20 -32, 23 -74, 0 -96 C -8 -74, -11 -32, 0 0 Z";
    const ESTUDIO = [
      ["M 60 22 C 60 8 46 0 31 0 C 16 0 2 8 2 24 C 2 40 16 46 31 50 C 46 54 60 60 60 76 C 60 92 46 100 31 100 C 16 100 2 92 2 78", 0],
      ["M 0 0 L 62 0", 108],
      ["M 31 0 L 31 100", 108],
      ["M 0 100 L 24 0 L 38 0 L 62 100", 216],
      ["M 12 66 L 50 66", 216],
      ["M 0 100 L 0 0 L 30 0 A 22 25 0 0 1 30 50 L 0 50", 324],
      ["M 30 50 L 58 100", 324],
      ["M 0 0 L 62 0", 430],
      ["M 31 0 L 31 100", 430],
      ["M 0 0 L 0 66 A 30 34 0 0 0 60 66 L 60 0", 538],
      ["M 0 100 L 0 0 L 30 0 A 22 25 0 0 1 30 50 L 0 50", 646]
    ];
    let W, H, dpr, pts = [], pointer = { x: -9999, y: -9999 };
    const css = getComputedStyle(doc);
    let fg, senal;

    // Dibuja el logotipo principal (vertical) en un canvas auxiliar: negro = letras, rojo = glifo
    const paintLogo = (o, s, ox, oy) => {
      o.save(); o.translate(ox, oy); o.scale(s, s);
      o.fillStyle = "#000";
      for (const [d, x] of LETRAS) { o.save(); o.translate(x, 0); o.fill(new Path2D(d)); o.restore(); }
      o.strokeStyle = "#000"; o.lineWidth = 13;
      o.save(); o.translate(158.0, 140); o.scale(0.26, 0.26);
      for (const [d, x] of ESTUDIO) { o.save(); o.translate(x, 0); o.stroke(new Path2D(d)); o.restore(); }
      o.restore();
      o.fillRect(0, 151.8, 140.0, 2.4); o.fillRect(358.0, 151.8, 140.0, 2.4);
      o.fillStyle = "#F00";
      o.save(); o.translate(476, 16); o.scale(0.22, 0.22);
      for (let k = 0; k < 5; k++) { o.save(); o.rotate(k * 72 * Math.PI / 180); o.fill(new Path2D(PETALO)); o.restore(); }
      o.restore();
      o.restore();
    };

    const build = () => {
      fg = css.getPropertyValue("--hueso").trim();
      senal = css.getPropertyValue("--senal").trim();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      W = Math.round(rect.width); H = Math.round(rect.height);
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const o = off.getContext("2d");
      const s = Math.min(W / 518, H / 172);
      paintLogo(o, s, 10 * s, (H - 160 * s) / 2 + 10 * s);

      const gap = W < 600 ? 3 : W < 1000 ? 4 : 5;
      const img = o.getImageData(0, 0, W, H).data;
      const old = pts;
      pts = [];
      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          const k = (y * W + x) * 4;
          if (img[k + 3] > 128) {
            const prev = old[pts.length];
            pts.push({
              ox: x, oy: y, glifo: img[k] > 128,
              x: prev ? prev.x : (reduce ? x : Math.random() * W),
              y: prev ? prev.y : (reduce ? y : Math.random() * H * 1.6 - H * 0.3),
              vx: 0, vy: 0, heat: 0
            });
          }
        }
      }
      if (reduce) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const r = W < 600 ? 1 : W < 1000 ? 1.3 : 1.65;
      ctx.fillStyle = fg;
      ctx.beginPath();
      for (const p of pts) if (!p.glifo) { const rr = r * (1 + p.heat * 0.9); ctx.moveTo(p.x + rr, p.y); ctx.arc(p.x, p.y, rr, 0, Math.PI * 2); }
      ctx.fill();
      ctx.fillStyle = senal;
      ctx.beginPath();
      for (const p of pts) if (p.glifo) { const rr = r * (1 + p.heat * 0.9); ctx.moveTo(p.x + rr, p.y); ctx.arc(p.x, p.y, rr, 0, Math.PI * 2); }
      ctx.fill();
    };

    const R = 90;
    const tick = () => {
      for (const p of pts) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R) * 6;
          p.vx += (dx / d) * f; p.vy += (dy / d) * f;
          p.heat = Math.min(1, p.heat + 0.2);
        } else {
          p.heat *= 0.94;
        }
        p.vx += (p.ox - p.x) * 0.055;
        p.vy += (p.oy - p.y) * 0.055;
        p.vx *= 0.8; p.vy *= 0.8;
        p.x += p.vx; p.y += p.vy;
      }
      draw();
      requestAnimationFrame(tick);
    };

    const setPointer = (cx, cy) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = cx - r.left; pointer.y = cy - r.top;
    };
    canvas.addEventListener("pointermove", e => setPointer(e.clientX, e.clientY));
    canvas.addEventListener("pointerleave", () => { pointer.x = pointer.y = -9999; });
    canvas.addEventListener("pointerdown", e => setPointer(e.clientX, e.clientY));

    build();
    if (!reduce) tick();
    let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 150); });
  }
})();
