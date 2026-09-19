interface DividerProps {
  label?: string;
}

export function Divider({ label }: DividerProps) {
  if (!label) {
    return <hr className="w-full border-t border-muted-300" />;
  }

  return (
    <div className="flex w-full items-center gap-2.5">
      <hr className="h-0 flex-1 border-t border-muted-300" />
      <span className="text-base font-semibold text-muted-400">{label}</span>
      <hr className="h-0 flex-1 border-t border-muted-300" />
    </div>
  );
}
