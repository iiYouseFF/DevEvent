import mongoose, { Schema, Document, Model, Types } from "mongoose";

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IBooking extends Document {
  eventId: Types.ObjectId; // Reference to Event._id
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const bookingSchema = new Schema<IBooking>(
  {
    // Indexed for fast lookups by event (e.g. "how many bookings for event X?").
    eventId: {
      type:     Schema.Types.ObjectId,
      ref:      "Event",
      required: true,
      index:    true,
    },
    email: {
      type:     String,
      required: true,
      trim:     true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

// ---------------------------------------------------------------------------
// Pre-save hook: email validation · event existence check
// ---------------------------------------------------------------------------

// Async hooks need no `next` parameter — errors are thrown directly,
// and Mongoose awaits the returned Promise automatically.
bookingSchema.pre("save", async function () {
  // — Email format —
  // Simple but reliable RFC-5322–subset regex.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    throw new Error(`Invalid email address: "${this.email}"`);
  }

  // — Referenced event existence —
  // Verify the event exists before persisting the booking, so the database
  // never holds orphaned bookings pointing to a non-existent event.
  const eventExists = await mongoose
    .model("Event")
    .exists({ _id: this.eventId });

  if (!eventExists) {
    throw new Error(`Event with id "${this.eventId.toString()}" does not exist.`);
  }
});

// ---------------------------------------------------------------------------
// Model (guard against hot-reload re-registration in development)
// ---------------------------------------------------------------------------

const Booking: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking>) ??
  mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
