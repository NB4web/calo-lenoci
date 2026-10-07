import { lenis } from "./smooth-scroll.js";

// "Prenota una visita": i link [data-booking] aprono un pannello a destra (100dvh) con il modulo.
// Il markup sta qui, così è uguale su tutte le pagine; senza JS il link porta a contatti.html#modulo.
export function initBooking() {
  const triggers = document.querySelectorAll("[data-booking]");
  if (!triggers.length) return;
  const d = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.6;

  const drawer = document.createElement("dialog");
  drawer.className = "drawer";
  drawer.setAttribute("aria-labelledby", "drawer-title");
  drawer.dataset.lenisPrevent = "";
  drawer.innerHTML = `
    <div class="drawer__inner">
      <div class="drawer__head">
        <p class="eyebrow">Prenota una visita</p>
        <button type="button" class="drawer__close caps">Chiudi</button>
      </div>
      <h2 class="drawer__title" id="drawer-title">Richiedi informazioni</h2>
      <p class="drawer__text">Lasciaci i tuoi dati: un consulente ti ricontatterà per fissare un appuntamento in showroom.</p>
      <!-- anteprima: il modulo non è ancora collegato a un backend (initDemoForms) -->
      <form class="form" data-demo>
        <input type="hidden" name="origine" value="Prenota una visita">
        <div class="form__row">
          <input name="nome" placeholder="Nome*" aria-label="Nome" autocomplete="given-name" required>
          <input name="cognome" placeholder="Cognome*" aria-label="Cognome" autocomplete="family-name" required>
        </div>
        <input type="email" name="email" placeholder="Email*" aria-label="Email" autocomplete="email" required>
        <input type="tel" name="telefono" placeholder="Numero di telefono*" aria-label="Numero di telefono" autocomplete="tel" required>
        <select name="showroom" aria-label="Showroom" required>
          <option value="" disabled selected>Showroom*</option>
          <option>Ostuni</option>
          <option>Ceglie Messapica</option>
        </select>
        <textarea name="messaggio" placeholder="Messaggio" aria-label="Messaggio"></textarea>
        <label class="form__check"><input type="checkbox" name="privacy" required><span>Ho letto e accetto l’<a href="#">informativa privacy</a>*</span></label>
        <button type="submit" class="btn">Invia richiesta</button>
        <p class="form__status" role="status" data-form-status hidden>Grazie! Ti ricontatteremo al più presto per fissare l’appuntamento.</p>
      </form>
    </div>`;
  document.body.append(drawer);

  // si anima il contenuto e non il <dialog>: GSAP, misurando un elemento fisso senza offsetParent,
  // lo sposterebbe nel DOM per un attimo e il dialog perderebbe lo stato modale
  const panel = drawer.querySelector(".drawer__inner");
  const open = (e) => {
    e.preventDefault();
    lenis?.stop();
    drawer.showModal();
    gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: d, ease: "expo.out" });
  };
  const close = () => {
    gsap.to(panel, { xPercent: 100, duration: d * 0.6, ease: "power3.in", onComplete: () => drawer.close() });
  };

  triggers.forEach((t) => t.addEventListener("click", open));
  drawer.querySelector(".drawer__close").addEventListener("click", close);
  drawer.addEventListener("click", (e) => e.target === drawer && close()); // click sul fondo scuro
  drawer.addEventListener("cancel", (e) => { e.preventDefault(); close(); }); // Esc con animazione
  drawer.addEventListener("close", () => lenis?.start());
}
