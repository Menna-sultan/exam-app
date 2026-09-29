const RADIUS = 49;
const STROKE = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ResultsDonut({
  correct,
  total,
}: {
  correct: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : Math.min(1, Math.max(0, correct / total));
  const dash = pct * CIRCUMFERENCE;

  return (
    <div className="aspect-square w-full max-w-[140px]">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        {/* Incorrect (the full ring underneath) */}
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke="#EF4444"
          strokeWidth={STROKE}
        />
        {/* Correct (drawn on top) */}
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke="#00BC7D"
          strokeWidth={STROKE}
          strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
        />
      </svg>
    </div>
  );
}