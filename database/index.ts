/**
 * Single entry point for all database models.
 *
 * Usage:
 *   import { Event, Booking } from "@/database";
 *   import type { IEvent, IBooking } from "@/database";
 */

export { default as Event } from "./event.model";
export type { IEvent } from "./event.model";

export { default as Booking } from "./booking.model";
export type { IBooking } from "./booking.model";
