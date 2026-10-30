import { startCarousels } from "../../carousel-main";
import initCarousels from "../../components/carousel";
import initMarquees from "../../components/marquee";
import { initViewportClassSync } from "../../components/mobile";
import initModals from "../../components/modal";
import { registerPage, type Page } from "../../components/page";
import { base } from "./template";
import initTextFit from "../../components/text-fit";
import { initThemes } from "../../components/theme";

const styles = [
  "/css/home/grid.css",
  "/css/home/carousel.css",
  "/css/home/marquee.css",
  "/css/home/text-fit.css",
  "/css/home/modal.css",
  "/css/home/home.css",
];

const content = () => {
  return base;
};

const onLoad = () => {
  initMarquees();
  startCarousels();

  initCarousels();
  initTextFit();
  initModals();
  initThemes();
  initViewportClassSync();
};

const page: Page = {
  id: "home",
  title: "Brutal",
  url: "/",
  content,
  onLoad,
  styles,
};

registerPage(page);
