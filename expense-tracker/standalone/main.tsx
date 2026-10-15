import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Info } from "lucide-react";
import { Providers } from "@/components/Providers";
import { Modal } from "@/components/Modal";
import { buttonStyles } from "@/components/ui";
import { useToast } from "@/components/ToastProvider";
import { useExpenses } from "@/hooks/useExpenses";
import DashboardPage from "@/app/page";
import { ExpensesView } from "@/app/expenses/ExpensesView";
import { TrendsView } from "@/app/trends/TrendsView";
import { usePathname } from "./shims/router";

const SEEDED_KEY = "expense-tracker:examples-loaded";

function readFlag(): boolean {
  try {
    return localStorage.getItem(SEEDED_KEY) === "1";
  } catch {
    return false;
  }
}
function writeFlag(on: boolean) {
  try {
    if (on) localStorage.setItem(SEEDED_KEY, "1");
    else localStorage.removeItem(SEEDED_KEY);
  } catch {
    /* storage unavailable: the banner just won't persist */
  }
}

/** First visit: load example expenses so the page opens in a working state. */
function ExamplesBanner() {
  const { expenses, status, loadSampleData, clearAll } = useExpenses();
  const [showing, setShowing] = useState(readFlag);

  useEffect(() => {
    if (status !== "ready") return;
    let firstVisit = false;
    try {
      firstVisit = localStorage.getItem(SEEDED_KEY) === null;
    } catch {
      firstVisit = false;
    }
    if (firstVisit && expenses.length === 0 && loadSampleData()) {
      writeFlag(true);
      setShowing(true);
    }
    // Run once when storage has loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!showing || expenses.length === 0) return null;

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-amber/40 bg-amber/10 p-4 text-sm text-soft sm:flex-row sm:items-center">
      <Info className="h-5 w-5 shrink-0 text-amber" aria-hidden />
      <p className="flex-1">
        These are <strong className="text-fg">example expenses</strong> so you can explore the app. Clear them to start tracking your own.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            writeFlag(false);
            setShowing(false);
          }}
          className={buttonStyles.secondary}
        >
          Keep examples
        </button>
        <button
          type="button"
          onClick={() => {
            if (clearAll()) {
              writeFlag(false);
              setShowing(false);
            }
          }}
          className={buttonStyles.primary}
        >
          Clear examples
        </button>
      </div>
    </div>
  );
}

function CsvDialog() {
  const { toast } = useToast();
  const [data, setData] = useState<{ csv: string; filename: string } | null>(null);

  useEffect(() => {
    const onShow = (e: Event) => setData((e as CustomEvent<{ csv: string; filename: string }>).detail);
    window.addEventListener("show-csv", onShow);
    return () => window.removeEventListener("show-csv", onShow);
  }, []);

  const copy = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.csv);
      toast("success", "CSV copied. Paste it into a spreadsheet or a .csv file.");
    } catch {
      const el = document.getElementById("csv-output") as HTMLTextAreaElement | null;
      el?.select();
      toast("info", "Couldn't copy automatically. The text is selected: press Ctrl+C or ⌘C.");
    }
  };

  return (
    <Modal
      open={data !== null}
      title="Export CSV"
      description="Copy this text and paste it into a spreadsheet, or save it as a .csv file."
      onClose={() => setData(null)}
    >
      <textarea
        id="csv-output"
        readOnly
        value={data?.csv ?? ""}
        rows={10}
        className="block w-full rounded-[10px] border border-line bg-sunken p-3 font-mono text-xs text-soft"
      />
      <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => setData(null)} className={buttonStyles.secondary}>
          Close
        </button>
        <button type="button" onClick={copy} className={buttonStyles.primary}>
          Copy CSV
        </button>
      </div>
    </Modal>
  );
}

function App() {
  const pathname = usePathname();
  return (
    <Providers>
      <ExamplesBanner />
      <CsvDialog />
      {pathname === "/expenses" ? <ExpensesView /> : pathname === "/trends" ? <TrendsView /> : <DashboardPage />}
    </Providers>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
