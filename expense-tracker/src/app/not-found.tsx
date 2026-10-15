import Link from "next/link";
import { buttonStyles } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <p className="font-mono text-sm text-amber">404</p>
      <h1 className="mt-2 text-2xl font-extrabold">Page not found</h1>
      <p className="mt-1 text-sm text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className={`${buttonStyles.primary} mt-6`}>
        Back to dashboard
      </Link>
    </div>
  );
}
