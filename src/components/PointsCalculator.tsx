"use client";

import { useMemo, useState } from "react";
import { VALUATIONS } from "@/data/valuations";
import { Card } from "@/components/ui";
import { useCurrency } from "@/lib/currency-context";
import { useDictionary } from "@/lib/i18n/i18n-context";

export function PointsCalculator() {
  const [currencyId, setCurrencyId] = useState(VALUATIONS[0].id);
  const [balance, setBalance] = useState("60000");
  const { format } = useCurrency();
  const dict = useDictionary();

  const pointsCurrency = VALUATIONS.find((v) => v.id === currencyId) ?? VALUATIONS[0];
  const points = Number(balance.replace(/[^0-9]/g, "")) || 0;

  const estimatedValueUsd = useMemo(
    () => (points * pointsCurrency.centsPerPoint) / 100,
    [points, pointsCurrency],
  );

  return (
    <Card className="p-6">
      <h2 className="text-lg text-foreground">{dict.calculator.heading}</h2>
      <p className="mt-1 text-sm text-muted">{dict.calculator.description}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
      </div>

      <div className="mt-6 rounded-2xl bg-surface p-5">
        <div className="text-xs text-muted">{dict.calculator.estimatedValue}</div>
        <div className="mt-1 font-mono text-3xl font-semibold tabular-nums text-foreground">
          {format(estimatedValueUsd)}
        </div>
        <div className="mt-1 font-mono text-xs tabular-nums text-muted">
          {points.toLocaleString("en-US")} {dict.calculator.points} × {pointsCurrency.centsPerPoint.toFixed(2)}¢
        </div>
      </div>
    </Card>
  );
}
