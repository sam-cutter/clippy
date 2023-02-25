import PocketBase from "pocketbase";
import dotenv from "dotenv";
import eventsource from "eventsource";

export async function initPocketBase() {
  try {
    dotenv.config({ path: "../.env" });

    global.EventSource = eventsource;

    const pocketbase_url = process.env.POCKETBASE_URL;
    const pocketbase_admin_email = process.env.POCKETBASE_ADMIN_EMAIL;
    const pocketbase_admin_password = process.env.POCKETBASE_ADMIN_PASSWORD;

    if (
      !pocketbase_url ||
      !pocketbase_admin_email ||
      !pocketbase_admin_password
    ) {
      throw new Error(
        "One or more required environment variables are undefined."
      );
    }

    const pb = new PocketBase(pocketbase_url);

    await pb.admins.authWithPassword(
      pocketbase_admin_email,
      pocketbase_admin_password
    );

    console.log(`Successfully authenticated as ${pb.authStore.model.email}`);

    return pb;
  } catch (error) {
    throw new Error("Error initializing PocketBase.", error);
  }
}
