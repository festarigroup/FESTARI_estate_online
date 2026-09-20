import { Spinner } from "@/components/shared/Spinner";

interface HangTightCardProps {
  heading?: string;
  body?: string;
  footer?: string;
}

export function HangTightCard({
  heading = "Hang Tight!",
  body = "We are working on your account for you!",
  footer = "You'll be allowed in soon...",
}: HangTightCardProps) {
  return (
    <div className="flex w-[343px] flex-col items-center gap-2 rounded-3xl bg-white p-4 shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.1),0px_8px_8px_-4px_rgba(10,13,18,0.04)] dark:bg-night-800">
      <div className="flex w-full flex-col items-center gap-1 pt-1">
        <p className="text-center text-lg font-semibold tracking-[-0.54px] text-gray-900 dark:text-white">
          {heading}
        </p>
        <p className="text-center text-sm text-gray-600 dark:text-muted-300">{body}</p>
      </div>

      <div className="my-2">
        <Spinner size={48} />
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-muted-300">{footer}</p>
    </div>
  );
}
