import { IDBCache } from "../../components/idb";
import { http } from "../../utils/utils";
import type {
  HNComment,
  HNItem,
  HNMaxItem,
  HNStoryList,
  HNUpdates,
  HNUser,
} from "./types";

const API_BASE = "https://hacker-news.firebaseio.com/v0";

export type HNListKind = "top" | "new" | "best" | "ask" | "show" | "job";

const itemCache = new IDBCache<HNItem>("hn-cache");
const listCache = new IDBCache<HNStoryList>("hn-stories-cache");
const userCache = new IDBCache<HNUser>("hn-users-cache");
const updatesCache = new IDBCache<HNUpdates>("hn-updates-cache", 60 * 1000);
const maxItemCache = new IDBCache<HNMaxItem>("hn-maxitem-cache", 60 * 1000);

const load = async <T>(url: string, what: string): Promise<T> => {
  const res = await http<T>(url);
  if (!res.ok) {
    throw new Error(
      `News API Error: HackerNews failed to fetch ${what} [${res.status}]`,
      { cause: res.error },
    );
  }
  return res.data;
};

export const hnItem = (id: number, force = false) =>
  itemCache.fetch(
    String(id),
    () => load<HNItem>(`${API_BASE}/item/${id}.json`, `item ${id}`),
    force,
  );

export const hnItems = (ids: number[], force = false) =>
  Promise.all(ids.map((id) => hnItem(id, force)));

export const hnComment = async (
  id: number,
  force = false,
): Promise<HNComment> => {
  const item = await hnItem(id, force);
  if (item.type !== "comment") {
    throw new Error(
      `News API Error: item ${id} is a ${item.type}, not a comment`,
    );
  }
  return item;
};

export const hnComments = (ids: number[], force = false) =>
  Promise.all(ids.map((id) => hnComment(id, force)));

export const hnStories = (kind: HNListKind = "top", force = false) =>
  listCache.fetch(
    kind,
    () =>
      load<HNStoryList>(`${API_BASE}/${kind}stories.json`, `${kind} stories`),
    force,
  );

export const hnUser = (id: string, force = false) =>
  userCache.fetch(
    id,
    () => load<HNUser>(`${API_BASE}/user/${id}.json`, `user ${id}`),
    force,
  );

export const hnUpdates = (force = false) =>
  updatesCache.fetch(
    "updates",
    () => load<HNUpdates>(`${API_BASE}/updates.json`, "updates"),
    force,
  );

export const hnMaxItem = (force = false) =>
  maxItemCache.fetch(
    "maxitem",
    () => load<HNMaxItem>(`${API_BASE}/maxitem.json`, "max item"),
    force,
  );
