// Gray animated placeholder shown while data loads.
export default function Skeleton({ height = 16, width = "100%", count = 1 }) {
  return (
    <div role="status" aria-label="Loading" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton" style={{ height, width }} />
      ))}
    </div>
  );
}
