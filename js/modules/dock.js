import { lenis } from "./smooth-scroll.js";

// Dock: vetro liquido che cambia tono sopra le sezioni [data-dark];
// il burger lo espande in un pannello bianco con il menu.
export function initDock() {
  const dock = document.querySelector("[data-dock]");
  const toggle = dock.querySelector("[data-menu-toggle]");
  const body = dock.querySelector(".dock__body");
  const main = body.querySelector('[data-panel="main"]');
  const links = main.children;
  const backdrop = document.querySelector("[data-menu-backdrop]");
  const d = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.7;

  // tono: chiaro se sotto il centro del dock c'è una sezione scura (pinnate: conta il pin-spacer)
  const probe = () => { const r = dock.getBoundingClientRect(); return Math.round(r.top + r.height / 2); };
  const darks = [...document.querySelectorAll("[data-dark]")].map((el) =>
    ScrollTrigger.create({
      trigger: el.parentElement.classList.contains("pin-spacer") ? el.parentElement : el,
      start: () => `top ${probe()}px`,
      end: () => `bottom ${probe()}px`,
      invalidateOnRefresh: true,
      onToggle: () => dock.classList.toggle("is-on-dark", darks.some((t) => t.isActive)),
    })
  );

  const isOpen = () => dock.classList.contains("is-open");

  // sottomenu: un pannello alla volta; l'altezza del dock si adatta con un'animazione
  let opener = null;
  const showPanel = (name, viaKeyboard = false) => {
    const next = body.querySelector(`[data-panel="${name}"]`);
    const current = body.querySelector(".dock__panel:not([hidden])");
    if (next === current) return;
    const from = dock.offsetHeight;
    current.hidden = true;
    next.hidden = false;
    gsap.fromTo(dock, { height: from }, { height: dock.offsetHeight, duration: d * 0.7, ease: "expo.inOut", clearProps: "height" });
    const dir = name === "main" ? -1 : 1;
    gsap.fromTo(next.children, { x: 32 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: d, ease: "expo.out", stagger: 0.03, clearProps: "transform,opacity" });
    if (name === "main") { if (viaKeyboard) opener?.focus(); }
    else if (viaKeyboard) next.querySelector("[data-back]").focus();
    body.scrollTop = 0;
  };
  body.addEventListener("click", (e) => {
    const sub = e.target.closest("[data-sub]");
    const back = e.target.closest("[data-back]");
    if (sub) { opener = sub; showPanel(sub.dataset.sub, e.detail === 0); }
    else if (back) showPanel("main", e.detail === 0);
  });

  const setOpen = (open, viaKeyboard = false) => {
    if (open === isOpen()) return;
    gsap.killTweensOf([dock, body, links, backdrop]);
    // FLIP: misura prima e dopo il cambio di classe, poi anima tra le due dimensioni
    const from = { width: dock.offsetWidth, height: dock.offsetHeight };
    dock.classList.toggle("is-open", open);
    gsap.set(dock, { clearProps: "width,height" });
    const to = { width: dock.offsetWidth, height: dock.offsetHeight };
    gsap.fromTo(dock, from, { ...to, duration: d, ease: "expo.inOut", clearProps: "width,height" });

    toggle.setAttribute("aria-expanded", open);
    gsap.to(backdrop, { autoAlpha: open ? 1 : 0, duration: d * 0.5 });

    if (open) {
      lenis?.stop();
      gsap.set(body, { visibility: "visible" });
      if (viaKeyboard) links[0].focus({ preventScroll: true }); // col mouse niente anello di focus
      gsap.to(body, { opacity: 1, duration: d * 0.5, delay: d * 0.4 });
      gsap.fromTo(links, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: d, ease: "expo.out", stagger: 0.04, delay: d * 0.45, clearProps: "transform,opacity" });
    } else {
      lenis?.start();
      gsap.to(body, { opacity: 0, duration: d * 0.25, onComplete: () => {
        gsap.set(body, { visibility: "hidden" });
        body.querySelectorAll(".dock__panel").forEach((p) => (p.hidden = p !== main));
      } });
    }
  };

  toggle.addEventListener("click", (e) => setOpen(!isOpen(), e.detail === 0)); // detail 0 = Invio/Spazio
  backdrop.addEventListener("click", () => setOpen(false));
  // fase di capture: chiude (e riattiva Lenis) prima che smooth-scroll gestisca l'ancora
  body.addEventListener("click", (e) => e.target.closest("a") && setOpen(false), true);
  addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !isOpen()) return;
    setOpen(false);
    toggle.focus();
  });
}
