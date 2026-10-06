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
