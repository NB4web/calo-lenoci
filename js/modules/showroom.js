// Showroom: sezione pinnata, l'immagine si apre da riquadro a tutto schermo.
export function initShowroom() {
  const stage = document.querySelector("[data-showroom]");
  if (!stage) return;
  gsap.timeline({
    scrollTrigger: { trigger: stage, start: "top top", end: "+=100%", scrub: true, pin: true },
  })
    .fromTo(stage.querySelector(".showroom__media"), { clipPath: "inset(20% 24%)" }, { clipPath: "inset(0% 0%)", ease: "none" })
    .fromTo(stage.querySelector(".showroom__media img"), { scale: 1.2 }, { scale: 1, ease: "none" }, 0);
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
