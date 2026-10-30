import { IDBCache } from "../../components/idb";
import { loadRss, type RssItem } from "../../components/rss2json";

const BASE = "https://www.theguardian.com";

export type GuardianSection =
  | "international"
  | "world"
  | "uk-news"
  | "us-news"
  | "politics"
  | "business"
  | "technology"
  | "science"
  | "sport"
  | "culture";

const cache = new IDBCache<RssItem[]>("guardian-cache");

export const guardianFeed = (
  section: GuardianSection = "international",
  force = false,
) =>
  cache.fetch(
    section,
    () => loadRss(`${BASE}/${section}/rss`, `Guardian ${section}`),
    force,
  );
