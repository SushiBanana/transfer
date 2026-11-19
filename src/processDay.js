import { parseAccounts, parseTransfers } from "./csv.js";
import { Bank } from "./bank.js";

export function processDay(balancesText, transfersText) {
  // Parse both files first, so a malformed file stops the day before any money moves
  const accounts = parseAccounts(balancesText);
  const transfers = parseTransfers(transfersText);

  const bank = new Bank(accounts);
  // Snapshot the balances now, because applying transfers changes the accounts
  const startingBalances = new Map(
    accounts.map((account) => [account.accountNumber, account.balance]),
  );

  const results = bank.applyTransfers(transfers);

  return { startingBalances, accounts, results };
}
