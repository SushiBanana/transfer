import { parseAccounts, parseTransfers } from "./csv.js";
import { Bank } from "./bank.js";

export function processDay(accountsText, transfersText) {
  const accounts = parseAccounts(accountsText);
  const transfers = parseTransfers(transfersText);

  const bank = new Bank(accounts);
  const results = bank.applyTransfers(transfers);

  return { accounts, results };
}
