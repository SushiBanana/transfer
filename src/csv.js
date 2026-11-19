import { parse } from "csv-parse/sync";
import { Account } from "./account.js";
import { Transfer } from "./transfer.js";

export function toCents(text) {
  // Digits, optionally followed by a dot and 1-2 digits (e.g. 5000, 5000.5, 5000.50).
  if (!/^\d+(\.\d{1,2})?$/.test(text)) {
    throw new Error(`Amount must be in dollars like 5000.00, got ${text}`);
  }

  // Split the text instead of multiplying by 100: 50.10 * 100 is 5009.999… in JS.
  const [dollars, cents = "0"] = text.split(".");
  return Number(dollars) * 100 + Number(cents.padEnd(2, "0"));
}

export function toDollars(cents) {
  return (cents / 100).toFixed(2);
}

export function parseAccounts(text) {
  return parseRows(text, ["accountNumber", "balance"], toAccount);
}

export function parseTransfers(text) {
  return parseRows(
    text,
    ["fromAccountNumber", "toAccountNumber", "amount"],
    toTransfer,
  );
}

function toAccount(row) {
  return new Account(row.accountNumber, toCents(row.balance));
}

function toTransfer(row) {
  return new Transfer(
    row.fromAccountNumber,
    row.toAccountNumber,
    toCents(row.amount),
  );
}

function parseRows(text, columns, toObject) {
  const rows = parse(text, {
    columns,
    skip_empty_lines: true,
    trim: true,
    info: true,
  });

  return rows.map(({ record, info }) => {
    try {
      return toObject(record);
    } catch (error) {
      // info.lines is the real line in the file, counting skipped blank lines.
      throw new Error(`Line ${info.lines}: ${error.message}`);
    }
  });
}
