"use client";

import { useId, useState, type FormEvent } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { CATEGORY_META } from "@/lib/categories";
import { MAX_DESCRIPTION_LENGTH, MIN_DATE, validateExpense, type ExpenseFormErrors, type ExpenseFormValues } from "@/lib/validation";
import { todayISO } from "@/lib/dates";
import { centsToInput } from "@/lib/money";
import { CATEGORIES, type Expense, type ExpenseInput } from "@/lib/types";
import { buttonStyles, inputStyles } from "./ui";

interface ExpenseFormProps {
  initial?: Expense;
  /** Prefilled fields for a new expense, e.g. the Giving category. */
  defaults?: Partial<Pick<ExpenseInput, "category" | "description">>;
  onSubmit: (input: ExpenseInput) => boolean;
  onCancel: () => void;
}

function initialValues(expense?: Expense, defaults?: ExpenseFormProps["defaults"]): ExpenseFormValues {
  return expense
    ? {
        date: expense.date,
        amount: centsToInput(expense.amountCents),
        category: expense.category,
        description: expense.description,
      }
    : { date: todayISO(), amount: "", category: defaults?.category ?? "", description: defaults?.description ?? "" };
}

export function ExpenseForm({ initial, defaults, onSubmit, onCancel }: ExpenseFormProps) {
  const id = useId();
  const [values, setValues] = useState<ExpenseFormValues>(() => initialValues(initial, defaults));
  const [errors, setErrors] = useState<ExpenseFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ExpenseFormValues, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const today = todayISO();

  const update = (field: keyof ExpenseFormValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Re-validate a field live once the user has interacted with it.
    if (touched[field]) {
      const result = validateExpense(next, today);
      setErrors((prev) => ({ ...prev, [field]: result.ok ? undefined : result.errors[field] }));
    }
  };

  const blur = (field: keyof ExpenseFormValues) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const result = validateExpense(values, today);
    setErrors((prev) => ({ ...prev, [field]: result.ok ? undefined : result.errors[field] }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = validateExpense(values, today);
    if (!result.ok) {
      setErrors(result.errors);
      setTouched({ date: true, amount: true, category: true, description: true });
      const firstInvalid = (["date", "amount", "category", "description"] as const).find((f) => result.errors[f]);
      if (firstInvalid) document.getElementById(`${id}-${firstInvalid}`)?.focus();
      return;
    }
    setSubmitting(true);
    const ok = onSubmit(result.value);
    if (!ok) setSubmitting(false);
  };

  const fieldError = (field: keyof ExpenseFormValues) =>
    errors[field] ? (
      <p id={`${id}-${field}-error`} className="mt-1.5 text-xs font-semibold text-up">
        {errors[field]}
      </p>
    ) : null;

  const aria = (field: keyof ExpenseFormValues) => ({
    id: `${id}-${field}`,
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-amount`} className="mb-1.5 block text-sm font-semibold text-soft">
            Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-dim">$</span>
            <input
              {...aria("amount")}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              value={values.amount}
              onChange={(e) => update("amount", e.target.value)}
              onBlur={() => blur("amount")}
              className={clsx(inputStyles(Boolean(errors.amount)), "pl-7 font-mono tabular-nums")}
            />
          </div>
          {fieldError("amount")}
        </div>

        <div>
          <label htmlFor={`${id}-date`} className="mb-1.5 block text-sm font-semibold text-soft">
            Date
          </label>
          <input
            {...aria("date")}
            type="date"
            min={MIN_DATE}
            max={today}
            value={values.date}
            onChange={(e) => update("date", e.target.value)}
            onBlur={() => blur("date")}
            className={inputStyles(Boolean(errors.date))}
          />
          {fieldError("date")}
        </div>
      </div>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-semibold text-soft">Category</legend>
        <div
          id={`${id}-category`}
          tabIndex={-1}
          className="grid grid-cols-2 gap-2 outline-none sm:grid-cols-3"
          aria-describedby={errors.category ? `${id}-category-error` : undefined}
        >
          {CATEGORIES.map((c) => {
            const { icon: Icon, color } = CATEGORY_META[c];
            const selected = values.category === c;
            return (
              <label
                key={c}
                className={clsx(
                  "flex cursor-pointer items-center gap-2 rounded-[10px] border px-3 py-2.5 text-sm font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber",
                  selected ? "border-amber bg-amber/10 text-fg" : "border-line bg-sunken text-soft hover:border-[#2c4060]",
                  errors.category && !selected && "border-up/60",
                )}
              >
                <input
                  type="radio"
                  name={`${id}-category`}
                  value={c}
                  checked={selected}
                  onChange={() => {
                    setTouched((t) => ({ ...t, category: true }));
                    update("category", c);
                    setErrors((prev) => ({ ...prev, category: undefined }));
                  }}
                  className="sr-only"
                />
                <Icon className="h-4 w-4 shrink-0" style={{ color }} aria-hidden />
                {c}
              </label>
            );
          })}
        </div>
        {fieldError("category")}
      </fieldset>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <label htmlFor={`${id}-description`} className="block text-sm font-semibold text-soft">
            Description
          </label>
          <span
            className={clsx(
              "font-mono text-xs tabular-nums",
              values.description.trim().length > MAX_DESCRIPTION_LENGTH ? "text-up" : "text-dim",
            )}
          >
            {values.description.trim().length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
        <input
          {...aria("description")}
          type="text"
          placeholder="e.g. Weekly groceries"
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          onBlur={() => blur("description")}
          className={inputStyles(Boolean(errors.description))}
        />
        {fieldError("description")}
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={buttonStyles.secondary}>
          Cancel
        </button>
        <button type="submit" disabled={submitting} className={buttonStyles.primary}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {initial ? "Save changes" : "Add expense"}
        </button>
      </div>
    </form>
  );
}
