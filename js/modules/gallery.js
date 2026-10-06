// Galleria orizzontale: scorrimento nativo con scroll-snap (touch e trackpad),
// le frecce spostano di una slide e si disattivano agli estremi.
export function initGallery() {
  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const track = gallery.querySelector(".gallery__track");
    const [prev, next] = gallery.querySelectorAll(".gallery__nav button");
    const step = () => track.firstElementChild.offsetWidth + parseFloat(getComputedStyle(track).columnGap);
    const sync = () => {
      prev.disabled = track.scrollLeft < 2;
      next.disabled = track.scrollLeft > track.scrollWidth - track.clientWidth - 2;
    };
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    track.addEventListener("scroll", sync, { passive: true });
    sync();
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
