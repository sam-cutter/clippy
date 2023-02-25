import { initPocketBase } from "./pocketbase.js";
import PriorityQueue from "priorityqueuejs";

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

  addClipID(event.record.id);
});

const clipsQueue = new PriorityQueue((a, b) => a.priority - b.priority);

function addClipID(clipID) {
  const expirationTime = new Date().getTime() + 5 * 60 * 1000;
  clipsQueue.enq({ item: clipID, priority: expirationTime });
}

function removeExpiredClips() {
  const now = new Date().getTime();

  while (!clipsQueue.isEmpty()) {
    const clipID = clipsQueue.peek().item;
    const expirationTime = clipsQueue.peek().priority;

    if (now >= expirationTime) {
      pb.collection("clips").delete(clipID);
      console.log(`Record with id ${clipID} automatically deleted`);
      clipsQueue.deq();
    } else {
      break;
    }
  }
}

setInterval(removeExpiredClips, 1000);
