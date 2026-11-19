import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatReport } from "../src/formatReport.js";
import { Account } from "../src/account.js";
import { Transfer } from "../src/transfer.js";

const A = "1111234522226789";
const B = "1212343433335665";

const success = { transfer: new Transfer(A, B, 10000), succeeded: true };
const failure = {
  transfer: new Transfer(B, A, 999999),
  succeeded: false,
  reason: "Insufficient funds",
};

function reportFor(results) {
  return formatReport({
    startingBalances: new Map([
      [A, 50000],
      [B, 0],
    ]),
    accounts: [new Account(A, 40000), new Account(B, 10000)],
    results,
  });
}

describe("formatReport", () => {
  it("Formats a day with a successful and a failed transfer", () => {
    const expected = [
      "Starting balances",
      "  Account             Balance",
      "  1111234522226789     500.00",
      "  1212343433335665       0.00",
      "",
      "Successful transfers",
      "  From              To                   Amount",
      "  1111234522226789  1212343433335665     100.00",
      "",
      "Failed transfers",
      "  From              To                   Amount  Reason",
      "  1212343433335665  1111234522226789    9999.99  Insufficient funds",
      "",
      "Applied 1 of 2 transfers",
      "",
      "Final balances",
      "  Account             Balance",
      "  1111234522226789     400.00",
      "  1212343433335665     100.00",
    ].join("\n");

    assert.strictEqual(reportFor([success, failure]), expected);
  });

  it("Shows (none) when no transfers failed", () => {
    const expected = [
      "Starting balances",
      "  Account             Balance",
      "  1111234522226789     500.00",
      "  1212343433335665       0.00",
      "",
      "Successful transfers",
      "  From              To                   Amount",
      "  1111234522226789  1212343433335665     100.00",
      "",
      "Failed transfers",
      "  (none)",
      "",
      "Applied 1 of 1 transfers",
      "",
      "Final balances",
      "  Account             Balance",
      "  1111234522226789     400.00",
      "  1212343433335665     100.00",
    ].join("\n");

    assert.strictEqual(reportFor([success]), expected);
  });
});
