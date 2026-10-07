// Reveal on scroll. Attributi:
//   data-reveal       fade + slide up
//   data-stagger      figli in cascata
//   data-reveal-img   immagine con clip-path
//   data-parallax     immagine interna in parallasse
//   data-split        titolo hero, riga per riga (separare con <br>)
//   data-words        testo che si accende parola per parola durante lo scroll
const EASE = "power3.out";

// divide il testo in <span class="word"> (testo semplice, senza markup interno)
export const splitWords = (el) =>
  (el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="word">${w}</span>`).join(" "));

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

  // data-parallax: l'immagine interna scorre più lenta del riquadro (CSS la ingrandisce per coprire)
  gsap.utils.toArray("[data-parallax]").forEach((el) =>
    gsap.fromTo(el.querySelector("img, video"), { yPercent: -7 }, {
      yPercent: 7, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    })
  );

  // escluso [data-statement]: lì le parole fanno parte del pin (statement.js)
  gsap.utils.toArray("[data-words]").filter((el) => !el.closest("[data-statement]")).forEach((el) => {
    splitWords(el);
    gsap.to(el.querySelectorAll(".word"), {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 55%", scrub: true },
    });
  });

  // hero: foto a metà velocità dello scroll + zoom lento all'avvio (effetto fluid.glass)
  const heroImg = document.querySelector(".hero__media img");
  if (heroImg) {
    gsap.from(heroImg, { scale: 1.12, duration: 2.6, ease: "power3.out" });
    gsap.to(heroImg, {
      y: () => heroImg.parentElement.offsetHeight / 2, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
    });
  }

  const title = document.querySelector("[data-split]");
  if (title) {
    title.innerHTML = title.innerHTML.split(/<br\s*\/?>/).map((l) => `<span class="line"><span>${l}</span></span>`).join("");
    gsap.from(title.querySelectorAll(".line > span"), { yPercent: 110, duration: 1.3, ease: EASE, stagger: 0.12, delay: 0.2 });
  }
}
