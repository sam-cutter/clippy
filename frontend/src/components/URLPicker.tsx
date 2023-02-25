"use client";

import { useState } from "react";

export default function URLPicker() {
  const [URL, setURL] = useState("");

  return (
    <input
      type="text"
      value={URL}
      onChange={(e) => setURL(e.target.value)}
    ></input>
  );
}
