interface TextFitInstance {
  container: HTMLElement;
  span: HTMLElement;
  resizeObserver: ResizeObserver;
}

const REFERENCE_FONT_SIZE = 100;
const HEIGHT_SCALE = 0.9;

const instances = new WeakMap<HTMLElement, TextFitInstance>();
const trackedContainers = new Set<HTMLElement>();
const dirty = new Set<HTMLElement>();
let rafId: number | null = null;
let windowResizeWired = false;

function onWindowResize(): void {
  trackedContainers.forEach(scheduleUpdate);
}

function resolveSizeReference(container: HTMLElement): HTMLElement {
  const parent = container.parentElement;
  if (!parent || getComputedStyle(parent).display !== "contents") {
    return container;
  }

  let ancestor: HTMLElement = parent;
  while (
    ancestor.parentElement &&
    getComputedStyle(ancestor.parentElement).display === "contents"
  ) {
    ancestor = ancestor.parentElement;
  }

  return ancestor.parentElement ?? container;
}

function getContentBoxSize(element: HTMLElement): {
  width: number;
  height: number;
} {
  const styles = getComputedStyle(element);
  const paddingX =
    parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
  const paddingY =
    parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);

  return {
    width: element.clientWidth - paddingX,
    height: element.clientHeight - paddingY,
  };
}

function scheduleUpdate(container: HTMLElement): void {
  dirty.add(container);
  if (rafId !== null) return;

  rafId = requestAnimationFrame(() => {
    rafId = null;
    const toUpdate = Array.from(dirty);
    dirty.clear();
    for (const el of toUpdate) updateTextFit(el);
  });
}

function buildTextFit(container: HTMLElement): void {
  const existing = instances.get(container);
  if (existing) {
    existing.resizeObserver.disconnect();
  }

  const text = container.textContent?.trim() ?? "";
  container.textContent = "";

  const span = document.createElement("span");
  span.className = "text-fit-inner";
  span.textContent = text;
  container.appendChild(span);

  const resizeObserver = new ResizeObserver(() => scheduleUpdate(container));
  resizeObserver.observe(container);

  const reference = resolveSizeReference(container);
  if (reference !== container) {
    resizeObserver.observe(reference);
  }

  instances.set(container, { container, span, resizeObserver });
  trackedContainers.add(container);

  if (!windowResizeWired) {
    windowResizeWired = true;
    window.addEventListener("resize", onWindowResize);
  }

  scheduleUpdate(container);
}

function updateTextFit(container: HTMLElement): void {
  const instance = instances.get(container);
  if (!instance) return;

  const { span } = instance;
  const reference = resolveSizeReference(container);
  const { width: containerWidth, height: containerHeight } =
    getContentBoxSize(reference);

  if (containerWidth === 0 || containerHeight === 0) return;

  span.style.fontSize = `${REFERENCE_FONT_SIZE}px`;
  const measuredWidth = span.scrollWidth;

  if (measuredWidth === 0) return;

  const widthFit = REFERENCE_FONT_SIZE * (containerWidth / measuredWidth);
  const heightFit = containerHeight * HEIGHT_SCALE;
  const fontSize = Math.max(1, Math.min(widthFit, heightFit));

  span.style.fontSize = `${fontSize}px`;
}

export function initTextFit(root: ParentNode = document): void {
  const containers = root.querySelectorAll<HTMLElement>(".text-fit");
  containers.forEach(buildTextFit);
}

export function refreshTextFit(root: ParentNode = document): void {
  const containers = root.querySelectorAll<HTMLElement>(".text-fit");
  containers.forEach((container) => {
    if (instances.has(container)) {
      scheduleUpdate(container);
    } else {
      buildTextFit(container);
    }
  });
}

export function destroyTextFit(container: HTMLElement): void {
  const instance = instances.get(container);
  if (!instance) return;

  instance.resizeObserver.disconnect();
  instances.delete(container);
  trackedContainers.delete(container);
  container.textContent = instance.span.textContent ?? "";
}

export default initTextFit;
