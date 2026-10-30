export type HNItemType = "job" | "story" | "comment" | "poll" | "pollopt";

interface HNItemBase {
  id: number;
  by?: string;
  time: number;
  deleted?: boolean;
  dead?: boolean;
}

export interface HNStory extends HNItemBase {
  type: "story";
  title: string;
  score: number;
  descendants: number;
  kids?: number[];
  url?: string;
  text?: string;
}

export interface HNComment extends HNItemBase {
  type: "comment";
  parent: number;
  text?: string;
  kids?: number[];
}

export interface HNJob extends HNItemBase {
  type: "job";
  title: string;
  score: number;
  text?: string;
  url?: string;
}

export interface HNPoll extends HNItemBase {
  type: "poll";
  title: string;
  score: number;
  descendants: number;
  parts: number[];
  kids?: number[];
  text?: string;
}

export interface HNPollOpt extends HNItemBase {
  type: "pollopt";
  poll: number;
  score: number;
  text?: string;
}

export type HNItem = HNStory | HNComment | HNJob | HNPoll | HNPollOpt;

export interface HNUser {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
}

export interface HNUpdates {
  items: number[];
  profiles: string[];
}

export type HNMaxItem = number;
export type HNStoryList = number[];
