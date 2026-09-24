import type { ReactNode } from "react";

const HASHTAG_PATTERN = /#[a-zA-Z0-9_]+/g;

export function renderWithHashtags(text: string): ReactNode {
  const parts = text.split(HASHTAG_PATTERN);
  const matches = text.match(HASHTAG_PATTERN);
  if (!matches) return text;

  const nodes: ReactNode[] = [];
  parts.forEach((part, index) => {
    if (part) nodes.push(part);
    if (matches[index]) {
      nodes.push(
        <span key={index} className="font-semibold text-[#f088b6]">
          {matches[index]}
        </span>,
      );
    }
  });
  return nodes;
}
