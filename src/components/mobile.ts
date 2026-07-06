import { qsa } from "../utils/utils";

const VIEWPORT_CLASSES_ATTR = "data-viewport-classes";
const VIEWPORT_BREAKPOINT = 1024;
const MEDIA_QUERY = `(max-width: ${VIEWPORT_BREAKPOINT}px)`;

function parseClassList(value: string): string[] {
  return value.split(/\s+/).filter(Boolean);
}

function syncElementClasses(el: Element, matches: boolean): void {
  const raw = el.getAttribute(VIEWPORT_CLASSES_ATTR);
  if (!raw) return;

  const classes = parseClassList(raw);
  if (classes.length === 0) return;

  if (matches) {
    el.classList.add(...classes);
  } else {
    el.classList.remove(...classes);
  }
}

function syncAllElements(root: ParentNode, matches: boolean): void {
  const elements = qsa<Element>(`[${VIEWPORT_CLASSES_ATTR}]`, root);
  for (const el of elements) {
    syncElementClasses(el, matches);
  }
}

export function initViewportClassSync(root: ParentNode = document): () => void {
  const mql = window.matchMedia(MEDIA_QUERY);

  const handleChange = (e: MediaQueryList | MediaQueryListEvent): void => {
    syncAllElements(root, e.matches);
  };

  handleChange(mql);

  mql.addEventListener("change", handleChange);

  return () => mql.removeEventListener("change", handleChange);
}

export function refreshViewportClassSync(root: ParentNode = document): void {
  const matches = window.matchMedia(MEDIA_QUERY).matches;
  syncAllElements(root, matches);
}
