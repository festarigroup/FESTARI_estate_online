export interface PostedStory {
  url: string;
  isVideo: boolean;
  caption?: string;
}

export interface MyStory extends PostedStory {
  id: string;
  postedAt: number;
}
