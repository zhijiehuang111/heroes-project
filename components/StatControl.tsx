"use client";

interface StatControlProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  canIncrement: boolean;
  canDecrement: boolean;
}

export default function StatControl({
  label,
  value,
  onIncrement,
  onDecrement,
  canIncrement,
  canDecrement,
}: StatControlProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-10 text-sm font-semibold text-gray-700 uppercase tracking-wider">
        {label}
      </span>
      <button
        onClick={onIncrement}
        disabled={!canIncrement}
        className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        +
      </button>
      <span className="w-8 text-center text-base font-medium text-gray-800">
        {value}
      </span>
      <button
        onClick={onDecrement}
        disabled={!canDecrement}
        className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        -
      </button>
    </div>
  );
}
