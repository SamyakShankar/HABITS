import { heatmap } from "@/lib/mock-data";

export function ConsistencyHeatmap() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {heatmap.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className="aspect-square rounded border border-white/10"
          style={{
            background: `rgba(159, 92, 255, ${0.1 + value / 120})`,
            boxShadow: value > 70 ? "0 0 14px rgba(159,92,255,.65)" : "inset 0 0 10px rgba(255,255,255,.05)"
          }}
          title={`${value}% completion`}
        />
      ))}
    </div>
  );
}
