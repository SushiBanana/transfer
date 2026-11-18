import { parse } from "csv-parse/sync";
import { readFileSync } from "node:fs";

const text = readFileSync(
  "MableBackEndCodeTest/mable_account_balances.csv",
  "utf-8",
);

const rows = parse(text, {
  columns: ["Account", "Balance"],
  skip_empty_lines: true,
  trim: true,
});

console.log(rows);
