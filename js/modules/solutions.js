// Soluzioni: sezione pinnata, ogni slide entra con un wipe dal basso.
// Barra di progresso continua; il testo attivo cambia a metà wipe.
export function initSolutions() {
  const section = document.querySelector("[data-solutions]");
  if (!section) return;
  const slides = gsap.utils.toArray(".solution", section);
  const bar = section.querySelector(".solutions__progress span");
  const last = slides.length - 1;
  let current = -1;

  const setActive = (i) => {
    if (i === current) return;
    current = i;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === i));
  };

  section.classList.add("is-pinned");
  setActive(0);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => "+=" + innerHeight * last,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        gsap.set(bar, { scaleX: self.progress });
        setActive(Math.round(self.progress * last));
      },
    },
  });

  slides.forEach((s, k) => {
    if (k) tl.fromTo(s.querySelector(".solution__media"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 }, k - 1);
    // parallasse leggera finché la slide è visibile (entrata + permanenza)
    const start = Math.max(k - 1, 0);
    tl.fromTo(s.querySelector("img"), { yPercent: k ? 5 : 0 }, { yPercent: -5, ease: "none", duration: Math.min(k + 1, last) - start }, start);
  });
}
