interface Hashtag {
  tag: string;
  posts: string;
}

const HASHTAGS: Hashtag[] = [
  { tag: "#LuxuryLiving", posts: "2.1k posts" },
  { tag: "#AccraRealEstate", posts: "1.8k posts" },
  { tag: "#HomeGoals", posts: "1.6k posts" },
  { tag: "#BuildWithBiltLinx", posts: "1.1k posts" },
  { tag: "#InteriorInspo", posts: "980 posts" },
];

export function TrendingHashtagsCard() {
  return (
    <div className="flex w-full flex-col gap-[15px] rounded-[15px] border border-[#e6d7ef] bg-white p-[11px]">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-bold text-gray-700">Trending Hashtags</p>
        <button type="button" className="text-[12.5px] font-medium text-brand-600">
          View all
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {HASHTAGS.map((hashtag) => (
          <li key={hashtag.tag} className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-bold text-gray-700">{hashtag.tag}</p>
            <p className="text-[9.5px] font-bold text-brand-900">{hashtag.posts}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
