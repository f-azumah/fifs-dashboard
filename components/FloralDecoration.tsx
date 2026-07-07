const PETAL_ANGLES = [0, 72, 144, 216, 288];
const PETAL_PATH = "M100 100 C82 86 76 46 100 12 C124 46 118 86 100 100 Z";

export default function FloralDecoration({
  className,
  petalColor = "#9F8FC7",
  centerColor = "#6FA99A",
}: {
  className?: string;
  petalColor?: string;
  centerColor?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {PETAL_ANGLES.map((angle) => (
        <path
          key={angle}
          d={PETAL_PATH}
          fill={petalColor}
          transform={`rotate(${angle} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="16" fill={centerColor} />
    </svg>
  );
}
