import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Transfer } from "../src/transfer.js";

describe("Transfer.constructor", () => {
  it("Stores from, to and amount", () => {
    const transfer = new Transfer(
      "1111234522226789",
      "1212343433335665",
      50000,
    );
    assert.strictEqual(transfer.fromAccountNumber, "1111234522226789");
    assert.strictEqual(transfer.toAccountNumber, "1212343433335665");
    assert.strictEqual(transfer.amount, 50000);
  });

  it("Rejects a transfer to the same account", () => {
    assert.throws(
      () => new Transfer("1111234522226789", "1111234522226789", 50000),
      /same account/i,
    );
  });

  it("Rejects an invalid from account number", () => {
    assert.throws(
      () => new Transfer("123", "1212343433335665", 50000),
      /account number/i,
    );
  });

  it("Rejects an invalid to account number", () => {
    assert.throws(
      () => new Transfer("1111234522226789", "123", 50000),
      /account number/i,
    );
  });

  it("Rejects an invalid amount", () => {
    assert.throws(
      () => new Transfer("1111234522226789", "1212343433335665", 0),
      /amount/i,
    );
  });
});
