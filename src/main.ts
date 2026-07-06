import initCarousels from "./components/carousel";
import initMarquees from "./components/marquee";
import { initViewportClassSync } from "./components/mobile";
import initModals from "./components/modal";
import { base, loading } from "./components/template";
import initTextFit from "./components/text-fit";
import { initThemes } from "./components/theme";
import { make, qsRequired } from "./utils/utils";

function carouselInit(selector: string, start: number, count: number): void {
  const container = qsRequired<HTMLDivElement>(selector);
  container.innerHTML = "";

  [...Array(count)].forEach((_, idx) => {
    const image = make("img", {
      props: {
        src: `/images/pattern-${start + idx}.jpg`,
      },
    });
    container.append(image);
  });
}

document.body.append(loading);

document.addEventListener("DOMContentLoaded", () => {
  document.body.append(base);

  initMarquees();

  carouselInit(".carousel-left", 1, 5);
  carouselInit(".carousel-right", 6, 5);
  carouselInit(".carousel-center", 11, 5);
  carouselInit(".carousel-mobile", 1, 15);

  initCarousels();
  initTextFit();
  initModals();
  initThemes();
  initViewportClassSync();

  setTimeout(() => {
    loading.style.display = "none";
  }, 1000);
});
