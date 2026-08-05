export function PhoneFrame({
  children,
  bannerClassName,
  bannerContent,
  bannerHeightClass = "h-28",
  bannerFadeToClass,
}: {
  children: React.ReactNode;
  bannerClassName: string;
  bannerContent?: React.ReactNode;
  bannerHeightClass?: string;
  bannerFadeToClass?: string;
}) {
  return (
    <div className="relative mx-auto w-[260px] shrink-0 rounded-[2.75rem] bg-neutral-950 p-[10px] shadow-2xl">
      <div className="relative h-[540px] w-full overflow-hidden rounded-[2.25rem] bg-white">
        {/* status bar */}
        <div className="absolute inset-x-0 top-0 z-20 flex h-9 items-center justify-between px-6 text-[10px] font-medium text-white/90">
          <span>9:41</span>
          <span>●●●</span>
        </div>
        {/* notch */}
        <div className="absolute left-1/2 top-0 z-30 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-neutral-950" />

        {/* scrollable screen content */}
        <div className="h-full w-full overflow-y-auto">
          <div className={`${bannerHeightClass} w-full shrink-0 ${bannerClassName} relative overflow-hidden`}>
            {bannerContent}
            {bannerFadeToClass && (
              <div className={`absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent ${bannerFadeToClass}`} />
            )}
          </div>
          {children}
        </div>
      </div>

      {/* home indicator */}
      <div className="absolute bottom-2.5 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-white/80" />
    </div>
  );
}
