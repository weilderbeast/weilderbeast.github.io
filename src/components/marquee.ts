type Direction = "ltr" | "rtl" | "ttb" | "btt";
type Axis = "x" | "y";

interface MarqueeInstance {
  container: HTMLElement;
  track: HTMLElement;
  direction: Direction;
  axis: Axis;
  resizeObserver: ResizeObserver;
}

const DIRECTION_CLASSES: Record<string, Direction> = {
  "marquee-left-to-right": "ltr",
  "marquee-ltr": "ltr",
  "marquee-right-to-left": "rtl",
  "marquee-rtl": "rtl",
  "marquee-top-to-bottom": "ttb",
  "marquee-ttb": "ttb",
  "marquee-bottom-to-top": "btt",
  "marquee-btt": "btt",
};

const SPEED_CLASSES: Record<string, number> = {
  "marquee-slow": 60,
  "marquee-normal": 120,
  "marquee-fast": 220,
};

const DEFAULT_DIRECTION: Direction = "rtl";
const DEFAULT_SPEED = 120;
const FONT_SCALE = 0.6;
const GAP_RATIO = 0.5;

const instances = new WeakMap<HTMLElement, MarqueeInstance>();
const dirty = new Set<HTMLElement>();
let rafId: number | null = null;

function getDirection(container: HTMLElement): Direction {
  for (const cls in DIRECTION_CLASSES) {
    if (container.classList.contains(cls)) return DIRECTION_CLASSES[cls];
  }
  return DEFAULT_DIRECTION;
}

function getSpeed(container: HTMLElement): number {
  for (const cls in SPEED_CLASSES) {
    if (container.classList.contains(cls)) return SPEED_CLASSES[cls];
  }
  return DEFAULT_SPEED;
}

function scheduleUpdate(container: HTMLElement): void {
  dirty.add(container);
  if (rafId !== null) return;

  rafId = requestAnimationFrame(() => {
    rafId = null;
    const toUpdate = Array.from(dirty);
    dirty.clear();
    for (const el of toUpdate) updateMarquee(el);
  });
}

function buildMarquee(container: HTMLElement): void {
  const existing = instances.get(container);
  if (existing) {
    existing.resizeObserver.disconnect();
  }

  const direction = getDirection(container);
  const axis: Axis = direction === "ttb" || direction === "btt" ? "y" : "x";
  const text = container.textContent?.trim() ?? "";

  container.textContent = "";
  container.dataset.marqueeAxis = axis;

  const track = document.createElement("div");
  track.className = "marquee-track";

  const segment = document.createElement(axis === "x" ? "span" : "div");
  segment.className = "marquee-segment";
  segment.textContent = text;
  track.appendChild(segment);

  container.appendChild(track);

  const resizeObserver = new ResizeObserver(() => scheduleUpdate(container));
  resizeObserver.observe(container);

  instances.set(container, {
    container,
    track,
    direction,
    axis,
    resizeObserver,
  });

  scheduleUpdate(container);
}

function updateMarquee(container: HTMLElement): void {
  const instance = instances.get(container);
  if (!instance) return;

  const { track, direction, axis } = instance;
  const segments = Array.from(track.children) as HTMLElement[];
  if (segments.length === 0) return;

  const baseSegment = segments[0];
  const containerSize =
    axis === "x" ? container.clientWidth : container.clientHeight;
  const crossSize =
    axis === "x" ? container.clientHeight : container.clientWidth;

  if (containerSize === 0 || crossSize === 0) return;

  const fontSize = Math.max(8, crossSize * FONT_SCALE);
  const gap = fontSize * GAP_RATIO;

  track.style.fontSize = `${fontSize}px`;
  for (const seg of segments) {
    if (axis === "x") {
      seg.style.marginRight = `${gap}px`;
      seg.style.marginBottom = "";
    } else {
      seg.style.marginBottom = `${gap}px`;
      seg.style.marginRight = "";
    }
  }

  const rawSize =
    axis === "x" ? baseSegment.offsetWidth : baseSegment.offsetHeight;
  const segmentSize = rawSize + gap;

  if (segmentSize === 0) return;

  const requiredCopies = Math.max(
    2,
    Math.ceil(containerSize / segmentSize) + 1,
  );

  while (track.children.length < requiredCopies) {
    track.appendChild(baseSegment.cloneNode(true));
  }
  while (track.children.length > requiredCopies) {
    track.removeChild(track.lastElementChild as HTMLElement);
  }

  const speed = getSpeed(container);
  const duration = segmentSize / speed;
  const reverse = direction === "ltr" || direction === "ttb";

  track.style.setProperty("--marquee-distance", `${-segmentSize}px`);
  track.style.animationName =
    axis === "x" ? "marquee-scroll-x" : "marquee-scroll-y";
  track.style.animationDuration = `${duration}s`;
  track.style.animationTimingFunction = "linear";
  track.style.animationIterationCount = "infinite";
  track.style.animationDirection = reverse ? "reverse" : "normal";
  track.style.animationPlayState = "running";
}

export function initMarquees(root: ParentNode = document): void {
  const containers = root.querySelectorAll<HTMLElement>(".marquee");
  containers.forEach(buildMarquee);
}

export function refreshMarquees(root: ParentNode = document): void {
  const containers = root.querySelectorAll<HTMLElement>(".marquee");
  containers.forEach((container) => {
    if (instances.has(container)) {
      scheduleUpdate(container);
    } else {
      buildMarquee(container);
    }
  });
}

export function destroyMarquee(container: HTMLElement): void {
  const instance = instances.get(container);
  if (!instance) return;

  instance.resizeObserver.disconnect();
  instances.delete(container);
  dirty.delete(container);
  container.textContent = instance.track.firstElementChild?.textContent ?? "";
  delete container.dataset.marqueeAxis;
}

export default initMarquees;
