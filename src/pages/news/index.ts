import { registerPage, type Page } from "../../components/page";
import { clean, qsRequired } from "../../utils/utils";
import { guardianFeed } from "./guardian";
import { hnItem, hnStories } from "./hacker-news";
import { nytFeed } from "./nyt";

//    <section class="categories">
//         <div class="category">
//             <h3 class="section-title"><a href="/category/world">World</a></h3>
//             <article class="story small">
//                 <h2 class="headline"><a href="/article/5">Headline</a></h2>
//                 <div class="byline">By Author</div>
//             </article>
//         </div>
//         <div class="category">
//             <h3 class="section-title"><a href="/category/business">Business</a></h3>
//         </div>
//         <div class="category">
//             <h3 class="section-title"><a href="/category/tech">Tech</a></h3>
//         </div>
//         <div class="category">
//             <h3 class="section-title"><a href="/category/sports">Sports</a></h3>
//         </div>
//     </section>

const styles = [
  "/css/news/page.css",
  "/css/news/modal.css",
  "/css/news/news.css",
];

const content = () => {
  const root = /*html*/ `
    <div class="container row">
        <a class="kicker button unstyled-btn" href="#">Home</a>
        <button class="kicker unstyled-btn" data-toggle="modal" data-target="#theme">Theme</button>
        <button class="kicker unstyled-btn" data-toggle="modal" data-target="#about-modal">About</button>
    </div>
    <main class="container frontpage">
        <section id="lead"></section>
        <section class="sections">
            <div class="col" id="nyt">
                <h3 class="section-title">New York Times</h3>
            </div>
            <div class="col" id="guardian">
                <h3 class="section-title">The Guardian</h3>
            </div>
            <div class="col" id="hn-col">
                <h3 class="section-title">Hacker News</h3>
                <div id="hackernews"></div>
            </div>
        </section>
    </main>

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

  return root;
};

const hnloader = async (containerId: string) => {
  const hncontainer = qsRequired(containerId);

  const stories = (await hnStories("top")).slice(0, 40);

  const articles = await Promise.all(
    stories.map(async (story_id) => {
      const story = await hnItem(story_id);

      // ignore anything that's not a story
      if (story.type !== "story") return "";

      return /*html*/ `
        <div class="category">
            <article class="story small">
                <h2 class="headline"><a href="#/story/hn/${story.id}">${story.title}</a></h2>
                <div class="byline">${story.by ?? "no author"}</div>
            </article>
        </div>
      `;
    }),
  );

  hncontainer.innerHTML = "";

  articles.forEach((art) => {
    if (art === "") return;

    hncontainer.innerHTML += art;
  });
};

const nytloader = async (containerId: string) => {
  const nytcontainer = qsRequired(containerId);

  const stories = await nytFeed("World");

  const headline = stories.splice(0, 1)[0];

  const headlinecontainer = qsRequired("#lead");

  const image =
    headline.thumbnail !== ""
      ? `<img src="${headline.thumbnail}" alt="" />`
      : '<div class="missing-thumb"><div>?</div><div class="smol">There\'s no thumbnail for this article</div></div>';

  headlinecontainer.innerHTML = /*html*/ `
    <article class="story">
        ${image}
        <div class="text">
        <div class="kicker">${headline.categories[0]}</div>
        <h2 class="headline"><a href="#/story/nyt/0">${headline.title}</a></h2>
        <p class="summary">${headline.description}</p>
        <div class="byline">${headline.author} · New York Times</div>
        </div>
    </article>
   `;

  stories.forEach((story, idx) => {
    const { author, categories, description, title } = story;

    const item = /*html*/ `
            <article class="story">
                <div class="kicker">${categories[0]}</div>
                <h2 class="headline"><a href="#/story/nyt/${idx + 1}">${title}</a></h2>
                <p class="summary">${clean(description)}</p>
                <div class="byline">${author}</div>
            </article>
        `;

    nytcontainer.innerHTML += item;
  });
};

const guardianloader = async (containerId: string) => {
  const nytcontainer = qsRequired(containerId);

  const stories = await guardianFeed("world");

  stories.forEach((story, idx) => {
    const { author, categories, description, title } = story;

    const item = /*html*/ `
            <article class="story">
                <div class="kicker">${categories[0]}</div>
                <h2 class="headline"><a href="#/story/guardian/${idx}">${title}</a></h2>
                <p class="summary">${clean(description)}</p>
                <div class="byline">${author}</div>
            </article>
        `;

    nytcontainer.innerHTML += item;
  });
};

const onLoad = async () => {
  await Promise.all([
    hnloader("#hackernews"),
    nytloader("#nyt"),
    guardianloader("#guardian"),
  ]);
};

const page: Page = {
  id: "news",
  title: "Fair News",
  url: "/news",
  content,
  onLoad,
  styles,
};

registerPage(page);
