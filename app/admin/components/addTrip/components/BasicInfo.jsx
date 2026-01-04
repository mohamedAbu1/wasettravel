import React from "react";

export default function BasicInfo() {
  return (
    <div className="space-y-4">
      <input type="text" placeholder="Trip Title" className="w-full p-3 rounded-lg border" />
      <input type="text" placeholder="Destination" className="w-full p-3 rounded-lg border" />
      <input type="number" placeholder="Price" className="w-full p-3 rounded-lg border" />
      <textarea placeholder="Description" rows="4" className="w-full p-3 rounded-lg border"></textarea>
    </div>
  );
}
