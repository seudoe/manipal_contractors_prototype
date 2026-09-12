import Link from "next/link";
import { ComingSoon } from "@/components/coming-soon";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <ComingSoon title="Projects" />
      <Link
        href="/inspector/project/demo-project-1"
        className="self-center text-sm font-medium text-black underline dark:text-white"
      >
        Open demo project →
      </Link>
    </div>
  );
}
