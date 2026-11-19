import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  toCents,
  toDollars,
  parseAccounts,
  parseTransfers,
} from "../src/csv.js";

const A = "1111234522226789";
const B = "1212343433335665";
const C = "2222123433331212";

describe("toCents", () => {
  it("Converts dollars and cents", () => {
    assert.strictEqual(toCents("5000.00"), 500000);
  });

  it("Converts cents exactly without floating-point error", () => {
    assert.strictEqual(toCents("50.10"), 5010);
  });

  it("Accepts whole dollars with no decimals", () => {
    assert.strictEqual(toCents("5000"), 500000);
  });

  it("Accepts one decimal place", () => {
    assert.strictEqual(toCents("5000.5"), 500050);
  });

  it("Rejects more than 2 decimal places", () => {
    assert.throws(() => toCents("10.999"), /amount/i);
  });

  it("Rejects text that is not a number", () => {
    assert.throws(() => toCents("abc"), /amount/i);
  });

  it("Rejects an empty value", () => {
    assert.throws(() => toCents(""), /amount/i);
  });

  it("Rejects a negative value", () => {
    assert.throws(() => toCents("-50.00"), /amount/i);
  });
});

describe("toDollars", () => {
  it("Formats dollars and cents", () => {
    assert.strictEqual(toDollars(482050), "4820.50");
  });

  it("Keeps two decimals for whole dollars", () => {
    assert.strictEqual(toDollars(500000), "5000.00");
  });

  it("Pads amounts under a dollar", () => {
    assert.strictEqual(toDollars(5), "0.05");
  });

  it("Formats zero", () => {
    assert.strictEqual(toDollars(0), "0.00");
  });
});

describe("parseAccounts", () => {
  it("Parses each line into an Account", () => {
    const accounts = parseAccounts(`${A},5000.00\n${B},320.50`);

    assert.strictEqual(accounts.length, 2);
    assert.strictEqual(accounts[0].accountNumber, A);
    assert.strictEqual(accounts[0].balance, 500000);
    assert.strictEqual(accounts[1].accountNumber, B);
    assert.strictEqual(accounts[1].balance, 32050);
  });

  it("Keeps the leading zero on account numbers", () => {
    const accounts = parseAccounts("0111234522226789,10.00");

    assert.strictEqual(accounts[0].accountNumber, "0111234522226789");
  });

  it("Ignores blank lines", () => {
    const accounts = parseAccounts(`${A},5000.00\n\n${B},320.50\n`);

    assert.strictEqual(accounts.length, 2);
  });

  it("Trims spaces around values", () => {
    const accounts = parseAccounts(` ${A} , 5000.00 `);

    assert.strictEqual(accounts[0].accountNumber, A);
    assert.strictEqual(accounts[0].balance, 500000);
  });

  it("Returns no accounts for an empty file", () => {
    assert.deepStrictEqual(parseAccounts(""), []);
  });

  it("Rejects a line with the wrong number of columns", () => {
    assert.throws(
      () => parseAccounts(`${A},5000.00\n${B},320.50,extra`),
      /line 2/i,
    );
  });

  it("Rejects an invalid row, naming its line", () => {
    assert.throws(() => parseAccounts(`${A},5000.00\n123,320.50`), /line 2/i);
  });
});

describe("parseTransfers", () => {
  it("Parses each line into a Transfer", () => {
    const transfers = parseTransfers(`${A},${B},500.00\n${B},${C},25.60`);

    assert.strictEqual(transfers.length, 2);
    assert.strictEqual(transfers[0].fromAccountNumber, A);
    assert.strictEqual(transfers[0].toAccountNumber, B);
    assert.strictEqual(transfers[0].amount, 50000);
    assert.strictEqual(transfers[1].amount, 2560);
  });

  it("Keeps the order of the file", () => {
    const transfers = parseTransfers(
      `${A},${B},1.00\n${B},${C},2.00\n${C},${A},3.00`,
    );

    assert.deepStrictEqual(
      transfers.map((transfer) => transfer.amount),
      [100, 200, 300],
    );
  });

  it("Ignores blank lines", () => {
    const transfers = parseTransfers(`${A},${B},500.00\n`);

    assert.strictEqual(transfers.length, 1);
  });

  it("Returns no transfers for an empty file", () => {
    assert.deepStrictEqual(parseTransfers(""), []);
  });

  it("Rejects a line with the wrong number of columns", () => {
    assert.throws(
      () => parseTransfers(`${A},${B},500.00\n${A},500.00`),
      /line 2/i,
    );
  });

  it("Rejects an invalid row, naming its line", () => {
    assert.throws(
      () => parseTransfers(`${A},${B},500.00\n${A},${B},abc`),
      /line 2/i,
    );
  });
});
