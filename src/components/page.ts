import { qsRequired } from "../utils/utils";
import initModals from "./modal";
import { initThemes } from "./theme";

export type Params = Record<string, string>;

export type Page<P extends Params = Params> = {
  id: string;
  url: string;
  title: string;
  content: (params: P) => string | HTMLElement;
  onLoad?: (params: P) => Promise<void> | void;
  styles?: string[];
};

type Match = { page: Page<any>; params: Params };

const pages: Record<string, Page<any>> = {};
let root: HTMLElement;
let css: HTMLLinkElement[] = [];

const matchUrl = (pattern: string, path: string): Params | null => {
  const a = pattern.split("/").filter(Boolean);
  const b = path.split("/").filter(Boolean);
  if (a.length !== b.length) return null;

  const params: Params = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(":")) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
};

const resolvePath = (path: string): Match | undefined => {
  for (const page of Object.values(pages)) {
    const params = matchUrl(page.url, path);
    if (params) return { page, params };
  }
};

const buildUrl = (pattern: string, params: Params = {}) =>
  pattern.replace(/:(\w+)/g, (_, key) => encodeURIComponent(params[key] ?? ""));

const loadStyles = (urls: string[] = []) =>
  Promise.all(
    urls.map(
      (href) =>
        new Promise<HTMLLinkElement>((resolve) => {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = href;
          link.onload = link.onerror = () => resolve(link);
          document.head.append(link);
        }),
    ),
  );

const render = async (
  { content, title, onLoad, styles }: Page<any>,
  params: Params = {},
) => {
  const loadingscreen = qsRequired<HTMLElement>("#loading");
  loadingscreen.classList.add("show");

  const next = await loadStyles(styles);
  css.forEach((link) => link.remove());
  css = next;
  document.title = title;

  const cont = content(params);
  root.innerHTML = "";

  if (typeof cont === "string") {
    root.innerHTML = cont;
  } else {
    root.append(cont);
  }

  initModals();

  await onLoad?.(params);

  initThemes();

  loadingscreen.classList.remove("show");
};

export const registerPage = <P extends Params>(page: Page<P>) => {
  if (pages[page.id]) {
    console.error(`tried registering the same page twice: ${page.id}`);
    return;
  }

  pages[page.id] = page;
};

export const getPage = (term: string): Page<any> | undefined =>
  term.startsWith("/") ? resolvePath(term)?.page : pages[term];

const currentPath = () => location.hash.slice(1) || "/";

const resolveCurrent = (fallback: string): Match | undefined =>
  resolvePath(currentPath()) ??
  (pages[fallback] ? { page: pages[fallback], params: {} } : undefined);

export const navigate = (target: string, params: Params = {}) => {
  const page = pages[target];

  if (!page) {
    console.error(`tried navigating to a page that doesn't exist: ${target}`);
    return;
  }

  const hash = buildUrl(page.url, params);

  if (currentPath() === hash) {
    render(page, params);
    return;
  }

  location.hash = hash;
};

export const initRouter = (el: HTMLElement, fallback = "home") => {
  root = el;

  window.addEventListener("hashchange", () => {
    const match = resolveCurrent(fallback);
    if (match) render(match.page, match.params);
  });

  const match = resolveCurrent(fallback);
  if (match) render(match.page, match.params);
};
