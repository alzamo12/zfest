import { useState } from "react";
import { Link, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { CalendarIcon, PinIcon } from "../../components/FestCard/FestCard";
import {
    capitalize,
    formatDate,
    formatDateTime,
    formatFee,
    getEventDate,
    getEventState,
    getEventTimeRange,
} from "../../utils/format";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s-]{7,15}$/;
const MAX_MEMBERS = 5;

export default function EventRegistration() {
    // Route must be: /events/:eventId/register
    const { id: eventId } = useParams();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // The page loads the event itself (it no longer receives it as a prop)
    //   const { data: event, isPending: eventLoading, isError: eventError } = useEvent(eventId);
    const { data: event, isPending: eventLoading, isError: eventError } = useQuery({
        queryKey: ['eventDetails'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/events/${eventId}`);
            return res.data
        }
    })

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        institution: "",
        teamName: "",
    });
    const [members, setMembers] = useState([""]);
    const [clientErrors, setClientErrors] = useState({});

    const mutation = useMutation({
        mutationFn: async (data) => {
            const res = await axiosSecure.post("/register", data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Registration successful");
            // Refresh seat counts on the event pages
            queryClient.invalidateQueries({ queryKey: ["event", eventId] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });

    const isTeam = event?.participationType === "team";

    const serverErrors = mutation.error?.response?.data?.errors || {};
    const errors = Object.keys(clientErrors).length ? clientErrors : serverErrors;
    const formMessage =
        mutation.isError && Object.keys(serverErrors).length === 0
            ? mutation.error.response?.data?.message || mutation.error.message
            : "";

    const setField = (name) => (e) => {
        setForm((f) => ({ ...f, [name]: e.target.value }));
        setClientErrors((c) => ({ ...c, [name]: undefined }));
        if (mutation.isError) mutation.reset();
    };

    const updateMember = (i, value) => {
        setMembers((list) => list.map((m, idx) => (idx === i ? value : m)));
        setClientErrors((c) => ({ ...c, members: undefined }));
    };

    const validate = () => {
        const errs = {};
        if (form.fullName.trim().length < 2) errs.fullName = "Enter your full name";
        if (!EMAIL_RE.test(form.email.trim())) errs.email = "Enter a valid email address";
        if (!PHONE_RE.test(form.phone.trim())) errs.phone = "Enter a valid phone number";
        if (!form.institution.trim()) errs.institution = "Enter your institution";
        if (isTeam) {
            if (!form.teamName.trim()) errs.teamName = "Enter a team name";
            if (!members.some((m) => m.trim())) errs.members = "Add at least one teammate";
        }
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        setClientErrors(errs);
        if (Object.keys(errs).length) return;

        const payload = {
            eventId,
            festId: event.festId,
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            institution: form.institution,
        };
        if (isTeam) {
            payload.teamName = form.teamName;
            payload.members = members.map((m) => m.trim()).filter(Boolean);
        }
        mutation.mutate(payload);
    };

    /* ---------- page states ---------- */
    if (eventLoading) return <PageSkeleton />;

    if (eventError || !event) {
        return (
            <Centered>
                <h1 className="text-2xl font-bold">Event not found</h1>
                <p className="mt-2 text-base-content/70">
                    This event may have been removed or the link is wrong.
                </p>
                <Link to="/events" className="btn btn-primary mt-6">Back to events</Link>
            </Centered>
        );
    }

    const state = getEventState(event);

    if (mutation.isSuccess) {
        return (
            <Centered>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-7 w-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold">You're registered</h1>
                <p className="mt-2 text-base-content/70">
                    {form.fullName}, you're in for <span className="font-medium">{event.name}</span>.
                    Keep an eye on {form.email} for updates.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link to={`/events/${eventId}`} className="btn btn-outline">View event</Link>
                    <Link to="/events" className="btn btn-primary">Browse more events</Link>
                </div>
            </Centered>
        );
    }

    if (!state.open) {
        return (
            <Centered>
                <h1 className="text-2xl font-bold">{state.label}</h1>
                <p className="mt-2 text-base-content/70">
                    You can't register for {event.name} right now.
                </p>
                <Link to={`/events/${eventId}`} className="btn btn-primary mt-6">Back to event</Link>
            </Centered>
        );
    }

    const time = getEventTimeRange(event);

    return (
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <Link to={`/events/${eventId}`} className="btn btn-ghost btn-sm mb-4">
                ← Back to event
            </Link>

            <div className="grid gap-8 lg:grid-cols-5">
                {/* Event summary (shown first on mobile) */}
                <aside className="order-first lg:order-last lg:col-span-2 lg:sticky lg:top-6 lg:self-start">
                    <div className="card border border-base-300 bg-base-100 shadow-sm">
                        <div className="card-body gap-3">
                            <span className="badge badge-primary badge-outline w-fit">
                                {capitalize(event.category)}
                            </span>
                            <h2 className="card-title">{event.name}</h2>
                            {event.organizerName && (
                                <p className="text-sm text-base-content/60">by {event.organizerName}</p>
                            )}

                            <ul className="space-y-1.5 text-sm">
                                <li className="flex items-center gap-2">
                                    <CalendarIcon />
                                    {formatDate(getEventDate(event))}{time && `, ${time}`}
                                </li>
                                <li className="flex items-center gap-2">
                                    <PinIcon />
                                    {event.venue || "Venue to be announced"}
                                </li>
                            </ul>

                            <dl className="space-y-1 border-t border-base-300 pt-3 text-sm">
                                <Row label="Fee" value={formatFee(event.registrationFee)} />
                                <Row label="Type" value={capitalize(event.participationType)} />
                                <Row label="Deadline" value={formatDateTime(event.schedule?.registrationDeadline)} />
                                {event.maxParticipants > 0 && (
                                    <Row label="Seats left" value={state.seatsLeft} />
                                )}
                            </dl>
                        </div>
                    </div>
                </aside>

                {/* Form */}
                <section className="lg:col-span-3">
                    <h1 className="text-2xl font-bold sm:text-3xl">Register for {event.name}</h1>
                    <p className="mt-1 text-base-content/70">
                        {isTeam ? "Team event. Fill in your details and add your teammates." : "Fill in your details to secure a seat."}
                    </p>

                    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                        <Field id="fullName" label={isTeam ? "Your name (team leader)" : "Full name"} error={errors.fullName}>
                            <input id="fullName" className={inputClass(errors.fullName)} value={form.fullName} onChange={setField("fullName")} autoComplete="name" />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field id="email" label="Email" error={errors.email}>
                                <input id="email" type="email" className={inputClass(errors.email)} value={form.email} onChange={setField("email")} autoComplete="email" />
                            </Field>

                            <Field id="phone" label="Phone" error={errors.phone}>
                                <input id="phone" type="tel" className={inputClass(errors.phone)} value={form.phone} onChange={setField("phone")} autoComplete="tel" placeholder="+8801XXXXXXXXX" />
                            </Field>
                        </div>

                        <Field id="institution" label="Institution" error={errors.institution}>
                            <input id="institution" className={inputClass(errors.institution)} value={form.institution} onChange={setField("institution")} placeholder="e.g. Notre Dame College" />
                        </Field>

                        {isTeam && (
                            <>
                                <Field id="teamName" label="Team name" error={errors.teamName}>
                                    <input id="teamName" className={inputClass(errors.teamName)} value={form.teamName} onChange={setField("teamName")} />
                                </Field>

                                <div>
                                    <span className="mb-1 block text-sm font-medium">Teammates</span>
                                    <div className="space-y-2">
                                        {members.map((m, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    className={inputClass(errors.members && !m.trim())}
                                                    value={m}
                                                    onChange={(e) => updateMember(i, e.target.value)}
                                                    placeholder={`Teammate ${i + 1} name`}
                                                    aria-label={`Teammate ${i + 1} name`}
                                                />
                                                {members.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-ghost btn-square"
                                                        onClick={() => setMembers((l) => l.filter((_, idx) => idx !== i))}
                                                        aria-label={`Remove teammate ${i + 1}`}
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {errors.members && <p className="mt-1 text-sm text-error">{errors.members}</p>}
                                    {members.length < MAX_MEMBERS && (
                                        <button type="button" className="btn btn-ghost btn-sm mt-2" onClick={() => setMembers((l) => [...l, ""])}>
                                            + Add teammate
                                        </button>
                                    )}
                                </div>
                            </>
                        )}

                        {formMessage && (
                            <div role="alert" className="alert alert-error py-2 text-sm">
                                <span>{formMessage}</span>
                            </div>
                        )}

                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                            <Link to={`/events/${eventId}`} className="btn btn-ghost">Cancel</Link>
                            <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
                                {mutation.isPending && <span className="loading loading-spinner loading-sm" />}
                                {mutation.isPending ? "Registering" : "Confirm registration"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}

/* ---------- small helpers ---------- */
const inputClass = (hasError) => `input input-bordered w-full ${hasError ? "input-error" : ""}`;

function Field({ id, label, error, children }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
            {children}
            {error && <p className="mt-1 text-sm text-error">{error}</p>}
        </div>
    );
}

const Row = ({ label, value }) => (
    <div className="flex justify-between gap-4">
        <dt className="text-base-content/60">{label}</dt>
        <dd className="text-right font-medium">{value}</dd>
    </div>
);

const Centered = ({ children }) => (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">{children}</main>
);

function PageSkeleton() {
    return (
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-5">
                <div className="space-y-4 lg:col-span-3">
                    <div className="skeleton h-9 w-2/3" />
                    <div className="skeleton h-12 w-full" />
                    <div className="skeleton h-12 w-full" />
                    <div className="skeleton h-12 w-full" />
                </div>
                <div className="skeleton h-64 w-full lg:col-span-2" />
            </div>
        </main>
    );
}
