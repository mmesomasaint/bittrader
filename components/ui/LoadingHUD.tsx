export default function LoadingHUD() {
  return (
    <div className="w-full h-full p-8 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-white/5 rounded-lg" />
          <div className="h-3 w-40 bg-white/5 rounded" />
        </div>
        <div className="h-10 w-32 bg-white/5 rounded-xl" />
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between">
              <div className="h-4 w-12 bg-white/5 rounded" />
              <div className="h-4 w-4 bg-white/5 rounded-full" />
            </div>
            <div className="h-10 w-24 bg-white/5 rounded" />
            <div className="h-2 w-full bg-white/10 rounded mt-4" />
          </div>
        ))}
      </div>

      {/* Detailed Log Skeleton */}
      <div className="h-64 bg-[#0A0A0A] border border-white/5 rounded-2xl" />
    </div>
  );
}