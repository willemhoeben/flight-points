"use client";

import { useMemo, useState } from "react";
import { VALUATIONS } from "@/data/valuations";
import { Card } from "@/components/ui";
import { useCurrency } from "@/lib/currency-context";
import { convertToUsd } from "@/lib/currency";
import { useDictionary, useLocale } from "@/lib/i18n/i18n-context";
import { formatMiles } from "@/lib/format";
import { pointsToUsd, usdToPoints } from "@/lib/points-calc";

type CalcMode = "pointsToCash" | "cashToPoints";

export function PointsCalculator() {
  const [currencyId, setCurrencyId] = useState(VALUATIONS[0].id);
  const [mode, setMode] = useState<CalcMode>("pointsToCash");
  const [balance, setBalance] = useState("60000");
  const [targetAmount, setTargetAmount] = useState("500");
  const { format, currency } = useCurrency();
  const dict = useDictionary();
  const locale = useLocale();

  const pointsCurrency = VALUATIONS.find((v) => v.id === currencyId) ?? VALUATIONS[0];
  const points = Number(balance.replace(/[^0-9]/g, "")) || 0;
  const target = Number(targetAmount.replace(/[^0-9.]/g, "")) || 0;

  const estimatedValueUsd = useMemo(
    () => pointsToUsd(points, pointsCurrency.centsPerPoint),
    [points, pointsCurrency],
  );
  const pointsNeeded = useMemo(
    () => usdToPoints(convertToUsd(target, currency), pointsCurrency.centsPerPoint),
    [target, currency, pointsCurrency],
  );

  return (
    <Card className="p-6">
      <h2 className="text-lg text-foreground">{dict.calculator.heading}</h2>
      <p className="mt-1 text-sm text-muted">{dict.calculator.description}</p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={dict.calculator.heading}>
        <ModePill active={mode === "pointsToCash"} onClick={() => setMode("pointsToCash")}>
          {dict.calculator.modePointsToCash}
        </ModePill>
        <ModePill active={mode === "cashToPoints"} onClick={() => setMode("cashToPoints")}>
          {dict.calculator.modeCashToPoints}
        </ModePill>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-foreground">{dict.calculator.currency}</span>
          <select
            className="form-select"
            value={currencyId}
            onChange={(e) => setCurrencyId(e.target.value)}
          >
            {VALUATIONS.map((pc) => (
              <option key={pc.id} value={pc.id}>
                {pc.name}
              </option>
            ))}
          </select>
        </label>
        {mode === "pointsToCash" ? (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-foreground">{dict.calculator.balance}</span>
            <input
              type="text"
              inputMode="numeric"
              className="form-select"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder={dict.calculator.balancePlaceholder}
            />
          </label>
        ) : (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-foreground">{dict.calculator.targetAmount}</span>
            <input
              type="text"
              inputMode="decimal"
              className="form-select"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder={dict.calculator.targetPlaceholder}
            />
          </label>
        )}
      </div>

      <div className="mt-6 rounded-2xl bg-surface p-5">
        {mode === "pointsToCash" ? (
          <>
            <div className="text-xs text-muted">{dict.calculator.estimatedValue}</div>
            <div className="mt-1 font-mono text-3xl font-semibold tabular-nums text-foreground" suppressHydrationWarning>
              {format(estimatedValueUsd)}
            </div>
            <div className="mt-1 font-mono text-xs tabular-nums text-muted" suppressHydrationWarning>
              {formatMiles(points, locale)} {dict.calculator.points} × {pointsCurrency.centsPerPoint.toFixed(2)}¢
            </div>
          </>
        ) : (
          <>
            <div className="text-xs text-muted">{dict.calculator.pointsNeeded}</div>
            <div className="mt-1 font-mono text-3xl font-semibold tabular-nums text-foreground" suppressHydrationWarning>
              {formatMiles(Math.ceil(pointsNeeded), locale)}
            </div>
            <div className="mt-1 font-mono text-xs tabular-nums text-muted" suppressHydrationWarning>
              {format(target)} ÷ {pointsCurrency.centsPerPoint.toFixed(2)}¢
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

function ModePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={
        active
          ? "rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-foreground"
          : "rounded-full bg-surface-muted px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
      }
    >
      {children}
    </button>
  );
}
