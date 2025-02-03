import { type Config } from "drizzle-kit";

import { env } from "admin-klr/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["admin-klr_*"],
} satisfies Config;
