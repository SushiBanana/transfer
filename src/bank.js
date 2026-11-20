export class Bank {
  #accountsByNumber;

  constructor(accounts) {
    this.#accountsByNumber = new Map();

    for (const account of accounts) {
      this.#addAccount(account);
    }
  }

  #addAccount(account) {
    if (this.#accountsByNumber.has(account.accountNumber)) {
      throw new Error(`Duplicate account number: ${account.accountNumber}`);
    }

    this.#accountsByNumber.set(account.accountNumber, account);
  }

  #findAccount(accountNumber) {
    const account = this.#accountsByNumber.get(accountNumber);

    if (account === undefined) {
      throw new Error(`Account ${accountNumber} not found`);
    }

    return account;
  }

  // Every check that can fail runs before any balance changes, so a rejected transfer leaves both accounts untouched
  applyTransfer(transfer) {
    if (transfer.fromAccountNumber === transfer.toAccountNumber) {
      throw new Error("Cannot transfer to the same account");
    }

    const fromAcc = this.#findAccount(transfer.fromAccountNumber);
    const toAcc = this.#findAccount(transfer.toAccountNumber);

    fromAcc.withdraw(transfer.amount);
    toAcc.deposit(transfer.amount);
  }

  // A failed transfer is recorded and skipped; the rest of the day still runs
  applyTransfers(transfers) {
    const results = [];

    for (const transfer of transfers) {
      try {
        this.applyTransfer(transfer);
        results.push({ transfer, succeeded: true });
      } catch (error) {
        results.push({
          transfer,
          succeeded: false,
          reason: error.message,
        });
      }
    }

    return results;
  }
}
