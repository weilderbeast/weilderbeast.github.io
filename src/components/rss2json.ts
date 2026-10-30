import { http } from "../utils/utils";

export interface RssItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  categories: string[];
}

interface Rss2JsonResponse {
  status: string;
  message?: string;
  items: RssItem[];
}

export const loadRss = async (
  feedUrl: string,
  what: string,
): Promise<RssItem[]> => {
  const res = await http<Rss2JsonResponse>(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`,
  );
  if (!res.ok) {
    throw new Error(`News API Error: failed to fetch ${what} [${res.status}]`, {
      cause: res.error,
    });
  }
  return res.data.items;
};
