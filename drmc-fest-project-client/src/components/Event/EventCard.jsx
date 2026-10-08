import { Link } from "react-router";
import {
    capitalize,
    formatDate,
    formatFee,
    getEventDate,
    getEventState,
    getEventTimeRange,
} from "../../utils/eventFormat";

export default function EventCard({ event }) {
    const {
        _id, name, description, category, participationType, organizerName,
        venue, prize, registrationFee, maxParticipants, currentParticipants,
    } = event;
    const state = getEventState(event);
    const time = getEventTimeRange(event);
    const filled = maxParticipants ? Math.round((currentParticipants / maxParticipants) * 100) : 0;

    return (
        <article className="card h-full border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-3">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="card-title text-lg leading-snug">{name}</h2>
                    <span className="badge badge-primary badge-outline shrink-0">
                        {capitalize(category)}
                    </span>
                </div>

                {organizerName && (
                    <p className="text-sm text-base-content/60">by {organizerName}</p>
                )}

                {/* <p className="line-clamp-2 text-sm text-base-content/70">{description}</p> */}

                <dl className="space-y-1 text-sm">
                    <Row label="Date" value={`${formatDate(getEventDate(event))}${time ? `, ${time}` : ""}`} />
                    <Row label="Venue" value={venue || "TBA"} />
                    <Row label="Type" value={capitalize(participationType)} />
                    <Row label="Fee" value={formatFee(registrationFee)} />
                    {prize && <Row label="Prize" value={prize} />}
                </dl>

                {maxParticipants > 0 && (
                    <div>
                        <div className="mb-1 flex justify-between text-xs text-base-content/60">
                            <span>{state.seatsLeft} seats left</span>
                            <span>{currentParticipants}/{maxParticipants}</span>
                        </div>
                        <progress className="progress progress-primary w-full" value={filled} max="100" />
                    </div>
                )}

                <div className="card-actions mt-auto flex-col gap-2 pt-2">
                    <span className={`badge ${state.open ? "badge-success" : "badge-neutral"}`}>
                        {state.label}
                    </span>
                    <Link to={`/events/${_id}`} className="btn btn-primary btn-block">
                        View details
                    </Link>
                </div>
            </div>
        </article>
    );
}

const Row = ({ label, value }) => (
    <div className="flex justify-between gap-4">
        <dt className="text-base-content/60">{label}</dt>
        <dd className="text-right font-medium">{value}</dd>
    </div>
);