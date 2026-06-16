import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Grab the URL from your environment variables
const connectionString = process.env.DIRECT_URL;

// Initialize the PostgreSQL connection pool
const pool = new Pool({ connectionString });

// Create the adapter
const adapter = new PrismaPg(pool);

// Pass the adapter to the PrismaClient constructor
const prisma = new PrismaClient({ adapter });

export default prisma;