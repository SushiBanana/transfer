import { readFileSync } from "node:fs";
import { formatReport } from "./formatReport.js";
import { processDay } from "./processDay.js";

// Resolved relative to this file, so it works from any working directory.
const balancesPath = new URL(
  "../MableBackEndCodeTest/mable_account_balances.csv",
  import.meta.url,
);
const transfersPath = new URL(
  "../MableBackEndCodeTest/mable_transactions.csv",
  import.meta.url,
);

try {
  const balancesText = readFileSync(balancesPath, "utf-8");
  const transfersText = readFileSync(transfersPath, "utf-8");

  console.log(formatReport(processDay(balancesText, transfersText)));
} catch (error) {
  console.error(`Could not process transfers: ${error.message}`);
  process.exitCode = 1;
}
