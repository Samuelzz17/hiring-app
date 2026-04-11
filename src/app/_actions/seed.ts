"use server";

import { seedDatabaseAdmin } from "@/db/seed-admin";

export async function runSeedAction() {
  try {
    const result = await seedDatabaseAdmin();
    return result;
  } catch (error: any) {
    console.error("Seeding Action Error:", error);
    throw new Error(error.message || "Failed to seed database");
  }
}
