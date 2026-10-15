import { describe, expect, it } from "vitest";
import { computeSummary, monthlyTotals, totalsByCategory } from "./analytics";
import { escapeCsvCell, expensesToCsv } from "./csv";
import { isValidISODate, toISODate } from "./dates";
import { filterExpenses, sortExpenses, EMPTY_FILTERS } from "./filters";
import { parseAmountToCents } from "./money";
import { StorageError, parseStoredExpenses } from "./storage";
import type { Category, Expense } from "./types";
import { validateExpense } from "./validation";

let seq = 0;
function exp(date: string, amountCents: number, category: Category = "Food", description = "Item"): Expense {
  seq += 1;
  const ts = new Date(2024, 0, 1, 0, 0, seq).toISOString();
  return { id: `id-${seq}`, date, amountCents, category, description, createdAt: ts, updatedAt: ts };
}

describe("parseAmountToCents", () => {
  it.each([
    ["12", 1200],
    ["12.5", 1250],
    ["12.05", 1205],
    ["$1,234.56", 123456],
    [".99", 99],
    ["0.1", 10],
  ])("parses %s", (input, cents) => expect(parseAmountToCents(input)).toBe(cents));

  it.each(["", "abc", "1.234", "-5", "1e3", "12..3"])("rejects %s", (input) => {
    expect(parseAmountToCents(input)).toBeNull();
  });
});

describe("dates", () => {
  it("validates real calendar dates", () => {
    expect(isValidISODate("2024-02-29")).toBe(true);
    expect(isValidISODate("2023-02-29")).toBe(false);
    expect(isValidISODate("2024-13-01")).toBe(false);
    expect(isValidISODate("not-a-date")).toBe(false);
  });

  it("formats local dates without UTC shift", () => {
    expect(toISODate(new Date(2024, 0, 1))).toBe("2024-01-01");
  });
});

describe("validateExpense", () => {
  const today = "2024-06-15";
  const valid = { date: "2024-06-10", amount: "19.99", category: "Food", description: "  Lunch  " };

  it("accepts and normalises valid input", () => {
    expect(validateExpense(valid, today)).toEqual({
      ok: true,
      value: { date: "2024-06-10", amountCents: 1999, category: "Food", description: "Lunch" },
    });
  });

  it("reports every invalid field", () => {
    const result = validateExpense({ date: "", amount: "", category: "", description: " " }, today);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(["amount", "category", "date", "description"]);
  });

  it("rejects future dates, zero amounts, and unknown categories", () => {
    const result = validateExpense({ ...valid, date: "2024-06-16", amount: "0", category: "Travel" }, today);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.date).toMatch(/future/);
      expect(result.errors.amount).toMatch(/greater than zero/);
      expect(result.errors.category).toBeDefined();
    }
  });

  it("rejects amounts over the maximum", () => {
    const result = validateExpense({ ...valid, amount: "1000000.01" }, today);
    expect(result.ok).toBe(false);
  });
});

describe("filters and sorting", () => {
  const list = [
    exp("2024-05-01", 500, "Food", "Coffee beans"),
    exp("2024-05-15", 9000, "Bills", "Electric bill"),
    exp("2024-06-02", 2500, "Entertainment", "Movie night"),
  ];

  it("filters by category, inclusive date range and search", () => {
    expect(filterExpenses(list, { ...EMPTY_FILTERS, category: "Bills" })).toHaveLength(1);
    expect(filterExpenses(list, { ...EMPTY_FILTERS, from: "2024-05-15", to: "2024-06-02" })).toHaveLength(2);
    expect(filterExpenses(list, { ...EMPTY_FILTERS, search: "COFFEE" })).toHaveLength(1);
    expect(filterExpenses(list, { ...EMPTY_FILTERS, search: "entertain" })).toHaveLength(1);
  });

  it("sorts by date and amount", () => {
    expect(sortExpenses(list, "date-desc")[0].description).toBe("Movie night");
    expect(sortExpenses(list, "amount-desc")[0].description).toBe("Electric bill");
    expect(sortExpenses(list, "amount-asc")[0].description).toBe("Coffee beans");
  });
});

describe("analytics", () => {
  const now = new Date(2024, 5, 15); // June 15, 2024
  const list = [
    exp("2024-06-01", 3000, "Food"),
    exp("2024-06-10", 1500, "Bills"),
    exp("2024-05-20", 3000, "Food"),
    exp("2023-12-31", 10000, "Shopping"),
  ];

  it("computes month-over-month summary", () => {
    const s = computeSummary(list, now);
    expect(s.totalCents).toBe(17500);
    expect(s.thisMonthCents).toBe(4500);
    expect(s.lastMonthCents).toBe(3000);
    expect(s.monthChangePct).toBeCloseTo(50);
    expect(s.avgPerDayThisMonthCents).toBe(300);
    expect(s.topCategories[0].category).toBe("Food");
  });

  it("returns null change when last month is empty", () => {
    expect(computeSummary([exp("2024-06-01", 100)], now).monthChangePct).toBeNull();
  });

  it("zero-fills monthly totals across year boundaries", () => {
    const months = monthlyTotals(list, 7, now);
    expect(months.map((m) => m.month)).toEqual(["2023-12", "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06"]);
    expect(months[0].totalCents).toBe(10000);
    expect(months[1].totalCents).toBe(0);
  });

  it("computes category shares", () => {
    const totals = totalsByCategory(list);
    expect(totals.reduce((a, t) => a + t.share, 0)).toBeCloseTo(1);
    expect(totals[0]).toMatchObject({ category: "Shopping", totalCents: 10000, count: 1 });
  });
});

describe("csv", () => {
  it("escapes quotes, commas and newlines", () => {
    expect(escapeCsvCell('Say "hi", ok')).toBe('"Say ""hi"", ok"');
    expect(escapeCsvCell("line\nbreak")).toBe('"line\nbreak"');
  });

  it("neutralises formula injection", () => {
    expect(escapeCsvCell("=SUM(A1)")).toBe("'=SUM(A1)");
    expect(escapeCsvCell("@cmd")).toBe("'@cmd");
  });

  it("produces a header and formatted amounts", () => {
    const csv = expensesToCsv([exp("2024-01-02", 1205, "Food", "Bagel")]);
    expect(csv).toBe("Date,Description,Category,Amount\r\n2024-01-02,Bagel,Food,12.05");
  });
});

describe("parseStoredExpenses", () => {
  it("returns empty for missing data", () => {
    expect(parseStoredExpenses(null)).toEqual({ expenses: [], dropped: 0 });
  });

  it("drops invalid records but keeps valid ones", () => {
    const good = exp("2024-01-01", 100);
    const raw = JSON.stringify({ version: 1, expenses: [good, { ...good, id: "x", amountCents: -5 }, { nope: true }] });
    const result = parseStoredExpenses(raw);
    expect(result.expenses).toEqual([good]);
    expect(result.dropped).toBe(2);
  });

  it("throws a StorageError on corrupt JSON", () => {
    expect(() => parseStoredExpenses("{not json")).toThrow(StorageError);
  });
});
