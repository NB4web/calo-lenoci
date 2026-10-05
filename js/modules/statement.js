// Statement: sezione pinnata, il titolo si accende parola per parola
// mentre le immagini la attraversano dal basso verso l'alto a velocità diverse.
export function initStatement() {
  const section = document.querySelector("[data-statement]");
  if (!section) return;
  const title = section.querySelector("[data-words]");
  const imgs = section.querySelectorAll(".statement__imgs img");

  title.innerHTML = title.textContent.trim().split(/\s+/).map((w) => `<span class="word">${w}</span>`).join(" ");
  section.classList.add("is-pinned");

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: "top top", end: "+=200%", pin: true, scrub: true, invalidateOnRefresh: true },
  });

  tl.to(title.querySelectorAll(".word"), { opacity: 1, ease: "none", duration: 0.3, stagger: 0.12 }, 0.2);

  // ognuna parte sotto la sezione ed esce in alto; durate diverse = velocità diverse
  imgs.forEach((img, i) =>
    tl.fromTo(img, { y: 0 }, { y: () => -(section.offsetHeight + img.offsetHeight), ease: "none", duration: 1.4 - (i % 3) * 0.2 }, i * 0.4)
  );
}
