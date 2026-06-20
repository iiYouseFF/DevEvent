import mongoose, { type Connection } from "mongoose";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Shape of the connection cache stored on the Node.js `global` object.
 * We persist it on `global` so that hot-reloads in development don't cause
 * a flood of new connections (Next.js re-evaluates modules on every request
 * in dev mode, but `global` survives across those re-evaluations).
 */
interface MongooseCache {
  /** The active Mongoose connection, or null if not yet connected. */
  conn: Connection | null;
  /**
   * A pending connection Promise so that concurrent callers can await the
   * same handshake instead of opening parallel connections.
   */
  promise: Promise<Connection> | null;
}

// ---------------------------------------------------------------------------
// Global cache declaration
// ---------------------------------------------------------------------------

// Extend the Node.js GlobalThis to include our cache namespace.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

// Initialise the cache exactly once per process lifetime.
const cached: MongooseCache = (global._mongooseCache ??= {
  conn: null,
  promise: null,
});

// ---------------------------------------------------------------------------
// Connection helper
// ---------------------------------------------------------------------------

/**
 * Returns a cached Mongoose `Connection`.
 *
 * Call this at the top of every API route / Server Action that needs the DB:
 * ```ts
 * import dbConnect from "@/lib/mongoose";
 * const conn = await dbConnect();
 * ```
 *
 * @throws {Error} If `MONGODB_URI` is not set in the environment.
 */
export default async function dbConnect(): Promise<Connection> {
  // Return the already-open connection immediately.
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable in .env.local"
    );
  }

  // If no connection attempt is in flight yet, start one.
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        // Keeps the driver from buffering commands when disconnected.
        // Any operation attempted before the connection is ready will throw
        // immediately rather than queuing silently.
        bufferCommands: false,
      })
      .then((m) => m.connection);
  }

  // Await the pending promise (shared by all concurrent callers).
  cached.conn = await cached.promise;
  return cached.conn;
}
