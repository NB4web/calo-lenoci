import { initSmoothScroll } from "./modules/smooth-scroll.js";
import { initDock } from "./modules/dock.js";
import { initReveal } from "./modules/reveal.js";
import { initShowroom, initShowroomVideo } from "./modules/showroom.js";
import { initSolutions } from "./modules/solutions.js";
import { initStatement } from "./modules/statement.js";
import { initProjectsHover } from "./modules/projects.js";
import { initBooking } from "./modules/booking.js";
import { initGallery, initDemoForms, initLoop, initLightbox, initSlider } from "./modules/gallery.js";

document.documentElement.classList.add("js");

gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

// i pin vanno creati in ordine di pagina e prima dei trigger sottostanti, che ne ereditano lo spazio
if (!reduced) {
  initSmoothScroll();
  initStatement();
  initSolutions();
  initShowroom();
  initReveal();
  initProjectsHover();
  initLoop(); // senza movimento la striscia resta statica, niente copie
}
initDock();
initShowroomVideo();
initGallery();
initSlider();
initLightbox();
initBooking(); // prima di initDemoForms: il modulo del pannello è creato qui
initDemoForms();
