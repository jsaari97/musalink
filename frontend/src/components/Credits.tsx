import * as React from "react";

export const Credits: React.FC = () => {
  const year = React.useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
      <p
        className="text-sm text-gray-100"
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.25)" }}
      >
        {year} - Made by Jim Saari
      </p>
    </footer>
  );
};
