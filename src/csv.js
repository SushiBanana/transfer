import { parse } from "csv-parse/sync";
import { Account } from "./account.js";
import { Transfer } from "./transfer.js";

export function toCents(text) {
  if (!/^\d+(\.\d{1,2})?$/.test(text)) {
    throw new Error(`Amount must be in dollars like 5000.00, got ${text}`);
  }

  const [dollars, cents = "0"] = text.split(".");
  return Number(dollars) * 100 + Number(cents.padEnd(2, "0"));
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
      throw new Error(`Line ${info.lines}: ${error.message}`);
    }
  });
}
