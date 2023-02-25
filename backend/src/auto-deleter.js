import { initPocketBase } from "./pocketbase.js";

let pb;

try {
  pb = await initPocketBase();
} catch (err) {
  console.error(err);
  process.exit();
}

pb.collection("clips").subscribe("*", (event) => {
  if (event.action != "create") return;

  console.log(`Record with id ${event.record.id} created!`);
});
