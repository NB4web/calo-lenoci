// Showroom (come fluid.glass): sezione pinnata, il video in loop parte da riquadro ridotto e cresce
// a tutto schermo scurendosi, mentre titolo e indirizzi scivolano verso i bordi.
export function initShowroom() {
  const stage = document.querySelector("[data-showroom]");
  if (!stage) return;
  const media = stage.querySelector(".showroom__media");
  const video = media.querySelector("video");
  const shift = () => innerWidth * 0.04;

  gsap.timeline({
    scrollTrigger: { trigger: stage, start: "top top", end: "+=100%", scrub: true, pin: true, invalidateOnRefresh: true },
  })
    .fromTo(media, { scale: 0.55, opacity: 0.8 }, { scale: 1, opacity: 0.45, ease: "none" })
    .fromTo(stage.querySelector(".showroom__title"), { x: shift }, { x: 0, ease: "none" }, 0)
    .fromTo(stage.querySelector(".showroom__info"), { x: () => -shift() }, { x: 0, ease: "none" }, 0);

  // il video gira solo quando la sezione è a schermo (si scarica solo da lì in poi)
  ScrollTrigger.create({
    trigger: stage, start: "top bottom", end: "bottom top",
    onToggle: (self) => (self.isActive ? video.play().catch(() => {}) : video.pause()),
  });
}

// Video showroom: cursore "Play" che segue il mouse, click apre il video in un <dialog>.
export function initShowroomVideo() {
  const open = document.querySelector("[data-video-open]");
  const modal = document.querySelector("[data-video-modal]");
  if (!open || !modal) return;
  const video = modal.querySelector("video");

  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const cursor = open.querySelector(".play-cursor");
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3" });
    const local = (e) => { const r = open.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    open.addEventListener("pointerenter", (e) => { const [x, y] = local(e); gsap.set(cursor, { x, y }); });
    open.addEventListener("pointermove", (e) => { const [x, y] = local(e); xTo(x); yTo(y); });
  }

  open.addEventListener("click", () => {
    modal.showModal();
    video.play().catch(() => {}); // play() rifiuta se il file manca o l'autoplay è bloccato: restano i controlli
  });
  modal.querySelector("[data-video-close]").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => e.target === modal && modal.close());
  modal.addEventListener("close", () => video.pause());
}
