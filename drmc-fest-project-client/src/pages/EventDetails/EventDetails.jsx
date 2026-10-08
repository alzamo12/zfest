import { Link, useParams } from "react-router";
import { CalendarIcon, PinIcon } from "../../components/FestCard/FestCard";
import {
    capitalize,
    formatDate,
    formatDateRange,
    formatDateTime,
    formatFee,
    getEventDate,
    getEventState,
    getEventTimeRange,
} from "../../utils/eventFormat";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxiosPublic from "../../hooks/useAxiosPublic";

export default function EventDetails() {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();
    // API call 1: the event
    // const { data: event, isPending, isError, error, refetch } = useEvent(id);

    const { data: event, refetch, isError, isPending, error } = useQuery({
        queryKey: ['eventDetails'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/events/${id}`);
            return res.data
        }
    })

    // API call 2: the fest it belongs to (starts once event.festId is known)
    // const {
    //     data: fest,
    //     isPending: festPending,
    //     isError: festError,
    // } = useFestById(event?.festId);
    const { data: fest, isPending: festPending, error: festError } = useQuery({
        queryKey: ['fest'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/fests/${event.festId}`)
            return res.data
        }
    })

    if (isPending) return <DetailsSkeleton />;

    if (isError || !event) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-20 text-center">
                <h1 className="text-2xl font-bold">Event not found</h1>
                <p className="mt-2 text-base-content/70">
                    {error?.message || "This event may have been removed or the link is wrong."}
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <button className="btn btn-outline" onClick={() => refetch()}>Try again</button>
                    <Link to="/events" className="btn btn-primary">Back to events</Link>
                </div>
            </main>
        );
    }

    const {
        name, description, category, participationType, organizerName, venue,
        prize, rules, registrationFee, maxParticipants, currentParticipants, schedule,
    } = event;
    const state = getEventState(event);
    const time = getEventTimeRange(event);
    const filled = maxParticipants ? Math.round((currentParticipants / maxParticipants) * 100) : 0;

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <Link to="/events" className="btn btn-ghost btn-sm mb-4">← All events</Link>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main column */}
                <div className="space-y-8 lg:col-span-2">
                    <header>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="badge badge-primary badge-outline">{capitalize(category)}</span>
                            <span className="badge badge-outline">{capitalize(participationType)}</span>
                            <span className={`badge ${state.open ? "badge-success" : "badge-neutral"}`}>
                                {state.label}
                            </span>
                        </div>
                        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{name}</h1>
                        {organizerName && (
                            <p className="mt-1 text-base-content/60">Organized by {organizerName}</p>
                        )}
                        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <CalendarIcon />
                                {formatDate(getEventDate(event))}{time && `, ${time}`}
                            </li>
                            <li className="flex items-center gap-2">
                                <PinIcon />
                                {venue || "Venue to be announced"}
                            </li>
                        </ul>
                    </header>

                    <section>
                        <h2 className="text-xl font-semibold">About this event</h2>
                        <p className="mt-2 max-w-prose whitespace-pre-line leading-relaxed text-base-content/80">
                            {description}
                        </p>
                    </section>

                    {prize && (
                        <section>
                            <h2 className="text-xl font-semibold">Prize</h2>
                            <p className="mt-2 text-base-content/80">{prize}</p>
                        </section>
                    )}

                    {rules && (
                        <section>
                            <h2 className="text-xl font-semibold">Rules</h2>
                            <p className="mt-2 max-w-prose whitespace-pre-line leading-relaxed text-base-content/80">
                                {rules}
                            </p>
                        </section>
                    )}

                    <FestInfo fest={fest} loading={festPending && !!event.festId} failed={festError} />
                </div>

                {/* Sidebar */}
                <aside className="lg:sticky lg:top-6 lg:self-start">
                    <div className="card border border-base-300 bg-base-100 shadow-sm">
                        <div className="card-body gap-3">
                            <h2 className="card-title">Registration</h2>

                            <dl className="space-y-2 text-sm">
                                <Row label="Fee" value={formatFee(registrationFee)} />
                                <Row label="Deadline" value={formatDateTime(getEventDate(event))} />
                                <Row label="Capacity" value={maxParticipants || "Unlimited"} />
                                {maxParticipants > 0 && <Row label="Registered" value={currentParticipants} />}
                                {maxParticipants > 0 && <Row label="Seats left" value={state.seatsLeft} />}
                            </dl>

                            {maxParticipants > 0 && (
                                <progress className="progress progress-primary w-full" value={filled} max={maxParticipants} />
                            )}

                            <Link to={`/events/${id}/register`} className="btn btn-primary btn-block mt-2" disabled={!state.open}>
                                {state.open ? "Register now" : state.label}
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}

/* ---------- Fest info (data from API call 2) ---------- */
function FestInfo({ fest, loading, failed }) {
    return (
        <section>
            <h2 className="text-xl font-semibold">Part of this fest</h2>

            {loading ? (
                <div className="skeleton mt-3 h-40 w-full" />
            ) : failed || !fest ? (
                <p className="mt-3 text-base-content/70">Fest details are not available right now.</p>
            ) : (
                <div className="card mt-3 border border-base-300 bg-base-100 sm:card-side">
                    {fest.coverImage && (
                        <figure className="sm:w-56 sm:shrink-0">
                            <img
                                src={fest.coverImage}
                                alt={`${fest.name} cover`}
                                className="h-40 w-full object-cover sm:h-full"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                        </figure>
                    )}
                    <div className="card-body gap-2">
                        <h3 className="card-title">{fest.name}</h3>
                        <p className="line-clamp-2 text-sm text-base-content/70">{fest.shortDescription.slice(0, 80)} ... ...</p>
                        <ul className="space-y-1 text-sm">
                            <li className="flex items-center gap-2">
                                <CalendarIcon />
                                {formatDateRange(fest.schedule?.startDate, fest.schedule?.endDate)}
                            </li>
                            <li className="flex items-center gap-2">
                                <PinIcon />
                                {fest.location?.venue}, {fest.location?.city}
                            </li>
                        </ul>
                        <p className="text-sm text-base-content/60">
                            Organizer: {fest.organizer?.name}
                            {fest.organizer?.email && (
                                <>
                                    {" "}
                                    <a className="link link-hover" href={`mailto:${fest.organizer.email}`}>
                                        {fest.organizer.email}
                                    </a>
                                </>
                            )}
                        </p>
                        <div className="card-actions mt-1">
                            <Link to={`/fests/${fest._id}`} className="btn btn-outline btn-sm">
                                View fest
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

const Row = ({ label, value }) => (
    <div className="flex justify-between gap-4">
        <dt className="text-base-content/60">{label}</dt>
        <dd className="text-right font-medium">{value}</dd>
    </div>
);

function DetailsSkeleton() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <div className="skeleton h-6 w-1/3" />
                    <div className="skeleton h-10 w-2/3" />
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-32 w-full" />
                </div>
                <div className="skeleton h-64 w-full" />
            </div>
        </main>
    );
}
