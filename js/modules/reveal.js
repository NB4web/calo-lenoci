// Reveal on scroll. Attributi:
//   data-reveal       fade + slide up
//   data-stagger      figli in cascata
//   data-reveal-img   immagine con clip-path
//   data-split        titolo hero, riga per riga (separare con <br>)
const EASE = "power3.out";

export function initReveal() {
  const trigger = (el) => ({ trigger: el, start: "top 88%", once: true });

  gsap.utils.toArray("[data-reveal]").forEach((el) =>
    gsap.fromTo(el, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, scrollTrigger: trigger(el) })
  );

  gsap.utils.toArray("[data-stagger]").forEach((wrap) =>
    gsap.fromTo(wrap.children, { autoAlpha: 0, y: 48 }, {
      autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.12, scrollTrigger: trigger(wrap),
    })
  );

  gsap.utils.toArray("[data-reveal-img]").forEach((el) =>
    gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, {
      clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "power3.inOut", scrollTrigger: trigger(el),
    })
  );

  const title = document.querySelector("[data-split]");
  if (title) {
    title.innerHTML = title.innerHTML.split(/<br\s*\/?>/).map((l) => `<span class="line"><span>${l}</span></span>`).join("");
    gsap.from(title.querySelectorAll(".line > span"), { yPercent: 110, duration: 1.3, ease: EASE, stagger: 0.12, delay: 0.2 });
  }
}
