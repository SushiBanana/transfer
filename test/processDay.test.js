import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { processDay } from "../src/processDay.js";

const A = "1111234522226789";
const B = "1212343433335665";

function readSample(fileName) {
  return readFileSync(
    new URL(`../MableBackEndCodeTest/${fileName}`, import.meta.url),
    "utf-8",
  );
}

function balancesByNumber(accounts) {
  return Object.fromEntries(
    accounts.map((account) => [account.accountNumber, account.balance]),
  );
}

describe("processDay", () => {
  it("Calculates the Mable sample files accurately", () => {
    const result = processDay(
      readSample("mable_account_balances.csv"),
      readSample("mable_transactions.csv"),
    );

    assert.deepStrictEqual(balancesByNumber(result.accounts), {
      "1111234522226789": 482050,
      "1111234522221234": 997440,
      "2222123433331212": 155000,
      "1212343433335665": 172560,
      "3212343433335755": 4867950,
    });
    assert.deepStrictEqual(
      result.results.map(({ succeeded }) => succeeded),
      [true, true, true, true],
    );
  });

  it("Reports a failed transfer and still applies the rest", () => {
    const result = processDay(
      `${A},500.00\n${B},0.00`,
      `${A},${B},100.00\n${B},${A},9999.99\n${A},${B},200.00`,
    );

    assert.deepStrictEqual(balancesByNumber(result.accounts), {
      [A]: 20000,
      [B]: 30000,
    });
    assert.deepStrictEqual(
      result.results.map(({ succeeded }) => succeeded),
      [true, false, true],
    );
    assert.match(result.results[1].reason, /insufficient funds/i);
  });

  it("Returns the starting balances from before the transfers", () => {
    const result = processDay(`${A},500.00\n${B},0.00`, `${A},${B},100.00`);

    assert.deepStrictEqual(
      result.startingBalances,
      new Map([
        [A, 50000],
        [B, 0],
      ]),
    );
  });

  it("Rejects a malformed balances file", () => {
    assert.throws(
      () => processDay(`${A},500.00\n123,100.00`, `${A},${B},100.00`),
      /line 2/i,
    );
  });

  it("Rejects a malformed transfers file", () => {
    assert.throws(
      () =>
        processDay(`${A},500.00\n${B},0.00`, `${A},${B},100.00\n${A},${B},abc`),
      /line 2/i,
    );
  });
});
