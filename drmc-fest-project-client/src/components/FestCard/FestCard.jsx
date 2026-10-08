import { Link } from "react-router";
import {
    formatDateRange,
    formatFee,
    getRegistrationState,
} from "../../utils/format";

const FALLBACK_IMG =
    "https://placehold.co/800x450/e5e7eb/6b7280?text=No+cover+image";

export default function FestCard({ fest }) {
    const {_id, name, slug, shortDescription, coverImage, location, schedule, registration, events } = fest;
    const reg = getRegistrationState(fest);

    return (
        <article className="card bg-base-100 border border-base-300 shadow-sm h-full overflow-hidden">
            <figure className="relative aspect-video bg-base-200">
                <img
                    src={coverImage || FALLBACK_IMG}
                    alt={`${name} cover`}
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMG;
                    }}
                    className="h-full w-full object-cover"
                />
                <span
                    className={`badge absolute top-3 left-3 ${reg.open ? "badge-success" : "badge-neutral"
                        }`}
                >
                    {reg.label}
                </span>
            </figure>

            <div className="card-body gap-3">
                <div>
                    <h2 className="card-title text-xl leading-snug">{name}</h2>
                    <p className="mt-1 text-sm text-base-content/70 line-clamp-2">
                        {shortDescription}
                    </p>
                </div>

                <ul className="space-y-1.5 text-sm">
                    <li className="flex items-center gap-2">
                        <CalendarIcon />
                        <span>{formatDateRange(schedule?.startDate, schedule?.endDate)}</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <PinIcon />
                        <span className="truncate">
                            {location?.venue}, {location?.city}
                        </span>
                    </li>
                </ul>

                <div className="flex flex-wrap gap-2">
                    <span className="badge badge-outline">{formatFee(registration?.fee)}</span>
                    <span className="badge badge-outline">
                        {events?.length || 0} {events?.length === 1 ? "event" : "events"}
                    </span>
                    {reg.open && registration?.maxParticipants > 0 && (
                        <span className="badge badge-outline">{reg.seatsLeft} seats left</span>
                    )}
                </div>

                <div className="card-actions mt-auto pt-2">
                    <Link to={`/fests/${_id}`} className="btn btn-primary btn-block">
                        View details
                    </Link>
                </div>
            </div>
        </article>
    );
}

const iconProps = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.6,
    stroke: "currentColor",
    className: "h-4 w-4 shrink-0 text-primary",
};

export const CalendarIcon = () => (
    <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M5.25 5.25h13.5a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-12a1.5 1.5 0 0 1 1.5-1.5Z" />
    </svg>
);

export const PinIcon = () => (
    <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.14-7.5 11.25-7.5 11.25S4.5 17.64 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);
