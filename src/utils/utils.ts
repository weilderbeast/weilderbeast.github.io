/**
 * Query selector
 * @param selector
 * @param root
 * @returns
 */
export function qs<T extends Element = Element>(
  selector: string,
  root: ParentNode = document,
): T | null {
  return root.querySelector<T>(selector);
}

/**
 * Query selector multiplu
 * @param selector
 * @param root
 * @returns
 */
export function qsa<T extends Element = Element>(
  selector: string,
  root: ParentNode = document,
): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

/**
 * Query selector care da throw daca elementul nu este gasit.
 * @param selector
 * @param root
 * @returns
 */
export function qsRequired<T extends Element = Element>(
  selector: string,
  root: ParentNode = document,
): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Required element not found: "${selector}"`);
  return el;
}

type TagMap = HTMLElementTagNameMap;

type ElementOptions<T extends HTMLElement> = {
  id?: string;
  class?: string | string[];
  style?: Partial<CSSStyleDeclaration>;
  attrs?: Record<string, string>;
  data?: Record<string, string>;
  props?: Partial<T>;
  html?: string;
  text?: string;
  children?: (HTMLElement | SVGElement | Text)[];
  on?: {
    [K in keyof HTMLElementEventMap]?: (
      this: T,
      ev: HTMLElementEventMap[K],
    ) => void;
  };
};

/**
 * Functie ajutatoare pentru a crea elemente mai rapid. Suporta clase, stiluri, attribute, event-uri, si adaugarea de child elements.
 * @param tag
 * @param options
 * @returns
 */
export function make<K extends keyof TagMap>(
  tag: K,
  options?: ElementOptions<TagMap[K]>,
): TagMap[K] {
  const el = document.createElement(tag);

  if (!options) return el;

  if (options.id) el.id = options.id;

  if (options.class) {
    const classes = Array.isArray(options.class)
      ? options.class
      : options.class.split(" ").filter(Boolean);
    el.classList.add(...classes);
  }

  if (options.style) {
    Object.assign(el.style, options.style);
  }

  if (options.attrs) {
    for (const [k, v] of Object.entries(options.attrs)) {
      el.setAttribute(k, v);
    }
  }

  if (options.data) {
    for (const [k, v] of Object.entries(options.data)) {
      el.dataset[k] = v;
    }
  }

  if (options.props) {
    Object.assign(el, options.props);
  }

  if (options.text != null) {
    el.textContent = options.text;
  } else if (options.html != null) {
    el.innerHTML = options.html;
  }

  if (options.children) {
    el.append(...options.children);
  }

  if (options.on) {
    for (const [event, handler] of Object.entries(options.on)) {
      el.addEventListener(event, handler as EventListener);
    }
  }

  return el;
}
