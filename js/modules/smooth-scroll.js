// Lenis pilota ScrollTrigger tramite il ticker GSAP.
export let lenis; // usato dal dock per bloccare lo scroll a menu aperto

export function initSmoothScroll() {
  if (typeof Lenis === "undefined") return;
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // ancore interne con scroll morbido
  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target);
    })
  );
}
