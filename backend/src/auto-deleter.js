import { initPocketBase, deleteClip } from "./pocketbase.js";
import PriorityQueue from "priorityqueuejs";

try {
  const pb = await initPocketBase();

  pb.collection("clips").subscribe("*", (event) => {
    if (event.action != "create") return;

    console.log(`Record with id ${event.record.id} created.`);

    try {
      addClipID(event.record.id);
    } catch (error) {
      throw new Error(`Error adding clip ID: ${error}`);
    }
  });

  const clipsQueue = new PriorityQueue((a, b) => b.priority - a.priority);

  function addClipID(clipID) {
    const expirationTime = new Date().getTime() + 0.5 * 60 * 1000;
    clipsQueue.enq({ item: clipID, priority: expirationTime });
  }

  function removeExpiredClips() {
    const now = new Date().getTime();

    while (!clipsQueue.isEmpty()) {
      const clipID = clipsQueue.peek().item;
      const expirationTime = clipsQueue.peek().priority;

      if (now >= expirationTime) {
        deleteClip(clipID, pb);
        clipsQueue.deq();
      } else {
        break;
      }
    }
  }

  setInterval(() => {
    try {
      removeExpiredClips();
    } catch (error) {
      throw new Error(`Error removing expired clips: ${error}`);
    }
  }, 1000);
} catch (error) {
  throw new Error(error);
}
