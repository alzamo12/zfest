export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "TBA";
 
export const formatDateRange = (start, end) => {
  if (!start) return "Date to be announced";
  if (!end || start === end) return formatDate(start);
  const s = new Date(start);
  const e = new Date(end);
  // Same month and year: "17 – 21 Oct 2026"
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} – ${formatDate(end)}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
};
 
// "19:37" -> "7:37 PM"
export const formatTime = (hhmm) => {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
};
 
export const formatFee = (fee) => (!fee ? "Free" : `৳${fee}`);
 
export const capitalize = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);
 
// Works out if people can still sign up.
// Returns { open: boolean, label: string, seatsLeft: number }
export const getRegistrationState = (fest) => {
  const { required, maxParticipants, currentParticipants } =
    fest.registration || {};
  const deadline = fest.schedule?.registrationDeadline;
  const seatsLeft = Math.max((maxParticipants || 0) - (currentParticipants || 0), 0);
 
  if (!required) return { open: false, label: "No registration needed", seatsLeft };
  if (deadline && new Date(deadline) < new Date())
    return { open: false, label: "Registration closed", seatsLeft };
  if (maxParticipants && seatsLeft === 0)
    return { open: false, label: "Fully booked", seatsLeft };
  return { open: true, label: "Registration open", seatsLeft };
};
 
// ---- Event helpers ----
 
// "14 Oct 2026, 4:40 PM"
export const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "TBA";
 
// The event's own date if it has one, otherwise the fest start date
export const getEventDate = (event) =>
  event?.schedule?.date || event?.schedule?.startDate;
 
export const getEventTimeRange = (event) => {
  const { startTime, endTime } = event?.schedule || {};
  if (!startTime) return "";
  return endTime
    ? `${formatTime(startTime)} – ${formatTime(endTime)}`
    : formatTime(startTime);
};
 
export const getEventState = (event) => {
  const max = event.maxParticipants || 0;
  const cur = event.currentParticipants || 0;
  const seatsLeft = Math.max(max - cur, 0);
  const deadline = event.schedule?.registrationDeadline;
 
  if (event.status && event.status !== "active")
    return { open: false, label: "Not available", seatsLeft };
  if (deadline && new Date(deadline) < new Date())
    return { open: false, label: "Registration closed", seatsLeft };
  if (max && seatsLeft === 0)
    return { open: false, label: "Fully booked", seatsLeft };
  return { open: true, label: "Registration open", seatsLeft };
};