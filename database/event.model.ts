import mongoose, { Schema, Document, Model } from "mongoose";

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // Stored as YYYY-MM-DD
  time: string; // Stored as HH:MM (24-hour)
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Produces a URL-safe slug: lowercase, words joined by hyphens, no special chars. */
function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")                   // decompose accented chars
    .replace(/[\u0300-\u036f]/g, "")    // strip diacritic marks
    .replace(/[^\w\s-]/g, "")          // remove non-word chars (except hyphens)
    .replace(/\s+/g, "-")              // spaces → hyphens
    .replace(/-{2,}/g, "-")            // collapse consecutive hyphens
    .replace(/^-|-$/g, "");            // strip leading/trailing hyphens
}

/**
 * Normalises common time strings to HH:MM (24-hour).
 * Accepts:  "9:05", "09:05", "9:05 AM", "9:05 PM", "21:00"
 * Returns null for unrecognised formats.
 */
function normaliseTime(raw: string): string | null {
  const clean = raw.trim().toUpperCase();

  // Match "H:MM" or "HH:MM" optionally followed by " AM" / " PM"
  const match = clean.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3] as "AM" | "PM" | undefined;

  if (minutes > 59) return null;

  if (meridiem === "AM") {
    if (hours === 12) hours = 0;        // 12:xx AM → 00:xx
  } else if (meridiem === "PM") {
    if (hours !== 12) hours += 12;     // 1:xx PM → 13:xx, but 12:xx PM stays 12
  }

  if (hours > 23) return null;

  return `${String(hours).padStart(2, "0")}:${match[2]}`;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const eventSchema = new Schema<IEvent>(
  {
    title:       { type: String, required: true, trim: true },
    // slug is derived automatically; the unique index enforces no duplicates.
    slug:        { type: String, unique: true },
    description: { type: String, required: true, trim: true },
    overview:    { type: String, required: true, trim: true },
    image:       { type: String, required: true, trim: true },
    venue:       { type: String, required: true, trim: true },
    location:    { type: String, required: true, trim: true },
    date:        { type: String, required: true },
    time:        { type: String, required: true },
    mode: {
      type:     String,
      required: true,
      enum:     ["online", "offline", "hybrid"],
    },
    audience:  { type: String, required: true, trim: true },
    agenda:    { type: [String], required: true },
    organizer: { type: String, required: true, trim: true },
    tags:      { type: [String], required: true },
  },
  { timestamps: true }
);

// ---------------------------------------------------------------------------
// Pre-save hook: slug · date · time
// ---------------------------------------------------------------------------

// Async hooks need no `next` parameter — errors are thrown directly,
// and Mongoose awaits the returned Promise automatically.
eventSchema.pre("save", async function () {
  // — Slug —
  // Only regenerate when title is new or has been edited.
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }

  // — Date —
  // Parse any recognisable date string and store as YYYY-MM-DD.
  if (this.isModified("date")) {
    const parsed = new Date(this.date);
    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid date value: "${this.date}"`);
    }
    // toISOString gives "YYYY-MM-DDTHH:mm:ss.sssZ"; we only keep the date part.
    this.date = parsed.toISOString().split("T")[0];
  }

  // — Time —
  // Normalise to HH:MM (24-hour) so storage is always predictable.
  if (this.isModified("time")) {
    const normalised = normaliseTime(this.time);
    if (!normalised) {
      throw new Error(`Invalid time value: "${this.time}". Use HH:MM or H:MM AM/PM.`);
    }
    this.time = normalised;
  }
});

// ---------------------------------------------------------------------------
// Model (guard against hot-reload re-registration in development)
// ---------------------------------------------------------------------------

const Event: Model<IEvent> =
  (mongoose.models.Event as Model<IEvent>) ??
  mongoose.model<IEvent>("Event", eventSchema);

export default Event;
