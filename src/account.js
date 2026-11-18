import { validateAccountNumber, validateAmount } from "./validation.js";

export class Account {
    #accountNumber;
    #balance;

    constructor(accountNumber, balance) {
        validateAccountNumber(accountNumber);
        this.#validateBalance(balance);

        this.#accountNumber = accountNumber;
        this.#balance = balance;
    }

    withdraw(amount) {
        validateAmount(amount);

        if (amount > this.#balance) {
            throw new Error(
                `Insufficient funds in account ${this.#accountNumber}: balance ${this.#balance}, attempted withdrawal ${amount}`
            );
        }

        this.#balance -= amount;
    }

    deposit(amount) {
        validateAmount(amount);

        this.#balance += amount;
    }

    get accountNumber() {
        return this.#accountNumber;
    }

    get balance() {
        return this.#balance;
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

}