// [data-parallax] sull'immagine: slitta leggermente durante lo scroll del genitore.
export function initParallax() {
  gsap.utils.toArray("[data-parallax]").forEach((img) =>
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6, ease: "none",
      scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    })
  );
}
