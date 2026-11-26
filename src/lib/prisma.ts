import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg";

// const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient();

export default prisma;
