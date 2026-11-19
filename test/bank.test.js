import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Bank } from "../src/bank.js";
import { Account } from "../src/account.js";
import { Transfer } from "../src/transfer.js";

const A = "1111234522226789";
const B = "1212343433335665";
const C = "2222123433331212";

describe("Bank.constructor", () => {
  it("Rejects duplicate account numbers", () => {
    assert.throws(
      () => new Bank([new Account(A, 500000), new Account(A, 100000)]),
      /duplicate/i,
    );
  });
});

describe("Bank.applyTransfer", () => {
  it("Moves money from one account to another", () => {
    const a = new Account(A, 500000);
    const b = new Account(B, 100000);
    const bank = new Bank([a, b]);

    bank.applyTransfer(new Transfer(A, B, 50000));

    assert.strictEqual(a.balance, 450000);
    assert.strictEqual(b.balance, 150000);
  });

  it("Rejects a transfer with insufficient funds", () => {
    const bank = new Bank([new Account(A, 50000), new Account(B, 100000)]);

    assert.throws(
      () => bank.applyTransfer(new Transfer(A, B, 60000)),
      /insufficient funds/i,
    );
  });

  it("Leaves both balances unchanged after insufficient funds", () => {
    const a = new Account(A, 50000);
    const b = new Account(B, 100000);
    const bank = new Bank([a, b]);

    assert.throws(() => bank.applyTransfer(new Transfer(A, B, 60000)));

    assert.strictEqual(a.balance, 50000);
    assert.strictEqual(b.balance, 100000);
  });

  it("Rejects an unknown from account", () => {
    const bank = new Bank([new Account(A, 500000)]);

    assert.throws(
      () => bank.applyTransfer(new Transfer(C, A, 50000)),
      /not found/i,
    );
  });

  it("Rejects an unknown to account", () => {
    const bank = new Bank([new Account(A, 500000)]);

    assert.throws(
      () => bank.applyTransfer(new Transfer(A, C, 50000)),
      /not found/i,
    );
  });

  it("Leaves the from balance unchanged when the to account is unknown", () => {
    const a = new Account(A, 500000);
    const bank = new Bank([a]);

    assert.throws(() => bank.applyTransfer(new Transfer(A, C, 50000)));

    assert.strictEqual(a.balance, 500000);
  });
});

describe("Bank.applyTransfers", () => {
  it("Uses money received earlier the same day", () => {
    const a = new Account(A, 0);
    const b = new Account(B, 50000);
    const c = new Account(C, 0);
    const bank = new Bank([a, b, c]);

    bank.applyTransfers([new Transfer(B, A, 50000), new Transfer(A, C, 50000)]);

    assert.strictEqual(a.balance, 0);
    assert.strictEqual(c.balance, 50000);
  });

  it("Continues applying transfers after a failure", () => {
    const a = new Account(A, 50000);
    const b = new Account(B, 0);
    const bank = new Bank([a, b]);

    bank.applyTransfers([
      new Transfer(A, B, 10000),
      new Transfer(B, A, 999999),
      new Transfer(A, B, 20000),
    ]);

    assert.strictEqual(a.balance, 20000);
    assert.strictEqual(b.balance, 30000);
  });

  it("Records the failed transfer with its reason", () => {
    const bank = new Bank([new Account(A, 50000), new Account(B, 0)]);
    const tooBig = new Transfer(A, B, 60000);

    const failures = bank.applyTransfers([tooBig]);

    assert.strictEqual(failures.length, 1);
    assert.strictEqual(failures[0].transfer, tooBig);
    assert.match(failures[0].reason, /insufficient funds/i);
  });

  it("Returns no failures when all transfers succeed", () => {
    const bank = new Bank([new Account(A, 500000), new Account(B, 0)]);

    const failures = bank.applyTransfers([new Transfer(A, B, 50000)]);

    assert.deepStrictEqual(failures, []);
  });
});
