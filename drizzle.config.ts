import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
    console.log('Cannot find database URL');
}

export default defineConfig({
    dialect: 'postgresql',  
    dbCredentials: {
        url: process.env.DATABASE_URL || "",  
    },
    schema: './src/lib/supabase/schema.ts', 
    out: './migrations',
});