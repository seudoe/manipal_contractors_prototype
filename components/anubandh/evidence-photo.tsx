import { Camera } from "lucide-react";

/**
 * ANUBANDH — a placeholder "photo" tile for a SITE_PHOTO observation. There
 * are no real uploaded images in this prototype, so the tile is a
 * deterministic gradient derived from the observation's own id/hash (never
 * random, never recomputed differently between renders) with a caption —
 * enough to make the evidence feel concrete without faking a real photo.
 */
function hueFromSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}

const SIZE_CLASS = {
  sm: "h-12 w-12",
  md: "h-24 w-24",
  lg: "h-64 w-full sm:h-80",
};

export function EvidencePhoto({
  seed,
  caption,
  size = "md",
}: {
  seed: string;
  caption?: string;
  size?: "sm" | "md" | "lg";
}) {
  const hue = hueFromSeed(seed);
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg ${SIZE_CLASS[size]}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 35% 88%), hsl(${(hue + 40) % 360} 35% 72%))`,
      }}
    >
      <Camera
        size={size === "lg" ? 40 : size === "md" ? 22 : 14}
        className="text-black/30 dark:text-black/40"
        strokeWidth={1.5}
      />
      {caption && size === "lg" && (
        <span className="absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
          {caption}
        </span>
      )}
    </div>
  );
}
