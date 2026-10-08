import { useMemo, useState } from "react";
import EventCard from "../../components/Event/EventCard";
import EventCardSkeleton from "../../components/Event/EventCardSkeleton";
import EventFilters from "../../components/Event/EventFilters";
import { getEventDate, getEventState } from "../../utils/eventFormat";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
export default function Events() {
    // const { data: events = [], isPending, isError, error, refetch } = useEvents();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [type, setType] = useState("all");
    const [fee, setFee] = useState("all");
    const [sort, setSort] = useState("date");

    const axiosPublic = useAxiosPublic();
    const { data: events = [], isPending, isError, error, refetch } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/events?search=${search}&category=${category}&type=${type}&fee=${fee}&sort=${sort}`);
            return res.data;
        }
    })

    // Categories come from the data, so new ones appear automatically
    const categories = useMemo(
        () => [...new Set(events.map((e) => e.category).filter(Boolean))].sort(),
        [events]
    );

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        const list = events.filter((e) => {
            if (category !== "all" && e.category !== category) return false;
            if (type !== "all" && e.participationType !== type) return false;
            if (fee === "free" && e.registrationFee > 0) return false;
            if (fee === "paid" && !(e.registrationFee > 0)) return false;
            if (!q) return true;
            return [e.name, e.description, e.venue, e.organizerName, e.category]
                .filter(Boolean)
                .some((v) => v.toLowerCase().includes(q));
        });

        const byDate = (a, b) => new Date(getEventDate(a) || 0) - new Date(getEventDate(b) || 0);
        const sorters = {
            date: byDate,
            seats: (a, b) => getEventState(b).seatsLeft - getEventState(a).seatsLeft,
            fee: (a, b) => (a.registrationFee || 0) - (b.registrationFee || 0),
            name: (a, b) => a.name.localeCompare(b.name),
        };
        return [...list].sort(sorters[sort]);
    }, [events, search, category, type, fee, sort]);

    const hasActiveFilters =
        search || category !== "all" || type !== "all" || fee !== "all";

    const clearFilters = () => {
        setSearch("");
        setCategory("all");
        setType("all");
        setFee("all");
    };

    return (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold sm:text-4xl">Events</h1>
                <p className="mt-1 text-base-content/70">
                    Browse competitions and activities from every fest.
                </p>
            </header>

            <EventFilters
                search={search} onSearch={setSearch}
                categories={categories} category={category} onCategory={setCategory}
                type={type} onType={setType}
                fee={fee} onFee={setFee}
                sort={sort} onSort={setSort}
                onClear={clearFilters} hasActiveFilters={!!hasActiveFilters}
            />

            {isError ? (
                <div role="alert" className="alert alert-error">
                    <span>Couldn't load events: {error.message}</span>
                    <button className="btn btn-sm" onClick={() => refetch()}>Try again</button>
                </div>
            ) : isPending ? (
                <Grid>
                    {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
                </Grid>
            ) : filtered.length === 0 ? (
                <div className="rounded-box border border-dashed border-base-300 py-20 text-center">
                    <p className="text-lg font-medium">
                        {events.length === 0 ? "No events yet" : "No events match your filters"}
                    </p>
                    <p className="mt-1 text-base-content/70">
                        {events.length === 0 ? "Check back soon." : "Try a different search or clear the filters."}
                    </p>
                    {hasActiveFilters && (
                        <button className="btn btn-outline btn-sm mt-4" onClick={clearFilters}>
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <p className="mb-4 text-sm text-base-content/60" aria-live="polite">
                        Showing {filtered.length} of {events.length} events
                    </p>
                    <Grid>
                        {filtered.map((event) => <EventCard key={event._id} event={event} />)}
                    </Grid>
                </>
            )}
        </main>
    );
}

const Grid = ({ children }) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
);
