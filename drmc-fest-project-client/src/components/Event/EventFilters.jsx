import { capitalize } from "../../utils/eventFormat";
 
export default function EventFilters({
  search, onSearch,
  categories, category, onCategory,
  type, onType,
  fee, onFee,
  sort, onSort,
  onClear, hasActiveFilters,
}) {
  return (
    <section aria-label="Filter events" className="mb-6 space-y-4">
      {/* Search */}
      <label className="input input-bordered flex w-full items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="h-4 w-4 opacity-60">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.2-5.2M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
        </svg>
        <input
          type="search"
          className="grow"
          placeholder="Search by event, venue or organizer"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search events"
        />
      </label>
 
      {/* Category chips (scroll sideways on small screens) */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {["all", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onCategory(c)}
            aria-pressed={category === c}
            className={`btn btn-sm shrink-0 ${category === c ? "btn-primary" : "btn-outline"}`}
          >
            {c === "all" ? "All categories" : capitalize(c)}
          </button>
        ))}
      </div>
 
      {/* Secondary filters */}
      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
        <select className="select select-bordered select-sm" value={type} onChange={(e) => onType(e.target.value)} aria-label="Participation type">
          <option value="all">Individual and team</option>
          <option value="individual">Individual</option>
          <option value="team">Team</option>
        </select>
 
        <select className="select select-bordered select-sm" value={fee} onChange={(e) => onFee(e.target.value)} aria-label="Fee">
          <option value="all">Free and paid</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
 
        <select className="select select-bordered select-sm" value={sort} onChange={(e) => onSort(e.target.value)} aria-label="Sort by">
          <option value="date">Soonest first</option>
          <option value="seats">Most seats left</option>
          <option value="fee">Lowest fee</option>
          <option value="name">Name A to Z</option>
        </select>
 
        {hasActiveFilters && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClear}>
            Clear filters
          </button>
        )}
      </div>
    </section>
  );
}