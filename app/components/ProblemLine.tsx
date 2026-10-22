import Link from "next/link";
import type { AboutContent } from "./AppAbout";

/** One line under an app's header: the problem it solves, and a guide that explains it. */
export function ProblemLine({ content }: { content: AboutContent }) {
  if (!content.problem) return null;
  return (
    <p className="mb-3 text-sm text-muted">
      {content.problem}
      {content.guide && (
        <>
          {" "}
          <Link href={content.guide.href} className="font-semibold text-soft underline-offset-4 hover:text-fg hover:underline">
            {content.guide.title} →
          </Link>
        </>
      )}
    </p>
  );
}
