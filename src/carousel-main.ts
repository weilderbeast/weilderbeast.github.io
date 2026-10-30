import { qsRequired, make } from "./utils/utils";

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

export const startCarousels = () => {
  carouselInit(".carousel-left", 1, 5);
  carouselInit(".carousel-right", 6, 5);
  carouselInit(".carousel-center", 11, 5);
  carouselInit(".carousel-mobile", 1, 15);
};
