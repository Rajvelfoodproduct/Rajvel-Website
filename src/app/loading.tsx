export default function Loading() {
  return (
    <div className="min-h-[60svh] flex items-center justify-center bg-[#F7F3E9]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#124328]/20 border-t-[#124328] animate-spin" />
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#276942]">
          Loading Raj Vel Food Products...
        </p>
      </div>
    </div>
  );
}

