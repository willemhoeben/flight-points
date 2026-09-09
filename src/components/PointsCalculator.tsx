"use client";

import { useMemo, useState } from "react";
import { VALUATIONS } from "@/data/valuations";
import { Card } from "@/components/ui";

export function PointsCalculator() {
  const [currencyId, setCurrencyId] = useState(VALUATIONS[0].id);
  const [balance, setBalance] = useState("60000");

  const currency = VALUATIONS.find((v) => v.id === currencyId) ?? VALUATIONS[0];
  const points = Number(balance.replace(/[^0-9]/g, "")) || 0;

  const estimatedValue = useMemo(
    () => (points * currency.centsPerPoint) / 100,
    [points, currency],
  );

  return (
    <Card className="p-6">
      <h2 className="text-lg text-foreground">Points calculator</h2>
      <p className="mt-1 text-sm text-muted">
        Estimate the cash-equivalent value of a points or miles balance.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-foreground">Currency</span>
          <select
            className="form-select"
            value={currencyId}
            onChange={(e) => setCurrencyId(e.target.value)}
          >
            {VALUATIONS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-foreground">Balance</span>
          <input
            type="text"
            inputMode="numeric"
            className="form-select"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="e.g. 60000"
          />
        </label>
      </div>

      <div className="mt-6 rounded-2xl bg-surface p-5">
        <div className="text-xs text-muted">Estimated value</div>
        <div className="mt-1 font-mono text-3xl font-semibold tabular-nums text-foreground">
          ${estimatedValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </div>
        <div className="mt-1 font-mono text-xs tabular-nums text-muted">
          {points.toLocaleString("en-US")} points × {currency.centsPerPoint.toFixed(2)}¢
        </div>
      </div>
    </Card>
  );
}
