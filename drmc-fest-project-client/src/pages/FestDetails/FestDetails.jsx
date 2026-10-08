import { Link, useParams } from "react-router";
import { CalendarIcon, PinIcon } from "../../components/FestCard/FestCard";
import {
    capitalize,
    formatDate,
    formatDateRange,
    formatFee,
    formatTime,
    getRegistrationState,
} from "../../utils/format";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic"

const FALLBACK_IMG =
    "https://placehold.co/1200x500/e5e7eb/6b7280?text=No+cover+image";

export default function FestDetails() {
    const { id } = useParams();
    // const [fest, setFest] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");
    const axiosPublic = useAxiosPublic();

    const { data: fest, error: queryError, refetch, isLoading: loading } = useQuery({
        queryKey: ['festDetails'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/fests/${id}`);
            console.log('fest details:', res.data);
            return res.data;
        }
    });

    const { data: events = [] } = useQuery({
        queryKey: ['festEvents', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/events/${fest?._id}`);
            console.log('fest events:', res.data);
            return res.data;
        }
    });

    // useEffect(() => {
    //     const controller = new AbortController();
    //     setError("");
    //     setLoading(true);
    //     getFestBySlug(slug, controller.signal)
    //         .then(setFest)
    //         .catch((err) => {
    //             if (err.name !== "AbortError") setError(err.message);
    //         })
    //         .finally(() => setLoading(false));

    //     return () => controller.abort();
    // }, [slug]);

    if (loading) return <DetailsSkeleton />;

    if (queryError || !fest) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-20 text-center">
                <h1 className="text-2xl font-bold">Fest not found</h1>
                <p className="mt-2 text-base-content/70">
                    {queryError || "This fest may have been removed or the link is wrong."}
                </p>
                <Link to="/" className="btn btn-primary mt-6">
                    Back to all fests
                </Link>
            </main>
        );
    }

    const { name, description, coverImage, organizer, location, schedule, registration } = fest;
    const reg = getRegistrationState(fest);

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <Link to="/upcoming-fests" className="btn btn-ghost btn-sm mb-4">
                ← Back
            </Link>

            <div className="overflow-hidden rounded-box bg-base-200">
                <img
                    src={coverImage || FALLBACK_IMG}
                    alt={`${name} cover`}
                    onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMG;
                    }}
                    className="h-56 w-full object-cover sm:h-80"
                />
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-3">
                {/* Main column */}
                <div className="lg:col-span-2">
                    <h1 className="text-3xl font-bold sm:text-4xl">{name}</h1>

                    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <CalendarIcon />
                            {formatDateRange(schedule?.startDate, schedule?.endDate)}
                        </li>
                        <li className="flex items-center gap-2">
                            <PinIcon />
                            {location?.venue}, {location?.city}
                        </li>
                    </ul>

                    <section className="mt-8">
                        <h2 className="text-xl font-semibold">About this fest</h2>
                        <p className="mt-2 max-w-prose whitespace-pre-line leading-relaxed text-base-content/80">
                            {description}
                        </p>
                    </section>

                    <section className="mt-10">
                        <h2 className="text-xl font-semibold">
                            Events{" "}
                            <span className="badge badge-neutral align-middle">{events.length}</span>
                        </h2>

                        {events.length === 0 ? (
                            <p className="mt-3 text-base-content/70">
                                No events have been added yet.
                            </p>
                        ) : (
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                {events.map((ev) => (
                                    <EventCard key={ev._id} event={ev} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                    <div className="card border border-base-300 bg-base-100 shadow-sm">
                        <div className="card-body gap-3">
                            <h2 className="card-title">Registration</h2>
                            <span className={`badge ${reg.open ? "badge-success" : "badge-neutral"}`}>
                                {reg.label}
                            </span>

                            <dl className="space-y-2 text-sm">
                                <Row label="Fee" value={formatFee(registration?.fee)} />
                                <Row
                                    label="Seats left"
                                    value={
                                        registration?.maxParticipants
                                            ? `${reg.seatsLeft} of ${registration.maxParticipants}`
                                            : "Unlimited"
                                    }
                                />
                                <Row label="Deadline" value={formatDate(schedule?.registrationDeadline)} />
                            </dl>

                            <button className="btn btn-primary btn-block mt-2" disabled={!reg.open}>
                                {reg.open ? "Register now" : reg.label}
                            </button>
                        </div>
                    </div>

                    <div className="card border border-base-300 bg-base-100 shadow-sm">
                        <div className="card-body gap-2">
                            <h2 className="card-title">Organizer</h2>
                            <p className="font-medium">{organizer?.name}</p>
                            <div className="flex flex-col gap-1 text-sm">
                                {organizer?.email && (
                                    <a className="link link-hover break-all" href={`mailto:${organizer.email}`}>
                                        {organizer.email}
                                    </a>
                                )}
                                {organizer?.phone && (
                                    <a className="link link-hover" href={`tel:${organizer.phone}`}>
                                        {organizer.phone}
                                    </a>
                                )}
                                {organizer?.website && (
                                    <a className="link link-hover break-all" href={organizer.website} target="_blank" rel="noreferrer">
                                        Website
                                    </a>
                                )}
                                {organizer?.facebook && (
                                    <a className="link link-hover break-all" href={organizer.facebook} target="_blank" rel="noreferrer">
                                        Facebook
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}

function EventCard({ event }) {
    const { name, description, category, participationType, schedule, venue, prize, registrationFee, maxParticipants, currentParticipants, rules } = event;
    const seatsLeft = Math.max((maxParticipants || 0) - (currentParticipants || 0), 0);

    return (
        <div className="card border border-base-300 bg-base-100">
            <div className="card-body gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="card-title text-lg">{name}</h3>
                    <span className="badge badge-primary badge-outline shrink-0">
                        {capitalize(category)}
                    </span>
                </div>

                <p className="text-sm text-base-content/70 line-clamp-3">{description}</p>

                <dl className="space-y-1 text-sm">
                    <Row label="Date" value={formatDate(schedule?.date)} />
                    <Row
                        label="Time"
                        value={`${formatTime(schedule?.startTime)} – ${formatTime(schedule?.endTime)}`}
                    />
                    <Row label="Venue" value={venue || "TBA"} />
                    <Row label="Type" value={capitalize(participationType)} />
                    <Row label="Fee" value={formatFee(registrationFee)} />
                    {maxParticipants > 0 && <Row label="Seats left" value={seatsLeft} />}
                    {prize && <Row label="Prize" value={prize} />}
                </dl>

                {rules && (
                    <details className="collapse collapse-arrow bg-base-200">
                        <summary className="collapse-title min-h-0 py-2 text-sm font-medium">
                            Rules
                        </summary>
                        <div className="collapse-content whitespace-pre-line text-sm">{rules}</div>
                    </details>
                )}
            </div>
        </div>
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
            <div className="skeleton h-56 w-full sm:h-80" />
            <div className="mt-8 grid gap-8 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <div className="skeleton h-10 w-2/3" />
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-32 w-full" />
                </div>
                <div className="skeleton h-64 w-full" />
            </div>
        </main>
    );
}
