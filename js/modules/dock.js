// Dock in basso: l'etichetta è il nome della pagina, scritto nell'HTML di ogni pagina. Burger apre il menu.
export function initDock() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const root = document.documentElement;

  const setOpen = (open) => {
    root.classList.toggle("is-menu-open", open);
    toggle.setAttribute("aria-expanded", open);
    if (open) menu.querySelector("a").focus();
  };

  toggle.addEventListener("click", () => setOpen(!root.classList.contains("is-menu-open")));
  menu.addEventListener("click", (e) => (e.target === menu || e.target.closest("a")) && setOpen(false));
  addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !root.classList.contains("is-menu-open")) return;
    setOpen(false);
    toggle.focus();
  });
}
