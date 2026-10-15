import { isValidISODate } from "./dates";
import { isCategory, type Expense } from "./types";

export const STORAGE_KEY = "expense-tracker:v1";
const SCHEMA_VERSION = 1;

interface StoredData {
  version: number;
  expenses: Expense[];
}

export class StorageError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "StorageError";
  }
}

function isExpense(value: unknown): value is Expense {
  if (!value || typeof value !== "object") return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.date === "string" &&
    isValidISODate(e.date) &&
    typeof e.amountCents === "number" &&
    Number.isSafeInteger(e.amountCents) &&
    e.amountCents > 0 &&
    isCategory(e.category) &&
    typeof e.description === "string" &&
    typeof e.createdAt === "string" &&
    typeof e.updatedAt === "string"
  );
}

/**
 * Parses raw localStorage content. Invalid records are dropped rather than
 * failing the whole load, so one corrupt entry can't hide all the data.
 */
export function parseStoredExpenses(raw: string | null): { expenses: Expense[]; dropped: number } {
  if (!raw) return { expenses: [], dropped: 0 };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new StorageError("Saved data is corrupted and could not be read.", err);
  }
  const list = (parsed as Partial<StoredData> | null)?.expenses;
  if (!Array.isArray(list)) {
    throw new StorageError("Saved data has an unexpected format.");
  }
  const expenses = list.filter(isExpense);
  return { expenses, dropped: list.length - expenses.length };
}

export function loadExpenses(): { expenses: Expense[]; dropped: number } {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    throw new StorageError("Browser storage is unavailable. Changes won't be saved.", err);
  }
  return parseStoredExpenses(raw);
}

export function saveExpenses(expenses: Expense[]): void {
  const data: StoredData = { version: SCHEMA_VERSION, expenses };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    const quota = err instanceof DOMException && err.name === "QuotaExceededError";
    throw new StorageError(
      quota ? "Browser storage is full. Delete some expenses or export and clear data." : "Couldn't save your changes.",
      err,
    );
  }
}

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
