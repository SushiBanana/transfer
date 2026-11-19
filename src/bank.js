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

  applyTransfer(transfer) {
    const fromAcc = this.#findAccount(transfer.fromAccountNumber);
    const toAcc = this.#findAccount(transfer.toAccountNumber);

    fromAcc.withdraw(transfer.amount);
    toAcc.deposit(transfer.amount);
  }

  applyTransfers(transfers) {
    const failures = [];

    for (const transfer of transfers) {
      try {
        this.applyTransfer(transfer);
      } catch (error) {
        failures.push({
          transfer,
          reason: error.message,
        });
      }
    }

    return failures;
  }
}
