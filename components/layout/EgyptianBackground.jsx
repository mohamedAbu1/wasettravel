"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const symbols = [
  "𓂀","𓋹","𓆣","𓇼","𓇯","𓏏","𓎛","𓊽",
  "𓃾","𓅓","𓈇","𓉐","𓊹","𓌙","𓍿","𓎟",
];

export default function EgyptianBackground() {
  const [items, setItems] = useState([]);
  const { theme, themeName } = useTheme();

  useEffect(() => {
    const count = window.innerWidth < 768 ? 25 : 50; // أقل في الموبايل
    const generated = Array.from({ length: count }).map((_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 18 + Math.random() * 35,
      opacity: 0.1 + Math.random() * 0.4,
      rotate: Math.random() * 360,
      delay: Math.random() * 5,
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
            transform: `rotate(${item.rotate}deg)`,
            color: theme.icon,
            filter: "blur(0.5px)",
            animation: "egyptian-float 10s ease-in-out infinite",
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
