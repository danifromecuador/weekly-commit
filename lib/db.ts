import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./db/schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let _instance: Db | undefined;

function getInstance(): Db {
  if (!_instance) {
    _instance = drizzle(neon(process.env.DATABASE_URL!), { schema });
  }
  return _instance;
}

// Proxy defers initialization until first property access (i.e. route handler call),
// so importing this module during `next build` doesn't throw for missing DATABASE_URL.
export const db = new Proxy({} as Db, {
  get(_, prop: string | symbol) {
    return getInstance()[prop as keyof Db];
  },
});
