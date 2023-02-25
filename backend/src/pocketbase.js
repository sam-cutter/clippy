import PocketBase from "pocketbase";
import dotenv from "dotenv";
import eventsource from "eventsource";

export async function initPocketBase() {
  dotenv.config({ path: "../.env" });

  global.EventSource = eventsource;

  const pocketbase_url = process.env.POCKETBASE_URL;
  const pb = new PocketBase(pocketbase_url);

  const pocketbase_admin_email = process.env.POCKETBASE_ADMIN_EMAIL;
  const pocketbase_admin_password = process.env.POCKETBASE_ADMIN_PASSWORD;

  try {
    await pb.admins.authWithPassword(
      pocketbase_admin_email,
      pocketbase_admin_password
    );

    console.log(`Successfully authenticated as ${pb.authStore.model.email}`);
  } catch {
    throw new Error("Error connecting to or authenticating with PocketBase.");
  }

  return pb;
}
