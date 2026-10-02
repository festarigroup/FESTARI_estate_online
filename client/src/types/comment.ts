export interface CommentItem {
  id: string;
  authorName: string;
  avatar?: string;
  postedAt: string;
  text: string;
  likes?: number;
  /** Object URL of an attached photo. */
  image?: string;
  /** Object URL of an attached voice note. */
  audio?: string;
}

export interface CommentAttachments {
  /** Object URL of an attached photo. */
  image?: string;
  /** Object URL of a recorded voice note. */
  audio?: string;
}
