/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";

const symbols = [
  "𓂀","𓋹","𓆣","𓇼","𓇯","𓏏","𓎛","𓊽",
    "𓃾","𓅓","𓈇","𓉐","𓊹","𓌙","𓍿","𓎟",
];

export default function EgyptianBackground() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // توليد 50 رمز عشوائي
    const generated = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      top: Math.random() * 100, // نسبة مئوية
      left: Math.random() * 100,
      size: 18 + Math.random() * 35, // حجم عشوائي
      opacity: 0.15 + Math.random() * 0.5, // شفافية
      rotate: Math.random() * 360, // دوران عشوائي
    }));
    setItems(generated);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((item) => (
        <span
          key={item.id}
          style={{
            position: "absolute",
            top: `${item.top}%`,
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            opacity: item.opacity,
            color: "#c9a34a", // اللون الذهبي
            transform: `rotate(${item.rotate}deg)`,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
