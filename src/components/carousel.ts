interface CarouselInstance {
  container: HTMLElement;
  images: HTMLImageElement[];
  timer: number;
}

const DEFAULT_TIMEOUT = 2000;

const instances = new WeakMap<HTMLElement, CarouselInstance>();

function getTimeout(container: HTMLElement): number {
  const attr = container.dataset.timeout;
  const parsed = attr ? Number(attr) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT;
}

function buildCarousel(container: HTMLElement): void {
  const existing = instances.get(container);
  if (existing) {
    window.clearInterval(existing.timer);
  }

  const tall = container.classList.contains("carousel-tall");
  const sources = Array.from(
    container.querySelectorAll<HTMLImageElement>("img"),
  ).map((img) => img.getAttribute("src") ?? "");

  if (sources.length === 0) return;

  container.textContent = "";

  const images = sources.map((src, idx) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = `slide-item ${tall ? "slide-item-tall" : ""} ${idx === 0 ? "fade-in" : "fade-out"}`;
    container.appendChild(img);
    return img;
  });

  const timeout = getTimeout(container);
  let currentSlide = 0;

  const timer = window.setInterval(() => {
    images[currentSlide].classList.remove("fade-in");
    images[currentSlide].classList.add("fade-out");

    currentSlide = currentSlide + 1 >= images.length ? 0 : currentSlide + 1;

    images[currentSlide].classList.remove("fade-out");
    images[currentSlide].classList.add("fade-in");
  }, timeout);

  instances.set(container, { container, images, timer });
}

export function initCarousels(root: ParentNode = document): void {
  const containers = root.querySelectorAll<HTMLElement>(".carousel-wrapper");
  containers.forEach(buildCarousel);
}

export function destroyCarousel(container: HTMLElement): void {
  const instance = instances.get(container);
  if (!instance) return;

  window.clearInterval(instance.timer);
  instances.delete(container);
}

export default initCarousels;
