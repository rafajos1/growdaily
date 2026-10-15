import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from "react";

// Tiny hash router standing in for next/link + next/navigation.
const ROUTES: Record<string, string> = { expenses: "/expenses", trends: "/trends" };
const toPath = () => ROUTES[location.hash.replace(/^#/, "")] ?? "/";
const toHash = (href: string) => (href === "/expenses" ? "#expenses" : href === "/trends" ? "#trends" : "#month");
const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};

export function usePathname() {
  return useSyncExternalStore(subscribe, toPath, () => "/");
}

export function navigate(href: string) {
  location.hash = toHash(href);
  window.scrollTo(0, 0);
}

export default function Link({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      {...rest}
      href={toHash(href)}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          e.preventDefault();
          navigate(href);
        }
      }}
    />
  );
}
