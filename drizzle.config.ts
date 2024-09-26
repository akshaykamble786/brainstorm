import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
    console.log('Cannot find database URL');
}

export default defineConfig({
    dialect: 'postgresql',  // Specify the database dialect (PostgreSQL in your case)
    dbCredentials: {
        url: process.env.DATABASE_URL || "",  // Use 'url' instead of 'connectionString'
    },
    schema: './src/lib/supabase/schema.ts',  // Make sure the path to your schema is correct
    out: './migrations',
});
