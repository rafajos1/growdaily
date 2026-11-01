import type { Metadata } from "next";
import { BuildHeader, eyebrow } from "../build/parts";
import { AuditApp } from "./AuditApp";

export const metadata: Metadata = {
  title: "Governwise Audit · GrowDaily",
  description: "A private workspace for running AI governance audits.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <div className="print:hidden">
        <BuildHeader />
      </div>
      <main className="mx-auto max-w-7xl pb-20">
        <section className="pb-8 pt-6 print:hidden">
          <p className={eyebrow}>Governwise Audit · private workspace</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.03em]">AI governance audits</h1>
          <p className="mt-3 max-w-[70ch] text-soft">
            One audit per client. Work through 29 controls mapped to the NIST AI Risk Management Framework, record evidence for each, track findings to an owner and due date, and print the report. Everything stays in this browser; back up after each session.
          </p>
        </section>
        <AuditApp />
      </main>
    </div>
  );
}
