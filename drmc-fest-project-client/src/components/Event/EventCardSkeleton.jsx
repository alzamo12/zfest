export default function EventCardSkeleton() {
  return (
    <div className="card border border-base-300 bg-base-100">
      <div className="card-body gap-3">
        <div className="skeleton h-6 w-2/3" />
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-2 w-full mt-2" />
        <div className="skeleton h-10 w-full mt-3" />
      </div>
    </div>
  );
}
 