export function HangTightCard() {
  return (
    <div className="flex w-[343px] flex-col items-center gap-2 rounded-3xl bg-white p-4 shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.1),0px_8px_8px_-4px_rgba(10,13,18,0.04)]">
      <div className="flex w-full flex-col items-center gap-1 pt-1">
        <p className="text-center text-lg font-semibold tracking-[-0.54px] text-gray-900">
          Hang Tight!
        </p>
        <p className="text-center text-sm text-gray-600">We are working on your account for you!</p>
      </div>

      <div
        className="my-2 size-[74px] animate-spin rounded-full border-4 border-muted-300 border-t-brand-900"
        role="status"
        aria-label="Loading"
      />

      <p className="text-center text-sm text-gray-600">You&rsquo;ll be allowed in soon...</p>
    </div>
  );
}
