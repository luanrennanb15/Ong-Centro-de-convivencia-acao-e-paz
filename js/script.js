/* =========================================================
   CIS - Centro de Convivência Ação e Paz
   JavaScript compartilhado
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. Menu mobile (hamburguer) ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
      toggle.classList.toggle("active");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("active");
      });
    });
  }

  /* ---------- 2. Contadores animados ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const animate = function (el) {
      const target = parseInt(el.getAttribute("data-count"), 10);
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1600;
      const start = performance.now();
      const step = function (now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString("pt-BR") + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString("pt-BR") + suffix;
      };
      requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { obs.observe(c); });
  }

  /* ---------- 3. Barras de transparência ---------- */
  const bars = document.querySelectorAll(".bar-fill");
  if (bars.length) {
    const barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.width = (el.getAttribute("data-value") || "0") + "%";
          barObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    bars.forEach(function (b) { barObs.observe(b); });
  }

  /* ---------- 4. FAQ (acordeão) ---------- */
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      const item = q.parentElement;
      const answer = item.querySelector(".faq-a");
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (i) {
        i.classList.remove("open");
        i.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------- 5. Validação simples (formulários demo) ---------- */
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll("[required]").forEach(function (campo) {
        if (!campo.value.trim()) { ok = false; campo.style.borderColor = "#e05a5a"; }
        else { campo.style.borderColor = ""; }
      });
      const msg = form.querySelector(".form-msg");
      if (ok) {
        if (msg) msg.classList.add("show");
        form.reset();
        if (msg) setTimeout(function () { msg.classList.remove("show"); }, 6000);
      }
    });
  });

  /* ---------- 5b. Formulários que abrem o WhatsApp ---------- */
  var WA_NUM = "5515997531485";
  document.querySelectorAll("form[data-wa]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (campo) {
        if (!campo.value.trim()) { ok = false; campo.style.borderColor = "#e05a5a"; }
        else { campo.style.borderColor = ""; }
      });
      if (!ok) return;
      var linhas = [form.getAttribute("data-wa") || "Ola! Vim pelo site do CIS.", ""];
      form.querySelectorAll(".field").forEach(function (fld) {
        var lab = fld.querySelector("label");
        var inp = fld.querySelector("input, select, textarea");
        if (lab && inp && inp.value.trim()) {
          linhas.push(lab.textContent.replace("*", "").trim() + ": " + inp.value.trim());
        }
      });
      var url = "https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(linhas.join("\n"));
      window.open(url, "_blank");
      var msg = form.querySelector(".form-msg");
      if (msg) { msg.classList.add("show"); setTimeout(function () { msg.classList.remove("show"); }, 6000); }
      form.reset();
    });
  });

  /* ---------- 6. Copiar chave Pix ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const texto = btn.getAttribute("data-copy");
      const original = btn.textContent;
      const done = function () {
        btn.textContent = "Copiado!";
        setTimeout(function () { btn.textContent = original; }, 2000);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(texto).then(done).catch(done);
      } else { done(); }
    });
  });

  /* ---------- 7. Carrossel de eventos (destaque central) ---------- */
  document.querySelectorAll(".carousel").forEach(function (car) {
    var track = car.querySelector(".carousel-track");
    var prev = car.querySelector(".carousel-btn.prev");
    var next = car.querySelector(".carousel-btn.next");
    if (!track) return;
    var slides = Array.prototype.slice.call(track.querySelectorAll(".carousel-slide"));
    var step = function () {
      return slides.length > 1
        ? slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left
        : track.clientWidth;
    };
    var updateActive = function () {
      var center = track.getBoundingClientRect().left + track.clientWidth / 2;
      var best = null, bestDist = Infinity;
      slides.forEach(function (s) {
        var r = s.getBoundingClientRect();
        var d = Math.abs((r.left + r.width / 2) - center);
        if (d < bestDist) { bestDist = d; best = s; }
      });
      slides.forEach(function (s) { s.classList.toggle("is-active", s === best); });
    };
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    var raf;
    track.addEventListener("scroll", function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActive);
    });
    window.addEventListener("resize", updateActive);
    updateActive();
  });

  /* ---------- 8. Fade-in ao rolar a página ---------- */
  (function () {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var sel = ".section-head, .card, .split, .quote, .stat, .cta-band, figure, .partners-strip, .friends, .carousel, .gallery, .bars, .info-list";
    var els = Array.prototype.slice.call(document.querySelectorAll(sel));
    if (!els.length) return;
    els.forEach(function (el) { el.classList.add("reveal"); });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { obs.observe(el); });
  })();

  /* ---------- 9. Lightbox (ampliar fotos) ---------- */
  (function () {
    var imgs = Array.prototype.slice.call(
      document.querySelectorAll(".carousel-slide img, .gallery img, [data-lightbox] img")
    );
    if (!imgs.length) return;
    var srcs = imgs.map(function (im) { return im.getAttribute("src"); });
    imgs.forEach(function (im) { im.classList.add("lb-clickable"); });

    var box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML =
      '<button class="lightbox-close" aria-label="Fechar">&times;</button>' +
      '<button class="lightbox-nav prev" aria-label="Anterior"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<img alt="Foto ampliada" />' +
      '<button class="lightbox-nav next" aria-label="Proxima"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
    document.body.appendChild(box);
    var bigImg = box.querySelector("img");
    var current = 0;

    var show = function (i) {
      current = (i + srcs.length) % srcs.length;
      bigImg.setAttribute("src", srcs[current]);
    };
    var openLb = function (i) { show(i); box.classList.add("open"); };
    var closeLb = function () { box.classList.remove("open"); };

    imgs.forEach(function (im, i) { im.addEventListener("click", function () { openLb(i); }); });
    box.querySelector(".lightbox-close").addEventListener("click", closeLb);
    box.querySelector(".lightbox-nav.prev").addEventListener("click", function (e) { e.stopPropagation(); show(current - 1); });
    box.querySelector(".lightbox-nav.next").addEventListener("click", function (e) { e.stopPropagation(); show(current + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "ArrowRight") show(current + 1);
    });
  })();

  /* ---------- 10. Botão voltar ao topo ---------- */
  (function () {
    var btn = document.createElement("button");
    btn.className = "to-top";
    btn.setAttribute("aria-label", "Voltar ao topo");
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 19V6M6 12l6-6 6 6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(btn);
    var onScroll = function () { btn.classList.toggle("show", window.scrollY > 400); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  })();

  /* ---------- 11. Ano atual no rodapé ---------- */
  const anoEl = document.getElementById("ano");
  if (anoEl) anoEl.textContent = new Date().getFullYear();

});
