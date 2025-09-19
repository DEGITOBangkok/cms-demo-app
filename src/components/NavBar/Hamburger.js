import React from "react";

export default function Hamburger({ state }) {
  const isOpen = state === "close";
  const lineColor = "bg-red-600"; // เส้นสีแดง

  const baseLine = `absolute left-1/2 top-1/2 block h-[2px] w-6 rounded transform -translate-x-1/2 transition-all duration-300 ease-in-out ${lineColor}`;

  return (
    <div className="relative w-8 h-8" aria-hidden="true">
      <span
        className={`${baseLine} ${
          isOpen ? "-translate-y-1/2 rotate-45" : "-translate-y-[10px] rotate-0"
        }`}
      />
      <span
        className={`${baseLine} ${
          isOpen ? "-translate-y-1/2 opacity-0" : "-translate-y-1/2 opacity-100"
        }`}
      />
      <span
        className={`${baseLine} ${
          isOpen ? "-translate-y-1/2 -rotate-45" : "translate-y-[10px] rotate-0"
        }`}
      />
    </div>
  );
}
