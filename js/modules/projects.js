// Righe progetto: all'hover un'anteprima ([data-img]) segue il cursore. Solo con mouse.
export function initProjectsHover() {
  const list = document.querySelector("[data-projects]");
  if (!list || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const rows = list.querySelectorAll("[data-img]");
  const preview = document.createElement("div");
  preview.className = "projects__preview";
  preview.setAttribute("aria-hidden", "true");
  const imgs = [...rows].map((row) => {
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

  list.addEventListener("pointerenter", (e) => {
    gsap.set(preview, { x: e.clientX, y: e.clientY });
    gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power3.out" });
  });
  list.addEventListener("pointerleave", () => gsap.to(preview, { autoAlpha: 0, scale: 0.6, duration: 0.4, ease: "power3.out" }));
  list.addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); });
  rows.forEach((row, i) =>
    row.addEventListener("pointerenter", () => imgs.forEach((img, k) => img.classList.toggle("is-active", k === i)))
  );
}
