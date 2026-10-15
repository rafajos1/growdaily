import { parseISODate, todayISO } from "./dates";
import { parseAmountToCents } from "./money";
import { isCategory, type ExpenseInput } from "./types";

export interface ExpenseFormValues {
  date: string;
  amount: string;
  category: string;
  description: string;
}

export type ExpenseFormErrors = Partial<Record<keyof ExpenseFormValues, string>>;

export const MAX_AMOUNT_CENTS = 100_000_000; // $1,000,000.00
export const MAX_DESCRIPTION_LENGTH = 120;
export const MIN_DATE = "2000-01-01";

export type ValidationResult =
  | { ok: true; value: ExpenseInput }
  | { ok: false; errors: ExpenseFormErrors };

export function validateExpense(values: ExpenseFormValues, today: string = todayISO()): ValidationResult {
  const errors: ExpenseFormErrors = {};

  // Date
  if (!values.date) {
    errors.date = "Date is required.";
  } else if (!parseISODate(values.date)) {
    errors.date = "Enter a valid date.";
  } else if (values.date > today) {
    errors.date = "Date can't be in the future.";
  } else if (values.date < MIN_DATE) {
    errors.date = "Date must be in the year 2000 or later.";
  }

  // Amount
  const amountCents = parseAmountToCents(values.amount);
  if (!values.amount.trim()) {
    errors.amount = "Amount is required.";
  } else if (amountCents === null) {
    errors.amount = "Enter a valid amount (up to 2 decimal places).";
  } else if (amountCents <= 0) {
    errors.amount = "Amount must be greater than zero.";
  } else if (amountCents > MAX_AMOUNT_CENTS) {
    errors.amount = "Amount must be $1,000,000 or less.";
  }

  // Category
  if (!values.category) {
    errors.category = "Choose a category.";
  } else if (!isCategory(values.category)) {
    errors.category = "Choose a valid category.";
  }

  // Description
  const description = values.description.trim();
  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Keep it under ${MAX_DESCRIPTION_LENGTH} characters.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      date: values.date,
      amountCents: amountCents as number,
      category: values.category as ExpenseInput["category"],
      description,
    },
  };
}
