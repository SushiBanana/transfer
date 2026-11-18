export class Account {
    #accountNumber;
    #balance;

    constructor(accountNumber, balance) {
        this.#validateAccountNumber(accountNumber);
        this.#validateBalance(balance);

        this.#accountNumber = accountNumber;
        this.#balance = balance;
    }

    withdraw(amount) {
        this.#validateAmount(amount);

        if (amount > this.#balance) {
            throw new Error(
                `Insufficient funds in account ${this.#accountNumber}: balance ${this.#balance}, attempted withdrawal ${amount}`
            );
        }

        this.#balance -= amount;
    }

    deposit(amount) {
        this.#validateAmount(amount);

        this.#balance += amount;
    }

    get accountNumber() {
        return this.#accountNumber;
    }

    get balance() {
        return this.#balance;
    }

    #validateAccountNumber(accountNumber) {
        if (accountNumber == null) {
            throw new Error("Account number is required");
        }

        if (typeof accountNumber !== "string" || !/^\d{16}$/.test(accountNumber)) {
            throw new Error(`Account number must be a 16-digit string, got: ${accountNumber}`);
        }
    }

    #validateBalance(balance) {
        if (balance == null) {
            throw new Error("Balance is required");
        }

        if (!Number.isInteger(balance)) {
            throw new Error(`Balance must be a whole number of cents, got: ${balance}`);
        }

        if (balance < 0) {
            throw new Error(`Balance cannot be negative, got: ${balance}`);
        }
    }

    #validateAmount(amount) {
        if (!Number.isInteger(amount) || amount <= 0) {
            throw new Error(`Amount must be a positive whole number of cents, got: ${amount}`);
        }
    }
}