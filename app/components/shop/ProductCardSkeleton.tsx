export default function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="
        relative overflow-hidden
        rounded-sm
        border border-black/5
        bg-white
        shadow-sm
      "
    >
      <div className="at-shiny-glass-effect relative aspect-square w-full bg-[#e3e3e6]" />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="at-shiny-glass-effect h-[18px] w-[72%] rounded-sm bg-[#e3e3e6]" />

            <div className="at-shiny-glass-effect mt-2 h-3 w-[42%] rounded-sm bg-[#e3e3e6]" />
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="at-shiny-glass-effect h-[18px] w-16 rounded-sm bg-[#e3e3e6]" />

            <div className="at-shiny-glass-effect h-3 w-12 rounded-sm bg-[#e3e3e6]" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="at-shiny-glass-effect h-3 w-16 rounded-sm bg-[#e3e3e6]" />

          <div className="flex items-center gap-2">
            <div className="at-shiny-glass-effect h-px w-8 bg-[#e3e3e6]" />

            <div className="at-shiny-glass-effect h-3 w-3 rounded-sm bg-[#e3e3e6]" />
          </div>
        </div>
      </div>
    </div>
  );
}