import { registerPage, type Page } from "../../components/page";
import { clean, qsRequired } from "../../utils/utils";
import { guardianFeed } from "../news/guardian";
import { hnItem } from "../news/hacker-news";
import { nytFeed } from "../news/nyt";
import type { HNStory } from "../news/types";

type Source = "hn" | "nyt" | "guardian";

type Params = { source: Source; id: string };

type FeedItem = Awaited<ReturnType<typeof nytFeed>>[number];

type Article = {
  category: string;
  title: string;
  summary?: string;
  author: string;
  source: string;
  date?: string;
  image?: string;
  body?: string;
  link?: string;
};

const styles = [
  "/css/news/news.css",
  "/css/news/page.css",
  "/css/news/article.css",
  "/css/news/modal.css",
];

const fromFeed = (item: FeedItem | undefined, source: string): Article => {
  if (!item) throw new Error("not found");

  return {
    category: item.categories[0],
    title: item.title,
    summary: clean(item.description),
    author: item.author,
    source,
    image: item.thumbnail,
    link: item.link,
  };
};

const loaders: Record<Source, (id: string) => Promise<Article>> = {
  hn: async (id) => {
    const story = (await hnItem(Number(id))) as HNStory;

    return {
      category: "Hacker News",
      title: story.title,
      author: story.by ?? "no author",
      source: "Hacker News",
      date: new Date(story.time * 1000).toLocaleDateString(),
      body: story.text,
      link: story.url,
    };
  },
  nyt: async (id) =>
    fromFeed((await nytFeed("World"))[Number(id)], "New York Times"),
  guardian: async (id) =>
    fromFeed((await guardianFeed("world"))[Number(id)], "The Guardian"),
};

const template = (a: Article) => /*html*/ `
  <div class="kicker">${a.category}</div>
  <h1 class="headline">${a.title}</h1>
  ${a.summary ? `<p class="summary">${a.summary}</p>` : ""}
  <div class="article-meta byline">
    <span>${a.author}</span>
    <span>${[a.source, a.date].filter(Boolean).join(" · ")}</span>
  </div>
  ${
    a.image
      ? /*html*/ `
        <figure class="article-hero">
          <img src="${a.image}" alt="" />
          <figcaption>${a.source}</figcaption>
        </figure>`
      : ""
  }
  ${a.body ? `<div class="article-body">${a.body}</div>` : ""}
  <div class="article-tags">
    <a href="#/news">Back to news</a>
    ${a.link ? `<a href="${a.link}" target="_blank" rel="noopener">Read original</a>` : ""}
  </div>
`;

const content = () => /*html*/ `
    <div class="container row">
        <a class="kicker button unstyled-btn" href="#">Home</a>
        <button class="kicker unstyled-btn" data-toggle="modal" data-target="#theme">Theme</button>
        <button class="kicker unstyled-btn" data-toggle="modal" data-target="#about-modal">About</button>
    </div>
    <main class="article-page" id="story"></main>
    <div id="theme" class="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">themes</h5>
                </div>
                <div class="modal-body">
                    <button type="button" class="dark theme-btn" style="justify-content: space-between">
                        <span class="title" data-theme="dark">dark</span>
                        <span class="hex">#000000</span>
                    </button>
                    <button type="button" class="light theme-btn" style="justify-content: space-between">
                        <span class="title" data-theme="light">light</span>
                        <span class="hex">#ffffff</span>
                    </button>
                    <button type="button" class="ocean theme-btn" style="justify-content: space-between">
                        <span class="title" data-theme="ocean">ocean</span>
                        <span class="hex">#03045e</span>
                    </button>
                    <button type="button" class="child theme-btn" style="justify-content: space-between">
                        <span class="title" data-theme="child">child</span>
                        <span class="hex">#9b5de5</span>
                    </button>
                    <button type="button" class="soft theme-btn" style="justify-content: space-between"> 
                        <span class="title" data-theme="soft">soft</span>
                        <span class="hex">#780116</span>
                    </button>
                </div>
                <div class="modal-footer">
                    <button type="button" data-dismiss="modal">close</button>
                    <button type="button" id="theme-apply-btn">apply</button>
                </div>
            </div>
        </div>
    </div>
    <div id="about-modal" class="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">about</h5>
                </div>
                <div class="modal-body">
                    <p>
                        This site does not own any of the content shown. All headlines,
                        summaries, images, and other data belong to their respective
                        owners and are displayed for informational purposes only.
                    </p>
                    <p>Sources:</p>
                    <p>
                        <a href="https://www.nytimes.com" target="_blank" rel="noopener">The New York Times</a><br />
                        <a href="https://www.theguardian.com" target="_blank" rel="noopener">The Guardian</a><br />
                        <a href="https://news.ycombinator.com" target="_blank" rel="noopener">Hacker News (Y Combinator)</a>
                    </p>
                    <p>
                        Visit the original publishers to read full articles and support their work.
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" data-dismiss="modal">close</button>
                </div>
            </div>
        </div>
    </div>
    `;

const onLoad = async ({ source, id }: Params) => {
  const container = qsRequired("#story");

  try {
    const article = await loaders[source](id);
    container.innerHTML = template(article);
  } catch {
    container.innerHTML = /*html*/ `
      <h1 class="headline">Story not found</h1>
      <div class="article-tags"><a href="/news">Back to news</a></div>
    `;
  }
};

const page: Page<Params> = {
  id: "story",
  title: "Story",
  url: "/story/:source/:id",
  styles,
  content,
  onLoad,
};

registerPage(page);
