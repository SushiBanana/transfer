import { toDollars } from "./csv.js";

const ACCOUNT_WIDTH = 16;
const MONEY_WIDTH = 9;

export function formatReport({ startingBalances, accounts, results }) {
  const successes = results.filter((result) => result.succeeded);
  const failures = results.filter((result) => !result.succeeded);

  return [
    formatBalances("Starting balances", [...startingBalances]),
    formatSuccesses(successes),
    formatFailures(failures),
    `Applied ${successes.length} of ${results.length} transfers`,
    formatBalances(
      "Final balances",
      accounts.map((account) => [account.accountNumber, account.balance]),
    ),
  ].join("\n\n");
}

function formatBalances(title, balances) {
  return formatSection(
    title,
    [accountColumn("Account"), moneyColumn("Balance")],
    balances.map(([accountNumber, balance]) => [
      accountColumn(accountNumber),
      moneyColumn(toDollars(balance)),
    ]),
  );
}

function formatSuccesses(successes) {
  return formatSection(
    "Successful transfers",
    transferHeader(),
    successes.map(({ transfer }) => transferColumns(transfer)),
  );
}

function formatFailures(failures) {
  return formatSection(
    "Failed transfers",
    [...transferHeader(), "Reason"],
    failures.map(({ transfer, reason }) => [
      ...transferColumns(transfer),
      reason,
    ]),
  );
}

function formatSection(title, header, rows) {
  if (rows.length === 0) {
    return [title, "  (none)"].join("\n");
  }

  return [title, ...[header, ...rows].map(formatRow)].join("\n");
}

function transferHeader() {
  return [accountColumn("From"), accountColumn("To"), moneyColumn("Amount")];
}

function transferColumns(transfer) {
  return [
    accountColumn(transfer.fromAccountNumber),
    accountColumn(transfer.toAccountNumber),
    moneyColumn(toDollars(transfer.amount)),
  ];
}

function formatRow(columns) {
  return `  ${columns.join("  ")}`;
}

function accountColumn(text) {
  return text.padEnd(ACCOUNT_WIDTH);
}

function moneyColumn(text) {
  return text.padStart(MONEY_WIDTH);
}
