import toast, { type Toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error";

const VARIANT_STYLES: Record<ToastVariant, { bg: string; bar: string }> = {
  success: { bg: "bg-[#1d5f39]", bar: "bg-[#22c55e]" },
  error: { bg: "bg-[#ef4444]", bar: "bg-white" },
};

function CheckmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1C6.61553 1 5.26215 1.41054 4.111 2.17971C2.95986 2.94888 2.06265 4.04213 1.53284 5.32122C1.00303 6.6003 0.864403 8.00777 1.1345 9.36563C1.4046 10.7235 2.07128 11.9708 3.05025 12.9497C4.02922 13.9287 5.2765 14.5954 6.63436 14.8655C7.99223 15.1356 9.3997 14.997 10.6788 14.4672C11.9579 13.9373 13.0511 13.0401 13.8203 11.889C14.5895 10.7378 15 9.38447 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85651 1 8 1ZM7 10.7954L4.5 8.2954L5.2953 7.5L7 9.2046L10.705 5.5L11.5028 6.29295L7 10.7954Z"
        fill="white"
      />
    </svg>
  );
}

function InformationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1C6.61553 1 5.26215 1.41054 4.111 2.17971C2.95986 2.94888 2.06265 4.04213 1.53284 5.32122C1.00303 6.6003 0.864403 8.00777 1.1345 9.36563C1.4046 10.7235 2.07128 11.9708 3.05025 12.9497C4.02922 13.9287 5.2765 14.5954 6.63436 14.8655C7.99223 15.1356 9.3997 14.997 10.6788 14.4672C11.9579 13.9373 13.0511 13.0401 13.8203 11.889C14.5895 10.7378 15 9.38447 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85651 1 8 1V1ZM8 4C8.14833 4 8.29334 4.04399 8.41667 4.1264C8.54001 4.20881 8.63614 4.32594 8.69291 4.46299C8.74967 4.60003 8.76452 4.75083 8.73559 4.89632C8.70665 5.0418 8.63522 5.17544 8.53033 5.28033C8.42544 5.38522 8.2918 5.45665 8.14631 5.48559C8.00083 5.51453 7.85003 5.49968 7.71298 5.44291C7.57594 5.38614 7.45881 5.29001 7.37639 5.16668C7.29398 5.04334 7.25 4.89834 7.25 4.75C7.25 4.55109 7.32901 4.36032 7.46967 4.21967C7.61032 4.07902 7.80108 4 8 4ZM10 12.0625H6V10.9375H7.4375V8.0625H6.5V6.9375H8.5625V10.9375H10V12.0625Z"
        fill="white"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M12 4.7L11.3 4L8 7.3L4.7 4L4 4.7L7.3 8L4 11.3L4.7 12L8 8.7L11.3 12L12 11.3L8.7 8L12 4.7Z" fill="white" />
    </svg>
  );
}

interface AppToastProps {
  toastInstance: Toast;
  variant: ToastVariant;
  message: string;
}

function AppToast({ toastInstance, variant, message }: AppToastProps) {
  const { bg, bar } = VARIANT_STYLES[variant];

  return (
    <div
      className={cn(
        "relative flex w-[343px] items-center gap-2 overflow-hidden rounded-lg px-4 pb-6 pt-4 shadow-[0px_0px_40px_0px_rgba(69,71,69,0.2)]",
        bg,
        toastInstance.visible ? "animate-enter" : "animate-leave",
      )}
    >
      {variant === "success" ? <CheckmarkIcon /> : <InformationIcon />}
      <p className="flex-1 text-sm text-white">{message}</p>
      <button
        type="button"
        onClick={() => toast.dismiss(toastInstance.id)}
        className="absolute right-[5px] top-1"
        aria-label="Dismiss"
      >
        <CloseIcon />
      </button>
      <div
        className={cn("absolute bottom-0 left-0 h-[5px]", bar)}
        style={{ animation: `toast-progress ${toastInstance.duration ?? 4000}ms linear forwards` }}
      />
    </div>
  );
}

function showToast(variant: ToastVariant, message: string) {
  return toast.custom((t) => <AppToast toastInstance={t} variant={variant} message={message} />, {
    duration: 4000,
  });
}

export function showSuccessToast(message: string) {
  return showToast("success", message);
}

export function showErrorToast(message: string) {
  return showToast("error", message);
}
