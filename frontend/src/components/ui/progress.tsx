import React from "react";
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}
const Progress: React.FC<ProgressProps> = ({ value = 0, className = "", ...props }) => {
  return (
    <div
      className={`relative h-4 w-full overflow-hidden rounded bg-gray-200 ${className}`}
      {...props}
    >
      <div
        className="h-full bg-sky-500 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};
export { Progress };

