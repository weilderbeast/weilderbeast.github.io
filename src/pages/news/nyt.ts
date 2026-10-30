import { IDBCache } from "../../components/idb";
import { type RssItem, loadRss } from "../../components/rss2json";

const BASE = "https://rss.nytimes.com/services/xml/rss/nyt";

export type NytSection =
  | "HomePage"
  | "World"
  | "US"
  | "Politics"
  | "Business"
  | "Technology"
  | "Science"
  | "Health"
  | "Sports"
  | "Arts"
  | "Opinion";

const cache = new IDBCache<RssItem[]>("nyt-cache");

export const nytFeed = (section: NytSection = "HomePage", force = false) =>
  cache.fetch(
    section,
    () => loadRss(`${BASE}/${section}.xml`, `NYT ${section}`),
    force,
  );
