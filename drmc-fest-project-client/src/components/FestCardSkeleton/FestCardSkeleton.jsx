export default function FestCardSkeleton() {
  return (
    <div className="card bg-base-100 border border-base-300 overflow-hidden">
      <div className="skeleton aspect-video w-full rounded-none" />
      <div className="card-body gap-3">
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-10 w-full mt-4" />
      </div>
    </div>
  );
}