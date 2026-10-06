// Righe progetto: all'hover un'anteprima ([data-img]) segue il cursore. Solo con mouse.
// Lo stato si ricalcola da ciò che c'è sotto il cursore (anche durante lo scroll):
// pointerleave non scatta se la lista scorre via sotto un mouse fermo, e l'anteprima restava appesa.
export function initProjectsHover() {
  const list = document.querySelector("[data-projects]");
  if (!list || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const rows = [...list.querySelectorAll("[data-img]")];
  const preview = document.createElement("div");
  preview.className = "projects__preview";
  preview.setAttribute("aria-hidden", "true");
  const imgs = rows.map((row) => {
    const img = new Image();
    img.src = row.dataset.img;
    img.alt = "";
    preview.append(img);
    return img;
  });
  document.body.append(preview);

  gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
  const xTo = gsap.quickTo(preview, "x", { duration: 0.6, ease: "power3" });
  const yTo = gsap.quickTo(preview, "y", { duration: 0.6, ease: "power3" });

  // il riquadro prende le proporzioni della foto (verticale o orizzontale), lato lungo fisso
  const size = (img) => {
    const r = img.naturalWidth ? img.naturalWidth / img.naturalHeight : 0.8;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const s = gsap.utils.clamp(17 * rem, 27 * rem, innerWidth * 0.25);
    return r >= 1 ? { width: s, height: s / r } : { width: s * r, height: s };
  };

  let x = -1, y = -1, active = -1;

  const sync = () => {
    // l'anteprima ha pointer-events: none, quindi elementFromPoint vede la riga sotto
    const row = x < 0 ? null : document.elementFromPoint(x, y)?.closest("[data-img]");
    const i = rows.indexOf(row);
    if (i !== active) {
      if (i >= 0 && active >= 0) gsap.to(preview, { ...size(imgs[i]), duration: 0.5, ease: "power3.out" });
      if ((i >= 0) !== (active >= 0)) {
        if (i >= 0) gsap.set(preview, { x, y, ...size(imgs[i]) });
        gsap.to(preview, i >= 0
          ? { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power3.out", overwrite: "auto" }
          : { autoAlpha: 0, scale: 0.6, duration: 0.4, ease: "power3.out", overwrite: "auto" });
      }
      active = i;
      imgs.forEach((img, k) => img.classList.toggle("is-active", k === i));
    }
    if (active >= 0) { xTo(x); yTo(y); }
  };

  const reset = () => { x = y = -1; sync(); };
  addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; sync(); }, { passive: true });
  addEventListener("scroll", sync, { passive: true });
  document.documentElement.addEventListener("pointerleave", reset); // cursore fuori dalla finestra
  addEventListener("blur", reset);
}
