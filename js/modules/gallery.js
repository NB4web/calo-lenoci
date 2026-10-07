// Galleria a carosello: foto attiva grande al centro, le vicine più piccole e inclinate ai lati.
// Frecce, click sulle laterali e swipe; gira in loop.
export function initGallery() {
  const dur = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.9;
  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const stage = gallery.querySelector(".gallery__stage");
    const slides = [...stage.children];
    const [prev, next] = gallery.querySelectorAll(".gallery__nav button");
    const n = slides.length;
    let active = 0;

    const render = (d = dur) => {
      const gap = stage.clientWidth * (innerWidth > 760 ? 0.57 : 0.74); // le laterali si intravedono appena ai bordi
      slides.forEach((slide, i) => {
        let o = (i - active + n) % n;
        if (o > n / 2) o -= n; // offset relativo, -2..2 con 5 foto
        const side = Math.abs(o) === 1;
        gsap.to(slide, {
          x: o * gap, scale: o === 0 ? 1 : 0.72, rotation: o * 10,
          autoAlpha: Math.abs(o) <= 1 ? 1 : 0, zIndex: 2 - Math.abs(o),
          duration: d, ease: "expo.out", overwrite: true,
        });
        slide.classList.toggle("is-side", side);
        slide.setAttribute("aria-hidden", o !== 0);
      });
    };
    const go = (step) => { active = (active + step + n) % n; render(); };

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    slides.forEach((slide, i) => slide.addEventListener("click", () => slide.classList.contains("is-side") && go(i === (active + 1) % n ? 1 : -1)));

    let startX = null; // swipe
    stage.addEventListener("pointerdown", (e) => (startX = e.clientX));
    stage.addEventListener("pointerup", (e) => {
      if (startX !== null && Math.abs(e.clientX - startX) > 40) go(e.clientX < startX ? 1 : -1);
      startX = null;
    });

    addEventListener("resize", () => render(0));
    render(0);
  });
}

// Moduli di anteprima: non inviano nulla finché non c'è un backend, mostrano solo la conferma.
export function initDemoForms() {
  document.querySelectorAll("form[data-demo]").forEach((form) =>
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.reset();
      form.querySelector("[data-form-status]").hidden = false;
    })
  );
}

// Scorrimento continuo: duplica i figli di [data-loop] così l'animazione CSS a -50% fa un giro esatto.
export function initLoop() {
  document.querySelectorAll("[data-loop]").forEach((track) =>
    [...track.children].forEach((el) => {
      const copy = el.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      track.append(copy);
    })
  );
}

// Lightbox: click su una foto dentro [data-lightbox] la apre grande in un <dialog>, con frecce,
// tastiera (← → Esc) e contatore. Le copie del loop (initLoop) puntano alla stessa foto.
export function initLightbox() {
  const groups = document.querySelectorAll("[data-lightbox]");
  if (!groups.length) return;

  // cursore "View" che segue il mouse sopra le foto apribili (solo con mouse)
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const cursor = document.createElement("div");
    cursor.className = "view-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML = '<span class="caps">View</span>';
    document.body.append(cursor);
    gsap.set(cursor, { x: -200, y: -200 });
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3" });
    addEventListener("pointermove", (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      cursor.classList.toggle("is-on", !!e.target.closest?.("[data-lightbox] img"));
    }, { passive: true });
  }

  groups.forEach((group) => {
    const srcs = () => [...new Set([...group.querySelectorAll("img")].map((img) => img.currentSrc || img.src))];
    const arrow = (d) => `<svg viewBox="0 0 18 14" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="${d}"/></svg>`;
    const box = document.createElement("dialog");
    box.className = "lightbox";
    box.setAttribute("aria-label", "Foto ingrandita");
    box.dataset.lenisPrevent = "";
    box.innerHTML = `
      <button type="button" class="lightbox__close caps">Chiudi</button>
      <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Foto precedente">${arrow("M17 7H1M7 1 1 7l6 6")}</button>
      <img alt="">
      <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Foto successiva">${arrow("M1 7h16M11 1l6 6-6 6")}</button>
      <p class="lightbox__count caps" aria-live="polite"></p>`;
    document.body.append(box);
    const img = box.querySelector("img");
    const count = box.querySelector(".lightbox__count");
    let i = 0;

    const show = (k) => {
      const list = srcs();
      i = (k + list.length) % list.length;
      img.src = list[i];
      count.textContent = `${i + 1} / ${list.length}`;
    };
    group.addEventListener("click", (e) => {
      const target = e.target.closest("img");
      if (!target) return;
      show(srcs().indexOf(target.currentSrc || target.src));
      box.showModal();
    });
    box.querySelector(".lightbox__close").addEventListener("click", () => box.close());
    box.querySelector(".lightbox__nav--prev").addEventListener("click", () => show(i - 1));
    box.querySelector(".lightbox__nav--next").addEventListener("click", () => show(i + 1));
    box.addEventListener("click", (e) => e.target === box && box.close()); // click sul fondo
    box.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(i - 1);
      if (e.key === "ArrowRight") show(i + 1);
    });
  });
}

// Slider dei progetti: scorrimento nativo (trackpad, dito), frecce di una foto e barra di avanzamento.
export function initSlider() {
  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const track = slider.querySelector(".proj__track");
    const bar = slider.querySelector(".proj__progress span");
    const [prev, next] = slider.querySelectorAll(".proj__ctrl button");
    const step = () => track.firstElementChild.offsetWidth + parseFloat(getComputedStyle(track).columnGap);
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth;
      const p = max > 0 ? track.scrollLeft / max : 1;
      bar.style.transform = `scaleX(${0.15 + p * 0.85})`; // parte da un pezzetto, arriva piena alla fine
      prev.disabled = track.scrollLeft < 2;
      next.disabled = track.scrollLeft > max - 2;
    };
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    track.addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", sync);
    sync();
  });
}
